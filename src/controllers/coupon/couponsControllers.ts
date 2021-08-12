import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import crypto from 'crypto';
import { CouponsProps } from '../../types/couponControllers';

export default {
    async index(req: Request, res: Response) {
        try {
            const allCoupons = await connection<CouponsProps>('coupon').select('*');

            return res.json(allCoupons);
        } catch (error) {
            return res.json({
                status: `Error showing all coupons`,
                error,
            });
        };
    },

    async create(req: Request, res: Response) {
        const id = crypto.randomBytes(4).toString('hex');
        const valuesCoupon: CouponsProps = req.body;
        valuesCoupon.id = id;
        
        try {
            await connection<CouponsProps>('coupon').insert(valuesCoupon);

            return res.json({ status: `The coupon has been successfully registered` });
        } catch (error) {
            return res.json({
                status: "Error registering the coupon",
                error,
            });
        };
    },

    async showOne(req: Request, res: Response) {
        const { id: idCoupon } = req.params;

        try {
            const coupon = await connection<CouponsProps>('coupon')
                .select('*')
                .where('id', idCoupon)
                .first();

            return res.json(coupon);
        } catch (error) {
            return res.json({
                status: `Error showing coupon`,
                error,
            });
        };
    },

    async Modify(req: Request, res: Response) {
        const { id: idCoupon } = req.params;
        const newValues = req.body;

        try {
            await connection<CouponsProps>('coupon')
                .where('id', idCoupon)
                .update(newValues);

            return res.json({
                status: 'The coupon has been successfully modified'
            });
        } catch (error) {
            return res.json({
                status: 'Error modifying coupon',
                error,
            });
        };
    },

    async Delete(req: Request, res: Response) {
        const { id: idCoupon } = req.params;

        try {
            await connection<CouponsProps>('coupon')
                .where('id', idCoupon)
                .delete();

            return res.json({ status: `Successfully deleted coupon` });
        } catch (error) {
            return res.json({
                status: `Error deleting coupon`,
                error,
            });
        };
    },
};