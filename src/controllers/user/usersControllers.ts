import { Response, Request, NextFunction } from 'express';
import { connection } from '../../database/connection';
import { user, UserProps } from '../../types/usersControllersTypes';
import crypto from 'crypto';
import { convertDateToPrint, getDateNow } from '../../utils/date';
import checkAuthorization, { checkToken } from '../../utils/checkAuthorization';
import bcrypt from 'bcrypt';
import generateToken from '../../utils/generateToken';

export default {
    async index(req: Request, res: Response, next: NextFunction) {
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
            const users = await connection<user>('user')
                .select('*');

            const allUsers = users.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    cpf: user.cpf,
                    cell: user.cell,
                    permission: user.permission,
                    premium: user.premium,
                    address: {
                        street: user.street,
                        neighborhood: user.neighborhood,
                        city: user.city,
                        cep: user.cep,
                        n: user.n,
                    },
                    xp: user.xp,
                    registrationDate: convertDateToPrint(user.registrationDate),
                    avatarUrl: user.avatarurl
                };
            });

            return res.json(allUsers);
        } catch (error) {
            return res.json({
                status: `Error showing all users `,
                error: error.message,
            });
        };
    },

    async create(req: Request, res: Response) {
        const user: UserProps['create']['request'] = req.body;
        let { authorization } = req.headers;
        const id = crypto.randomBytes(4).toString('hex');
        const xp = 0;

        try {
            
            if (user.permission > 1) {
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
            };

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(user.password, salt, async function (err, hash) {
                    //@ts-expect-error
                    const values: UserProps['create']['crud'] = user;
                    values.id = id;
                    values.xp = xp;
                    values.registrationDate = getDateNow();
                    values.password = hash;
                    values.email=values.email.toLowerCase()

                    await connection('user').insert(values);

                    const token = generateToken(values.id);
                    return res.json({
                        status: `User ${values.name} Was Successfully Registered`,
                        token
                    });
                });
            });
        } catch (error) {
            return res.json({
                status: "Error registering user",
                error: error.message,
            });
        };

    },
    async showOne(req: Request, res: Response) {
        let { authorization } = req.headers;
        const { id: idUser } = req.params;

        try {
            if (idUser !== authorization) {
                await checkToken(authorization).then(res => {
                    if (res.error) {
                        throw new Error(res.error);
                    }
                    authorization = res.authorization
                });
                const validateAuthorization = await checkAuthorization(authorization, 2);

                if (!validateAuthorization.status) {
                    console.log(validateAuthorization.error)
                    throw new Error(validateAuthorization.error);
                };
            };

            const user = await connection<user>('user')
                .where('id', idUser)
                .select('*')
                .first();

            const userFormated = {
                id: user.id,
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                cell: user.cell,
                permission: user.permission,
                premium: user.premium,
                address: {
                    street: user.street,
                    neighborhood: user.neighborhood,
                    city: user.city,
                    cep: user.cep,
                    n: user.n,
                },
                xp: user.xp,
                registrationDate: convertDateToPrint(user.registrationDate),
                avatarUrl: user.avatarurl
            };

            return res.json(userFormated);
        } catch (error) {
            return res.json({
                status: `Error showing user `,
                error:error.message
            });
        };
    },
    async Modify(req: Request, res: Response) {

    },
    async Delete(req: Request, res: Response) {

    },

    async premium(req: Request, res: Response) {
        const { id: idUser } = req.params;
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

            await connection('user')
                .where('id', idUser)
                .update({ premium: false });

            return res.json({ status: `Successfully updating user to premium` });
        } catch (error) {
            return res.json({
                status: `Error updating user to premium`,
                error:error.message
            });
        };
    },
};