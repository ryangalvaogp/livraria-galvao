import { connection } from "../database/connection";
import { user } from "../types/usersControllersTypes";
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';
export default async function checkAuthorization(id: string, rolePermissionLevel: number) {
    try {
        const user = await connection<user>('user')
            .where('id', id)
            .select('id', 'permission')
            .first();

        if (!user) {
            throw new Error('Current authentication user is not allowed to perform this operation, or user does not exist');
        };

        if (user.permission >= rolePermissionLevel || user.permission === 3) {
            return {
                status: true,
                user,
            };
        } else {
            throw new Error('Current authentication user is not allowed to perform this operation');
        };

    } catch (error) {
        return {
            status: false,
            error,
        };
    };
};

export async function checkToken(authorization: string) {
    try {
       
        if (!authorization) {
            throw new Error('No token provided');
        };

        const parts = authorization.split(' ');
        
        if (parts.length !== 2) {
            throw new Error('token error');
        };
        const [scheme, token] = parts;

        if (!/^b21db70a38b2a93331dd1887f00588f5$/i.test(scheme)) {
            throw new Error('token malformatted');
        };

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) throw new Error('token invalid');

            authorization = decoded.id;
        });

        return {
            status: true,
            authorization
        };
    } catch (error) {
        return {
            status: false,
            error,
        };
    };
};