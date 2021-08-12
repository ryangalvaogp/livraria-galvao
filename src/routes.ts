import express from 'express';

import { achievementControllers } from './controllers/achievement/indexAchievementControllers';
import { bookControllers } from './controllers/book/indexBookControllers';
import { couponControllers } from './controllers/coupon/indexCouponControllers';
import { mainControll } from './controllers/main/indexMainControllers';
import { productControllers } from './controllers/product/indexProductControllers';
import { roomControllers } from './controllers/room/indexRoomControllers';
import { tableControllers } from './controllers/table/indexTableControllers';
import { userControllers } from './controllers/user/indexUserControllers';

export const route = express.Router();

route.use(mainControll);
route.use(userControllers);
route.use(bookControllers);
route.use(productControllers);
route.use(roomControllers);
route.use(tableControllers);
route.use(achievementControllers);
route.use(couponControllers);