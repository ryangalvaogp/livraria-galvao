import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';

export default function (id: string) {
    return jwt.sign({
        id
    },
        authConfig.secret,
        {
            expiresIn: 86400,
        });
};