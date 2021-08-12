import express  from "express"
import couponsControllers from "./couponsControllers";
import userCouponsControllers from "./userCouponsControllers";

export const couponControllers = express.Router();

couponControllers.get('/coupon', couponsControllers.index);
couponControllers.get('/coupon/:id', couponsControllers.showOne);
couponControllers.post('/coupon', couponsControllers.create);
couponControllers.put('/coupon/:id', couponsControllers.Modify);
couponControllers.delete('/coupon/:id', couponsControllers.Delete);

couponControllers.get('/usercoupon/', userCouponsControllers.index);
couponControllers.get('/usercoupon/:id', userCouponsControllers.showOne);
couponControllers.post('/usercoupon/', userCouponsControllers.create);
couponControllers.put('/usercoupon/:id', userCouponsControllers.Modify);
couponControllers.delete('/usercoupon/:id', userCouponsControllers.Delete);