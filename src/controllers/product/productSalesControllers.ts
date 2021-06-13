import { Response, Request } from 'express';
import crypto from 'crypto';
import { detailsPurchaseProps } from '../../types/bookSalesControllersTypes';
import { getDateNow } from '../../utils/date';
import { validateSale } from '../../utils/validateSale';
import { connection } from '../../database/connection';

export default {
    async index(req: Request, res: Response) {
        try {
            const allProductSales = await connection('productSales')
                .select('*');

            return res.json(allProductSales);
        } catch (error) {
            return res.json({
                status: `Error showing all product sales`,
                error
            });
        }
    },

    async create(req: Request, res: Response) {
        const { id: idProduct } = req.params;
        const { idclient: idClient, idemployee: idEmployee } = req.headers;
        const idSale = crypto.randomBytes(4).toString('hex');
        const detailsPurchase: detailsPurchaseProps = req.body;

        const valuesProductSale = {
            idSale,
            idClient,
            idEmployee,
            idProduct,
            amount: detailsPurchase.amount,
            offeredPrice: detailsPurchase.offeredPrice,
            soldPrice: detailsPurchase.soldPrice,
            factoryPrice: detailsPurchase.factoryPrice,
            saleDate: getDateNow(),
            paymentMethod: detailsPurchase.paymentMethod,
        };

        try {
            const validation = await validateSale('product', valuesProductSale);

            if (validation.isValidate === false) {
                return res.json(validation)
            };

            await connection('productSales')
                .insert(valuesProductSale);

                console.log({
                    currentAmount:validation.currentAmount,
                    amount:valuesProductSale.amount,
                    sub:validation.currentAmount - valuesProductSale.amount
                })
            await connection('productsStock')
                .where('idProduct', idProduct)
                .update('amount', (validation.currentAmount - valuesProductSale.amount))

            return res.json({ status: 'Successful purchase' });
        } catch (error) {
            return res.json({ status: 'Purchase error', error })
        };
    },
    async showOne(req: Request, res: Response) {
        const { id: idSale } = req.params;

        try {
            const sale = await connection('productSales')
                .select('*')
                .where('idSale', idSale)
                .first();

            return res.json(sale);
        } catch (error) {
            return res.json({
                status: `Error showing product sale`,
                error
            });
        };
    },
    async Modify(req: Request, res: Response) {

    },
    async Delete(req: Request, res: Response) {
        const { id: idSale } = req.params;

        try {
            await connection('productSales')
                .where('idSale', idSale)
                .delete();

            return res.json({ status: `Successfully deleted product sale removed successfully` });
        } catch (error) {
            return res.json({
                status: `Error removing product sale`,
                error
            });
        };
    },
}