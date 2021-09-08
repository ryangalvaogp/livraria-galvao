import { connection } from '../../database/connection';
import crypto from 'crypto';
import { getDateNow } from '../../utils/date';
import { checkCouponExistenceInSale, validateCupom } from '../../utils/validateCoupon';
import { validateSale } from '../../utils/validateSale';
import { Response, Request } from 'express';
import { detailsPurchaseProps, valuesBookSale, valuesBookSaleUpdate } from '../../types/bookSalesControllersTypes';
import checkAuthorization, { checkToken } from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        let { authorization } = req.headers;

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
        const {
            idclient: idClient,
            idemployee: idEmployee,
        } = req.headers;

        let { authorization } = req.headers
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
        let { authorization } = req.headers;

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
        const { id: idSale } = req.params;
        let { authorization } = req.headers;
        let values:valuesBookSaleUpdate = req.body;

        if (values.isClosed) values.closedDate = getDateNow();

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

            await connection('bookSales')
                .where('idSale', idSale)
                .update(values);

            return res.json({
                status: `Sale information has been updated successfully`,
                values
            })
        } catch (error) {
            return res.json({
                status: `Error updating book sale`,
                error: error.message,
            });
        }

    },
    async Delete(req: Request, res: Response) {
        const { id: idSale } = req.params;
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