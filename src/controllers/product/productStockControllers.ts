import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import { ProductStockCrud } from '../../types/productStockControllersTypes';
import checkAuthorization from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        try {
            const allProductsInStock: ProductStockCrud[] = await connection<ProductStockCrud>('productsStock')
                .innerJoin('products', 'productsStock.idProduct', 'products.id')
                .select(
                    'idProduct',
                    'title',
                    'category',
                    'description',
                    'amount',
                    'factoryPrice',
                    'salePrice',
                    'likes',
                );

            return res.json(allProductsInStock);
        } catch (error) {
            return res.json({
                status: `Error showing all products in stock`,
                error
            });
        }
    },

    async create(req: Request, res: Response) {
        const { id: idProduct } = req.params;
        const { authorization } = req.headers;
        const values = req.body;

        values.idProduct = idProduct;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            await connection('productsStock').insert(values);

            return res.json({ status: `Successfully added product to stock` });
        } catch (error) {
            return res.json({
                status: `Error adding product to stock`,
                error
            });
        }
    },
    async showOne(req: Request, res: Response) {
        const { id: idProduct } = req.params;

        try {
            const product = await connection('productsStock')
                .innerJoin('products', 'products.id', 'productsStock.idProduct')
                .select('*')
                .where('idProduct', idProduct)
                .first();

            return res.json(product);
        } catch (error) {
            return res.json({
                status: `Error showing product from stock`,
                error
            });
        };
    },
    async Modify(req: Request, res: Response) {
        const { id: idProduct } = req.params;
        const { salePrice } = req.body;
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            await connection('productsStock')
                .where('idProduct', idProduct)
                .update({ salePrice });

            return res.json({ status: `Successfully updating product price` });
        } catch (error) {
            return res.json({
                status: `Error updating product price`,
                error
            });
        }
    },
    async Delete(req: Request, res: Response) {
        const { id: idProduct } = req.params;
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 3);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            await connection('productsStock')
                .where('idProduct', idProduct)
                .delete();

            return res.json({ status: `Successfully deleted product removed from stock successfully` });
        } catch (error) {
            return res.json({
                status: `Error removing product from stock`,
                error
            });
        };
    },
}