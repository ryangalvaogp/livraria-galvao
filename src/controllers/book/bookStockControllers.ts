import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import { BookStockCrud } from '../../types/stockBoockControllersTypes';
import checkAuthorization, { checkToken } from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        try {
            const allBooksInStock = await connection<BookStockCrud>('bookStock')
                .innerJoin('books', 'bookStock.idBook', 'books.id')
                .select(
                    'idBook',
                    'title',
                    'author',
                    'pages',
                    'category',
                    'editionNumber',
                    'publishingCompany',
                    'placeOfPublication',
                    'isbn',
                    'cddcdu',
                    'amount',
                    'factoryPrice',
                    'salePrice',
                    'likes',
                );

            return res.json(allBooksInStock);
        } catch (error) {
            return res.json({
                status: `Error showing all books in stock`,
                error
            });
        }
    },

    async create(req: Request, res: Response) {
        const { id: idBook } = req.params;
        let { authorization } = req.headers;
        const values = req.body;

        values.idBook = idBook;

        try {
            await checkToken(authorization).then(res => {
                if (res.error) {
                    throw new Error(res.error);
                }
                authorization = res.authorization
            });

            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            await connection('bookStock').insert(values);

            return res.json({ status: `Successfully updating book price` });
        } catch (error) {
            return res.json({
                status: `Error updating book price`,
                error
            });
        }
    },
    async showOne(req: Request, res: Response) {
        const { id: idBook } = req.params;

        try {
            const book = await connection('bookStock')
                .innerJoin('books', 'books.id', 'bookStock.idBook')
                .select('*')
                .where('idBook', idBook)
                .first();

            return res.json(book);
        } catch (error) {
            return res.json({
                status: `Error showing book from stock`,
                error
            });
        };
    },
    async Modify(req: Request, res: Response) {
        const { id: idBook } = req.params;
        const { salePrice } = req.body;
        let { authorization } = req.headers;

        try {
            await checkToken(authorization).then(res => {
                if (res.error) {
                    throw new Error(res.error);
                }
                authorization = res.authorization
            });

            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            await connection('bookStock')
                .where('idBook', idBook)
                .update({ salePrice });

            return res.json({ status: `Successfully updating book price` });
        } catch (error) {
            return res.json({
                status: `Error updating book price`,
                error
            });
        }
    },
    async Delete(req: Request, res: Response) {
        const { id: idBook } = req.params;
        let { authorization } = req.headers;

        try {
            await checkToken(authorization).then(res => {
                if (res.error) {
                    throw new Error(res.error);
                }
                authorization = res.authorization
            });

            const validateAuthorization = await checkAuthorization(authorization, 3);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            await connection('bookStock')
                .where('idBook', idBook)
                .delete();

            return res.json({ status: `Successfully deleted bookBook removed from stock successfully` });
        } catch (error) {
            return res.json({
                status: `Error removing book from stock`,
                error
            });
        };
    },
}