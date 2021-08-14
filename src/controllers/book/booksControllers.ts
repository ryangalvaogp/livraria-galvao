import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import crypto from 'crypto';
import { Book, BookProps } from '../../types/booksControllers'
import checkAuthorization from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        try {
            const allBooks = await connection<Book>('books').select('*');

            return res.json(allBooks);
        } catch (error) {
            return res.json({
                status: `Error showing all books`,
                error
            });
        };
    },

    async create(req: Request, res: Response) {
        const book = req.body;
        const { authorization } = req.headers;
        const id = crypto.randomBytes(4).toString('hex');

        const values: BookProps['create']['crud']['tableBook'] = book;
        values.id = id;

        const valuesBook = {
            id,
            title: values.title,
            author: values.author,
            isbn: values.isbn,
            category: values.category,
            editionNumber: values.editionNumber,
            publishingCompany: values.publishingCompany,
            placeOfPublication: values.placeOfPublication,
            pages: values.pages,
            cddcdu: values.cddcdu,
        };


        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            if (values.amount && values.salePrice && values.factoryPrice) {
                const valuesBookStock = {
                    idBook: id,
                    amount: values.amount,
                    salePrice: values.salePrice,
                    factoryPrice: values.factoryPrice,
                };

                await connection('books').insert(valuesBook);
                await connection('bookStock').insert(valuesBookStock);

                return res.json({ status: `The book has been successfully registered and added to stock` });
            } else {
                await connection('books').insert(valuesBook);
                return res.json({ status: `The book has been successfully registered but not added to stock` });
            };
        } catch (error) {
            return res.json({
                status: "Error registering the book",
                error,
                values
            });
        };
    },

    async showOne(req: Request, res: Response) {
        const { id: idBook } = req.params;

        try {
            const book = await connection('books')
                .select('*')
                .where('id', idBook)
                .first();

            return res.json(book);
        } catch (error) {
            return res.json({
                status: `Error showing book`,
                error
            });
        };
    },

    async Modify(req: Request, res: Response) {

    },

    async Delete(req: Request, res: Response) {
        const { id: idBook } = req.params;
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };
            await connection('books')
                .where('id', idBook)
                .delete();

            return res.json({ status: `Successfully deleted book` });
        } catch (error) {
            return res.json({
                status: `Error deleting book`,
                error
            });
        };
    },
};