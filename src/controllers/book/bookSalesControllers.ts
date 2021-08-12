import { connection } from '../../database/connection';
import crypto from 'crypto';
import { getDateNow } from '../../utils/date';
import { checkCouponExistenceInSale, validateCupom } from '../../utils/validateCoupon';
import { validateSale } from '../../utils/validateSale';
import { Response, Request } from 'express';
import { detailsPurchaseProps, valuesBookSale } from '../../types/bookSalesControllersTypes';

export default {
    async index(req: Request, res: Response) {
        try {
            const allBookSales = await connection<valuesBookSale>('bookSales')
                .select('*');

            for (let i = 0; i < allBookSales.length; i++) {
                //@ts-ignore
                const useCoupon: valuesBookSale['useCoupon'] = await checkCouponExistenceInSale('book', allBookSales[i].idSale);

                try {
                    if (!useCoupon) {
                        throw new Error('This sale has not used Coupon')
                    };

                    for (let i = 0; i < allBookSales.length; i++) {
                        try {//@ts-ignore
                            if (useCoupon.idSale === allBookSales[i].idSale) {
                                allBookSales[i].useCoupon = useCoupon;
                            };
                        } catch (error) {
                            //No need to return anything
                        };
                    };
                } catch (error) {
                    //No need to return anything
                };
            };

            return res.json(allBookSales);
        } catch (error) {
            return res.json({
                status: `Error showing all book sales`,
                error
            });
        };
    },

    async create(req: Request, res: Response) {
        const { id: idBook } = req.params;
        const { idclient: idClient, idemployee: idEmployee } = req.headers;
        const idSale = crypto.randomBytes(4).toString('hex');
        const detailsPurchase: detailsPurchaseProps = req.body;

        let valuesBookSale = {
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
            let idUserCoupon: string;

            if (detailsPurchase.coupon) {
                const validationCoupom = await validateCupom({
                    idUser: idClient,
                    idCupom: detailsPurchase.coupon,
                    type: 'book'
                });

                valuesBookSale.soldPrice -= validationCoupom.amount;
                idUserCoupon = validationCoupom.id;
            };

            const validationSale = await validateSale('books', valuesBookSale);

            if (validationSale.isValidate === false) {
                return res.json(validationSale);
            };

            await connection('bookSales')
                .insert(valuesBookSale);

            await connection('bookStock')
                .where('idBook', idBook)
                .update('amount', (validationSale.currentAmount - valuesBookSale.amount));

            if (detailsPurchase.coupon) {
                await connection('userCoupons')
                    .where('id', idUserCoupon)
                    .update({
                        isCollected: true,
                        collectedDate: getDateNow(),
                    });

                await connection('useCoupon')
                    .insert({
                        id: crypto.randomBytes(6).toString('hex'),
                        idUserCoupon: idUserCoupon,
                        idSale
                    })
            };
            return res.json({ status: 'Successful purchase' });
        } catch (error) {
            return res.json({ status: 'Purchase error', error });
        };
    },

    async showOne(req: Request, res: Response) {
        const { id: idSale } = req.params;

        try {
            const sale = await connection('bookSales')
                .select('*')
                .where('idSale', idSale)
                .first();
            
            try {
                //@ts-ignore
                const useCoupon: valuesBookSale['useCoupon'] = await checkCouponExistenceInSale('book', sale.idSale);

                try {
                    if (!useCoupon) {
                        throw new Error('This sale has not used Coupon')
                    };

                    if (useCoupon.idSale === sale.idSale) {
                        sale.useCoupon = useCoupon;
                    };
                } catch (error) {
                     //No need to return anything
                }
            } catch (error) {
                 //No need to return anything
            }

            

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
        const { id: idSale } = req.params;

        try {
            await connection('bookSales')
                .where('idSale', idSale)
                .delete();

            return res.json({ status: `Successfully deleted book sale removed successfully` });
        } catch (error) {
            return res.json({
                status: `Error removing book sale`,
                error
            });
        };
    },
}