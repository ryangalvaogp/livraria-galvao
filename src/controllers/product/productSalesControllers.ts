import { connection } from '../../database/connection';
import crypto from 'crypto';
import { getDateNow } from '../../utils/date';
import { checkCouponExistenceInSale, validateCupom } from '../../utils/validateCoupon';
import { validateSale } from '../../utils/validateSale';
import { Response, Request } from 'express';
import { detailsPurchaseProps, valuesBookSale } from '../../types/bookSalesControllersTypes';
import checkAuthorization from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            const allProductSales = await connection('productSales')
                .select('*');

            for (let i = 0; i < allProductSales.length; i++) {
                //@ts-ignore
                const useCoupon: valuesBookSale['useCoupon'] = await checkCouponExistenceInSale('product', allProductSales[i].idSale);

                try {
                    if (!useCoupon) {
                        throw new Error('This sale has not used Coupon')
                    };
                    for (let i = 0; i < allProductSales.length; i++) {
                        try {//@ts-ignore
                            if (useCoupon.idSale === allProductSales[i].idSale) {
                                allProductSales[i].useCoupon = useCoupon;
                            };
                        } catch (error) {
                            //No need to return anything
                        };
                    };
                } catch (error) {
                    console.log(error)//No need to return anything
                }
            };

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
        const {
            idclient: idClient,
            idemployee: idEmployee,
            authorization
        } = req.headers;
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
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };


            let idUserCoupon: string;

            if (detailsPurchase.coupon) {
                const validationCoupom = await validateCupom({
                    idUser: idClient,
                    idCupom: detailsPurchase.coupon,
                    type: 'product',
                });

                valuesProductSale.soldPrice -= validationCoupom.amount;
                idUserCoupon = validationCoupom.id;
            };

            const validation = await validateSale('product', valuesProductSale);

            if (!validation.isValidate) {
                return res.json(validation);
            };

            await connection('productSales')
                .insert(valuesProductSale);

            await connection('productsStock')
                .where('idProduct', idProduct)
                .update('amount', (validation.currentAmount - valuesProductSale.amount));

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
            return res.json({ status: 'Purchase error', error })
        };
    },
    async showOne(req: Request, res: Response) {
        const { id: idSale } = req.params;
        const { authorization } = req.headers;

        try {

            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            const sale = await connection('productSales')
                .select('*')
                .where('idSale', idSale)
                .first();

            try {
                //@ts-ignore
                const useCoupon: valuesBookSale['useCoupon'] = await checkCouponExistenceInSale('product', sale.idSale);

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
                status: `Error showing product sale`,
                error
            });
        };
    },
    async Modify(req: Request, res: Response) {

    },
    async Delete(req: Request, res: Response) {
        const { id: idSale } = req.params;
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 3);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

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