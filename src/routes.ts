import express from 'express';
import bookStockControllers from './controllers/bookStockControllers';
import booksControllers from './controllers/booksControllers';

import indexControllers from './controllers/indexControllers';
import usersControllers from './controllers/usersControllers';
import productsConttrollers from './controllers/productsConttrollers';
import productStockControllers from './controllers/productStockControllers';
import bookSalesControllers from './controllers/bookSalesControllers';


export const route = express.Router();

//USERS ROUTES
route.get('/user', usersControllers.index);
route.post('/user', usersControllers.create);

//BOOKS ROUTES
route.get('/book', booksControllers.index);
route.get('/book/:id', booksControllers.showOne);
route.post('/book', booksControllers.create);
route.delete('/book/:id', booksControllers.Delete);

//BOOKS STOCK ROUTES
route.get('/stock/book', bookStockControllers.index);
route.get('/stock/book/:id', bookStockControllers.showOne);
route.post('/stock/book/:id', bookStockControllers.create);
route.put('/stock/book/:id', bookStockControllers.Modify);
route.delete('/stock/book/:id', bookStockControllers.Delete);

route.get('/purchase/book', bookSalesControllers.index);
route.get('/purchase/book/:id', bookSalesControllers.showOne);
route.post('/purchase/book/:id', bookSalesControllers.create);


//PRODUCTS ROUTES
route.get('/product', productsConttrollers.index);
route.get('/product/:id', productsConttrollers.showOne);
route.post('/product', productsConttrollers.create);
route.delete('/product/:id', productsConttrollers.Delete);

//PRODUCT STOCK ROUTES
route.get('/stock/product', productStockControllers.index);
route.get('/stock/product/:id', productStockControllers.showOne);
route.post('/stock/product/:id', productStockControllers.create);
route.put('/stock/product/:id', productStockControllers.Modify);
route.delete('/stock/product/:id', productStockControllers.Delete);

route.get('/', indexControllers.index);




