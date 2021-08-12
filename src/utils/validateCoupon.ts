import { connection } from "../database/connection"
import { convertDateToPrint } from "./date";

export interface UserCouponsValidadeProps {
    id: string
    isCollected: boolean
    type: 'book' | 'product'
    amount: number
    isActive: boolean
    collectedDate: string
};

interface ValidadeCupomProps {
    idUser: string | string[]
    idCupom: string,
    type: 'book' | 'product'
};

export const validateCupom = async (props: ValidadeCupomProps) => {
    return new Promise<UserCouponsValidadeProps>(
        async (resolve, reject) => {
            const userCoupons: UserCouponsValidadeProps = await connection
                ('userCoupons')
                .innerJoin('user', 'user.id', 'userCoupons.idUser')
                .innerJoin('coupon', 'coupon.id', 'userCoupons.idCoupon')
                .where('idUser', props.idUser)
                .where('idCoupon', props.idCupom) //BUG - Put to idUserCoupons instead of idCoupon
                .select(
                    'userCoupons.id', 'isCollected', 'type',
                    'amount', 'isActive', 'collectedDate',
                ).first();

            if (userCoupons.isCollected) {
                reject({
                    type: 'Coupon validation',
                    message: `This coupon has already been redeemed on the day 
                    ${convertDateToPrint(userCoupons.collectedDate)}`,
                    resolution: `Use a coupon that has not been redeemed`
                });
            };

            if (userCoupons.type !== props.type) {
                reject({
                    type: 'Coupon validation',
                    message: `Coupon mode does not match, for this purchase you need to use a ${props.type} coupon instead of a ${userCoupons.type}`,
                    resolution: `Use a coupon like ${props.type}`
                });
            };

            if (!userCoupons.isActive) {
                reject({
                    type: 'Coupon validation',
                    message: `This coupon is not active`,
                    resolution: `Request activation from administrator`
                });
            };
            if(!userCoupons){
                reject({
                    type: 'Coupon validation',
                    message: `This coupon is not permited of current user`,
                    resolution: `Request from administrator`
                });
            }

            resolve(userCoupons);
        });
};

export const checkCouponExistenceInSale = async (type: ValidadeCupomProps['type'], idSale:string) => {
    return new Promise(async (resolve, reject) => {
            try {
                const couponOfSale: UserCouponsValidadeProps = await connection
                    ('useCoupon')
                    .innerJoin('userCoupons', 'userCoupons.id', 'useCoupon.idUserCoupon')
                    .where('idSale', idSale)
                    .select('*').first();
                    
                    resolve(couponOfSale)
                    return couponOfSale;
            } catch (error) {
                reject(error)
                return error;
            };
    });
};