import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import { Product } from '../../types/productsControllersTypes';
import crypto from 'crypto';
import checkAuthorization, { checkToken } from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        try {
            const allProducts = await connection<Product>('products').select('*');

            return res.json(allProducts);
        } catch (error) {
            return res.json({
                status: `Error showing all products`,
                error
            });
        };
    },

    async create(req: Request, res: Response) {
        const product = req.body;
        let { authorization } = req.headers;
        const id = crypto.randomBytes(4).toString('hex');

        const values = product;
        values.id = id;

        const valuesProduct = {
            id,
            title: values.title,
            description: values.description,
            category: values.category,
        };

        try {
            await checkToken(authorization).then(res => {
                if (res.error) {
                    throw new Error(res.error);
                }
                authorization = res.authorization
            });
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            if (values.amount && values.salePrice && values.factoryPrice) {
                const valuesProductStock = {
                    idProduct: id,
                    amount: values.amount,
                    salePrice: values.salePrice,
                    factoryPrice: values.factoryPrice,
                };

                await connection('products').insert(valuesProduct);
                await connection('productsStock').insert(valuesProductStock);

                return res.json({ status: `The product has been successfully registered and added to stock` });
            } else {
                await connection('products').insert(valuesProduct);
                return res.json({ status: `The product has been successfully registered but not added to stock` });
            };
        } catch (error) {
            return res.json({
                status: "Error registering the product",
                error,
                values
            });
        };
    },
    async showOne(req: Request, res: Response) {
        const { id: idProduct } = req.params;

        try {
            const product = await connection('products')
                .select('*')
                .where('id', idProduct)
                .first();

            return res.json(product);
        } catch (error) {
            return res.json({
                status: `Error showing product`,
                error
            });
        };
    },
    async Modify(req: Request, res: Response) {

    },
    async Delete(req: Request, res: Response) {
        const { id: idProduct } = req.params;
        let { authorization } = req.headers;

        try {
            await checkToken(authorization).then(res => {
                if (res.error) {
                    throw new Error(res.error);
                }
                authorization = res.authorization
            });
            
            const validateAuthorization = await checkAuthorization(authorization, 3);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            await connection('products')
                .where('id', idProduct)
                .delete();

            return res.json({ status: `Successfully deleted product` });
        } catch (error) {
            return res.json({
                status: `Error deleting product`,
                error
            });
        };
    },
}