import express from 'express';
import productSalesControllers from './productSalesControllers';
import productsConttrollers from './productsConttrollers';
import productStockControllers from './productStockControllers';

export const productControllers = express.Router();

productControllers.get('/product', productsConttrollers.index);
productControllers.get('/product/:id', productsConttrollers.showOne);
productControllers.post('/product', productsConttrollers.create);
productControllers.delete('/product/:id', productsConttrollers.Delete);

productControllers.get('/stock/product', productStockControllers.index);
productControllers.get('/stock/product/:id', productStockControllers.showOne);
productControllers.post('/stock/product/:id', productStockControllers.create);
productControllers.put('/stock/product/:id', productStockControllers.Modify);
productControllers.delete('/stock/product/:id', productStockControllers.Delete);

productControllers.get('/purchase/product', productSalesControllers.index);
productControllers.get('/purchase/product/:id', productSalesControllers.showOne);
productControllers.post('/purchase/product/:id', productSalesControllers.create);
productControllers.delete('/purchase/product/:id', productSalesControllers.Delete);