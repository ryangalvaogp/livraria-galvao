import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import { UserAchievementsProps } from '../../types/userAchievementControllersTypes';
import { getDateNow } from '../../utils/date';
import crypto from 'crypto';
import { UserCouponsProps } from '../../types/userCouponsControllersTypes';
import checkAuthorization from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            let allUserCoupons = await connection<UserCouponsProps>
                ('userCoupons')
                .innerJoin('user', 'user.id', 'userCoupons.idUser')
                .innerJoin('coupon', 'coupon.id', 'userCoupons.idCoupon')
                .select(
                    'userCoupons.id', 'idUser', 'idCoupon', 'isCollected',
                    'name', 'email', 'cpf', 'cell', 'permission', 'premium',
                    'title', 'type', 'amount', 'isActive', 'collectedDate'
                );
            allUserCoupons = allUserCoupons.map(userCoupons => {
                return {
                    idUserCoupon: userCoupons.id,
                    idCoupon: userCoupons.idCoupon,
                    isCollected: userCoupons.isCollected,
                    collectedDate: userCoupons.collectedDate,
                    title: userCoupons.title,
                    type: userCoupons.type,
                    reward: userCoupons.reward,
                    amount: userCoupons.amount,
                    isActive: userCoupons.isActive,
                    user: {
                        idUser: userCoupons.idUser,
                        name: userCoupons.name,
                        email: userCoupons.email,
                        cpf: userCoupons.cpf,
                        cell: userCoupons.cell,
                        permission: userCoupons.permission,
                        premium: userCoupons.premium,
                    },
                };
            });

            return res.json(allUserCoupons);
        } catch (error) {
            return res.json({
                status: `Error showing all user coupons`,
                error,
            });
        };
    },

    async create(req: Request, res: Response) {
        const id = crypto.randomBytes(4).toString('hex');
        const values = req.body;
        values.idCoupon = req.headers.idcoupon;
        values.idUser = req.headers.iduser;

        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            const valuesUserCoupon: UserCouponsProps = {
                id,
                idUser: values.idUser,
                idCoupon: values.idCoupon,
                isCollected: values.isCollected || false,
                collectedDate: values.isCollected === true ? getDateNow() : '',
            };

            await connection<UserCouponsProps>
                ('userCoupons')
                .insert(valuesUserCoupon);

            return res.json({
                status: `The user coupon has been successfully registered`,
            });
        } catch (error) {
            return res.json({
                status: "Error registering the user coupon",
                error,
            });
        };
    },

    async showOne(req: Request, res: Response) {
        const { id: idUser } = req.params;
        const { authorization } = req.headers;

        try {

            if (idUser !== authorization) {
                const validateAuthorization = await checkAuthorization(authorization, 2);

                if (!validateAuthorization.status) {
                    throw new Error(validateAuthorization.error);
                };
            }

            let userCoupons = await connection<UserCouponsProps>
                ('userCoupons')
                .innerJoin('user', 'user.id', 'userCoupons.idUser')
                .innerJoin('coupon', 'coupon.id', 'userCoupons.idCoupon')
                .where('idUser', idUser)
                .select(
                    'userCoupons.id', 'idUser', 'idCoupon', 'isCollected',
                    'name', 'email', 'cpf', 'cell', 'permission', 'premium',
                    'title', 'type', 'amount', 'isActive', 'collectedDate',
                );

            userCoupons = userCoupons.map(userCoupons => {
                return {
                    idUserCoupon: userCoupons.id,
                    idCoupon: userCoupons.idCoupon,
                    isCollected: userCoupons.isCollected,
                    collectedDate: userCoupons.collectedDate,
                    title: userCoupons.title,
                    type: userCoupons.type,
                    reward: userCoupons.reward,
                    amount: userCoupons.amount,
                    isActive: userCoupons.isActive,
                    user: {
                        idUser: userCoupons.idUser,
                        name: userCoupons.name,
                        email: userCoupons.email,
                        cpf: userCoupons.cpf,
                        cell: userCoupons.cell,
                        permission: userCoupons.permission,
                        premium: userCoupons.premium,
                    },
                };
            });

            return res.json(userCoupons);
        } catch (error) {
            return res.json({
                status: `Error showing user coupon`,
                error,
            });
        };
    },

    async Modify(req: Request, res: Response) {
        const { id: idUserCoupon } = req.params;
        const { authorization } = req.headers;
        const newValues = req.body;
        newValues.collectedDate = getDateNow();

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            await connection<UserAchievementsProps>
                ('userCoupons')
                .where('id', idUserCoupon)
                .update(newValues);

            return res.json({
                status: 'The user coupon has been successfully modified',
            });
        } catch (error) {
            return res.json({
                status: 'Error modifying user coupon',
                error,
            });
        };
    },

    async Delete(req: Request, res: Response) {
        const { id: idUserCoupon } = req.params;
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 3);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            await connection<UserCouponsProps>('userCoupons')
                .where('id', idUserCoupon)
                .delete();

            return res.json({
                status: `Successfully deleted user coupon`,
            });
        } catch (error) {
            return res.json({
                status: `Error deleting user coupon`,
                error,
            });
        };
    },
};