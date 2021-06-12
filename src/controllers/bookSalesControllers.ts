import { Response, Request } from 'express';
import crypto from 'crypto';
import { detailsPurchaseProps } from '../types/bookSalesControllersTypes';
import { getDateNow } from '../utils/date';
import { validateSale } from '../utils/validateSale';
import { connection } from '../database/connection';

export default {
    async index(req: Request, res: Response) {
        try {
            const allBookSales = await connection('bookSales')
                .select('*');

            return res.json(allBookSales);
        } catch (error) {
            return res.json({
                status: `Error showing all book sales`,
                error
            });
        }
    },

    async create(req: Request, res: Response) {
        const { id: idBook } = req.params;
        const { idclient: idClient, idemployee: idEmployee } = req.headers;
        const idSale = crypto.randomBytes(4).toString('hex');
        const detailsPurchase: detailsPurchaseProps = req.body;

        const valuesBookSale = {
            idSale,
            idClient,
            idEmployee,
            idBook,
            amount: detailsPurchase.amount,
            offeredPrice: detailsPurchase.offeredPrice,
            soldPrice: detailsPurchase.soldPrice,
            factoryPrice: detailsPurchase.factoryPrice,
            saleDate: getDateNow(),
            paymentMethod: detailsPurchase.paymentMethod,
        };

        try {
            const validation = await validateSale(valuesBookSale);

            if (validation.isValidate === false) {
                return res.json(validation)
            };

            await connection('bookSales')
                .insert(valuesBookSale);

            await connection('bookStock')
                .where('idBook', idBook)
                .update('amount', (validation.currentAmount - valuesBookSale.amount))

            return res.json({ status: 'Successful purchase' });
        } catch (error) {
            return res.json({ status: 'Purchase error', error })
        };
    },
    async showOne(req: Request, res: Response) {
        const { id: idSale } = req.params;

        try {
            const sale = await connection('bookSales')
                .select('*')
                .where('idSale', idSale)
                .first();

            return res.json(sale);
        } catch (error) {
            return res.json({
                status: `Error showing book sale`,
                error
            });
        };
    },
    async Modify(req: Request, res: Response) {

    },
    async Delete(req: Request, res: Response) {

    },
}