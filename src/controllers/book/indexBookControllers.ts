import express from 'express';
import bookSalesControllers from './bookSalesControllers';
import booksControllers from './booksControllers';
import bookStockControllers from './bookStockControllers';
import bookUserReadControllers from './bookUserReadControllers';
export const bookControllers = express.Router();
import booksImportCsv from '../../config/multer/booksImportCsv';
import multer from 'multer';

const configUpload = multer(booksImportCsv)

bookControllers.get('/book', booksControllers.index);
bookControllers.get('/book/:id', booksControllers.showOne);
bookControllers.post('/book', configUpload.single('csv'), booksControllers.create);
bookControllers.delete('/book/:id', booksControllers.Delete);

bookControllers.get('/stock/book', bookStockControllers.index);
bookControllers.get('/stock/book/:id', bookStockControllers.showOne);
bookControllers.post('/stock/book/:id', bookStockControllers.create);
bookControllers.put('/stock/book/:id', bookStockControllers.Modify);
bookControllers.delete('/stock/book/:id', bookStockControllers.Delete);

bookControllers.get('/purchase/book', bookSalesControllers.index);
bookControllers.get('/purchase/book/:id', bookSalesControllers.showOne);
bookControllers.post('/purchase/book/:id', bookSalesControllers.create);
bookControllers.put('/purchase/book/:id', bookSalesControllers.Modify);
bookControllers.delete('/purchase/book/:id', bookSalesControllers.Delete);

bookControllers.get('/passport/', bookUserReadControllers.index);
bookControllers.get('/passport/:id', bookUserReadControllers.showOne);
bookControllers.post('/passport/', bookUserReadControllers.create);
bookControllers.put('/passport/:id', bookUserReadControllers.Modify);
bookControllers.delete('/passport/:id', bookUserReadControllers.Delete);