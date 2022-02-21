import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import crypto from 'crypto';
import { Book, BookProps } from '../../types/booksControllers'
import checkAuthorization, { checkToken } from '../../utils/checkAuthorization';
import useCSV from '../../utils/useCSV';

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
        let { authorization } = req.headers;
        const id = crypto.randomBytes(4).toString('hex'); //É necessário pois será utilizado 2x
        const csv = req.file;
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

            //Inserção através arquivo CSV

            if (req.file) {
                try {
                    let valuesBook = await useCSV(csv.path, 'books');
                    var message;

                    //@ts-ignore
                    valuesBook.map(async (book: BookProps['create']['crud']['tableBook']) => {
                        if (book.amount || book.salePrice || book.factoryPrice) {
                            let stockValues = {
                                idBook: book.id,
                                amount: book.amount,
                                salePrice: book.salePrice,
                                factoryPrice: book.factoryPrice,
                            };

                            delete book.amount;
                            delete book.salePrice;
                            delete book.factoryPrice;

                            await connection('books').insert(book);
                            await connection('bookStock').insert(stockValues);
                            message = 'The book has been successfully registered and added to stock';
                        } else {
                            await connection('books').insert(book);
                            message = `The book has been successfully registered but not added to stock`;
                        }
                    });

                    return res.send(message)
                } catch (error) {
                    return res.json({
                        status: "Error registering the book on CSV",
                        error,
                        values
                    });
                };
            };

            //Inserção Normal
            try {
                if (values.amount && values.salePrice && values.factoryPrice && !req.file) {
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
            }

        } catch (error) {
            return res.json({
                status: "Error generaly",
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