import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import { user, UserProps } from '../../types/usersControllersTypes';
import crypto from 'crypto';
import { getDateNow } from '../../utils/date';
import checkAuthorization from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        const { authorization } = req.headers;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 1);

            if (!validateAuthorization.status) {
                console.log(validateAuthorization.error)
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
                    registrationDate: user.registrationDate,
                    avatarUrl: user.avatarurl
                };
            });

            return res.json(allUsers);
        } catch (error) {          
            return res.json({
                status: `Error showing all users `,
                error
            });
        };
    },

    async create(req: Request, res: Response) {
        const user: UserProps['create']['request'] = req.body;
        const { authorization } = req.headers;
        const id = crypto.randomBytes(4).toString('hex');
        const xp = 0;
        const registrationDate = getDateNow();

        //@ts-expect-error
        const values: UserProps['create']['crud'] = user;
        values.id = id;
        values.xp = xp;
        values.registrationDate = registrationDate;

        try {
            const validateAuthorization = await checkAuthorization(authorization, 3);

            if (!validateAuthorization.status) {
                throw new Error(validateAuthorization.error);
            };

            await connection('user').insert(values);
            return res.json({ status: `User ${values.name} Was Successfully Registered` });
        } catch (error) {
            return res.json({
                status: "Error registering user",
                error,
            });
        };

    },
    async showOne(req: Request, res: Response) {

    },
    async Modify(req: Request, res: Response) {

    },
    async Delete(req: Request, res: Response) {

    },

    async premium(req: Request, res: Response) {
        const { id: idUser } = req.params;
        const { authorization } = req.headers;

        try {
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
                error
            });
        };
    },
};