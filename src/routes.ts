import express from 'express';
import { bookControllers } from './controllers/book/indexBookControllers';
import { mainControll } from './controllers/main/indexMainControllers';
import { productControllers } from './controllers/product/indexProductControllers';
import { userControllers } from './controllers/user/indexUserControllers';

export const route = express.Router();

route.use(mainControll);
route.use(userControllers);
route.use(bookControllers);
route.use(productControllers);