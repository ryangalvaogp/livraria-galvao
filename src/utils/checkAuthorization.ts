import { connection } from "../database/connection";
import { user } from "../types/usersControllersTypes";

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
        }else{
            throw new Error('Current authentication user is not allowed to perform this operation');
        };

    } catch (error) {
        return {
            status: false,
            error,
        };
    };
};