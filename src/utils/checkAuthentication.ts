import { connection } from "../database/connection";
import { user } from "../types/usersControllersTypes";
import bcrypt from 'bcrypt';

export default async function checkAuthentication(email: string, password: string) {
    try {
        const user = await connection<user>('user')
            .where('email', email)
            .first();

        if (!user) {
            throw new Error('User not found');
        };

        if (!await bcrypt.compare(password, user.password)) {
            throw new Error('Invalid password');
        };

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
            registrationDate: user.registrationDate,
            avatarUrl: user.avatarurl
        };

        return {
            status: true,
            userFormated
        };
    } catch (error) {
        return {
            status: false,
            error
        };
    };
};