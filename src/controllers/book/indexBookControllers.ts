import express from 'express';
import bookSalesControllers from './bookSalesControllers';
import booksControllers from './booksControllers';
import bookStockControllers from './bookStockControllers';

export const bookControllers = express.Router();

bookControllers.get('/book', booksControllers.index);
bookControllers.get('/book/:id', booksControllers.showOne);
bookControllers.post('/book', booksControllers.create);
bookControllers.delete('/book/:id', booksControllers.Delete);

bookControllers.get('/stock/book', bookStockControllers.index);
bookControllers.get('/stock/book/:id', bookStockControllers.showOne);
bookControllers.post('/stock/book/:id', bookStockControllers.create);
bookControllers.put('/stock/book/:id', bookStockControllers.Modify);
bookControllers.delete('/stock/book/:id', bookStockControllers.Delete);

bookControllers.get('/purchase/book', bookSalesControllers.index);
bookControllers.get('/purchase/book/:id', bookSalesControllers.showOne);
bookControllers.post('/purchase/book/:id', bookSalesControllers.create);
bookControllers.delete('/purchase/book/:id', bookSalesControllers.Delete);