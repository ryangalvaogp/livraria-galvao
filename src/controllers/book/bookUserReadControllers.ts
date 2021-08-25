import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import { UserReadBook, UserReadBookMap } from '../../types/userReadBookControllersTypes';
import checkAuthorization from '../../utils/checkAuthorization';
import crypto from 'crypto';

export default {
    async index(req: Request, res: Response) {
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 2);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            const AllUserReadBooks = await connection<UserReadBook>('userReadBook')
                .innerJoin('user', 'user.id', 'userReadBook.idUser')
                .innerJoin('books', 'books.id', 'userReadBook.idBook')
                .select('*');

            const UserReadBooks = AllUserReadBooks.map((UserReadBook: UserReadBookMap) => {
                return {
                    idUserReadBook: UserReadBook.idUserReadBook,
                    dateStart: UserReadBook.dateStart,
                    dateEnd: UserReadBook.dateEnd,
                    destiny: UserReadBook.destiny,
                    assessment: UserReadBook.assessment,
                    review: UserReadBook.review,
                    isRead: UserReadBook.isRead,
                    user: {
                        idUser: UserReadBook.idUser,
                        name: UserReadBook.name,
                        email: UserReadBook.email,
                        cpf: UserReadBook.cpf,
                        cell: UserReadBook.cell,
                        registrationDate: UserReadBook.registrationDate,
                        avatarurl: UserReadBook.avatarurl,
                        adress: {
                            city: UserReadBook.city,
                            street: UserReadBook.street,
                            neighborhood: UserReadBook.neighborhood,
                            n: UserReadBook.n,
                            cep: UserReadBook.cep,
                        },
                    },
                    book: {
                        id: UserReadBook.id,
                        title: UserReadBook.title,
                        author: UserReadBook.author,
                        category: UserReadBook.category,
                        publishingCompany: UserReadBook.publishingCompany,
                        placeOfPublication: UserReadBook.placeOfPublication,
                        pages: UserReadBook.pages,
                    },
                };
            });

            return res.json(UserReadBooks);
        } catch (error) {
            return res.json({
                status: `Error showing all users read books`,
                error
            });
        };
    },

    async create(req: Request, res: Response) {
        const {
            idBook,
            isRead,
            dateStart,
            destiny,
            dateEnd,
            assessment,
            review
        } = req.body;

        const {
            idUserReadBook = crypto.randomBytes(4).toString('hex'),
            authorization
        } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 1);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            await connection<UserReadBook>('userReadBook')
                .insert({
                    assessment,
                    dateEnd,
                    dateStart,
                    destiny,
                    idBook,
                    idUser: authorization,
                    idUserReadBook,
                    isRead,
                    review
                });

            return res.json({
                status: `Book successfully registered in user ${authorization}'s passport`,
            });

        } catch (error) {
            return res.json({
                status: `Error registering book in passports`,
                error
            });
        };
    },

    async showOne(req: Request, res: Response) {
        const { authorization } = req.headers;
        const { id: idUser } = req.params;

        try {
            if (idUser !== authorization) {
                const validateAuthorization = await checkAuthorization(authorization, 2);

                if (!validateAuthorization.status) {
                    throw new Error(validateAuthorization.error);
                };
            };

            const AllUserReadBooks = await connection<UserReadBook>('userReadBook')
                .innerJoin('user', 'user.id', 'userReadBook.idUser')
                .innerJoin('books', 'books.id', 'userReadBook.idBook')
                .where('idUser', idUser)
                .select('*');

            const UserReadBooks = AllUserReadBooks.map((UserReadBook: UserReadBookMap) => {
                return {
                    idUserReadBook: UserReadBook.idUserReadBook,
                    dateStart: UserReadBook.dateStart,
                    dateEnd: UserReadBook.dateEnd,
                    destiny: UserReadBook.destiny,
                    assessment: UserReadBook.assessment,
                    review: UserReadBook.review,
                    isRead: UserReadBook.isRead,
                    user: {
                        idUser: UserReadBook.idUser,
                        name: UserReadBook.name,
                        email: UserReadBook.email,
                        cpf: UserReadBook.cpf,
                        cell: UserReadBook.cell,
                        registrationDate: UserReadBook.registrationDate,
                        avatarurl: UserReadBook.avatarurl,
                        adress: {
                            city: UserReadBook.city,
                            street: UserReadBook.street,
                            neighborhood: UserReadBook.neighborhood,
                            n: UserReadBook.n,
                            cep: UserReadBook.cep,
                        },
                    },
                    book: {
                        id: UserReadBook.id,
                        title: UserReadBook.title,
                        author: UserReadBook.author,
                        category: UserReadBook.category,
                        publishingCompany: UserReadBook.publishingCompany,
                        placeOfPublication: UserReadBook.placeOfPublication,
                        pages: UserReadBook.pages,
                    },
                };
            });

            return res.json(UserReadBooks);
        } catch (error) {
            return res.json({
                status: `Error listing all user-read books`,
                error
            });
        };
    },
    async Modify(req: Request, res: Response) {
        const { id: idUserReadBook } = req.params;
        const { authorization, iduser } = req.headers;
        const dados: UserReadBook = req.body;

        try {
            if (iduser !== authorization) {
                const validateAuthorization = await checkAuthorization(authorization, 2);

                if (!validateAuthorization.status) {
                    throw new Error(validateAuthorization.error);
                };
            };

            await connection<UserReadBook>('userReadBook')
            .where('idUserReadBook', idUserReadBook).update(dados);

            return res.json({
                status: 'Passport book successfully modified',
            });

        } catch (err) {
            return res.json({
                status: 'Unable to modify passport book',
                err,
            });
        };
    },

    async Delete(req: Request, res: Response) {
        const { id: idUserReadBook } = req.params;
        const { authorization, iduser } = req.headers;

        try {
            if (iduser !== authorization) {
                const validateAuthorization = await checkAuthorization(authorization, 3);

                if (!validateAuthorization.status) {
                    throw new Error(validateAuthorization.error);
                };
            }

            await connection<UserReadBook>('userReadBook')
                .where('idUserReadBook', idUserReadBook)
                .delete();

                return res.json({
                    status: 'Passport book successfully deleted',
                });

        } catch (err) {
            return res.json({
                status: `Error deleting user read book`,
                err,
            });
        };
    },
};