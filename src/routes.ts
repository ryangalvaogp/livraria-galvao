import express from 'express';
import bookStockControllers from './controllers/bookStockControllers';
import booksControllers from './controllers/booksControllers';

import indexControllers from './controllers/indexControllers';
import usersControllers from './controllers/usersControllers';


export const route = express.Router();

route.get('/user', usersControllers.index);
route.post('/user', usersControllers.create);

route.get('/book', booksControllers.index);
route.get('/book/:id', booksControllers.showOne);
route.post('/book', booksControllers.create);
route.delete('/book/:id', booksControllers.Delete);

route.get('/stock/book', bookStockControllers.index);
route.post('/stock/book/:id', bookStockControllers.create);
route.put('/stock/book/:id', bookStockControllers.Modify);
route.delete('/stock/book/:id', bookStockControllers.Delete);

route.get('/', indexControllers.index);




