import { Response, Request } from 'express';
import { connection } from '../database/connection';
import { user, UserProps } from '../types/usersControllersTypes';
import crypto from 'crypto';
import { convertDateToPrint, getDateNow } from '../utils/date';

export default {
    async index(req: Request, res: Response) {
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
            }
        });

        return res.json(allUsers);
    },

    async create(req: Request, res: Response) {
        const user: UserProps['create']['request'] = req.body;
        const id = crypto.randomBytes(4).toString('hex');
        const xp = 0;
        const registrationDate = getDateNow();

        //@ts-expect-error
        const values: UserProps['create']['crud'] = user;
        values.id = id;
        values.xp = xp;
        values.registrationDate = registrationDate;

        try {
            await connection('user').insert(values);
            return res.json({ status: `Usuário ${values.name} foi Cadastrado com sucesso` });
        } catch (error) {
            return res.json({ status: "Erro ao cadastrar usuário", error });
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

        try {
            await connection('user')
                .where('id', idUser)
                .update({ premium: true });

            return res.json({ status: `Successfully updating user to premium` });
        } catch (error) {
            return res.json({
                status: `Error updating user to premium`,
                error
            });
        };
    },
};