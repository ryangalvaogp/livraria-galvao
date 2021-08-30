import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import { user, UserProps } from '../../types/usersControllersTypes';
import checkAuthentication from '../../utils/checkAuthentication';
import generateToken from '../../utils/generateToken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { transport } from '../../config/mailer';
import { PasswordRecoveryLog } from '../../types/AuthControllersTypes';
import { getDateNow } from '../../utils/date';

export default {
    async auth(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const validateAuthentication = await checkAuthentication(String(email).toLowerCase(), password);

            if (!validateAuthentication.status) {
                throw new Error(validateAuthentication.error.message);
            };

            const token = generateToken(validateAuthentication.userFormated.id)

            return res.json({
                user: validateAuthentication.userFormated,
                token,
            });
        } catch (error) {
            const { message } = error;
            return res.status(401).json({ error: message });
        };
    },

    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        try {
            const user = await connection<user>('user')
                .where({ email })
                .select('id', 'name')
                .first();

            if (!user) throw new Error('User not found');

            const resetToken = crypto.randomBytes(20).toString('hex');

            const resetExpires = new Date();
            resetExpires.setHours(resetExpires.getHours() + 1);

            transport.sendMail({
                to: email,
                from: 'ryan.trompetista@gmail.com',
                subject: "Password Recovery Request",
                text: `Dear ${user.name}, our system detected a password recovery on the digital platform of the 
                Galvão bookstore. Please use this token: ${resetToken}`,
                html: `
                <p>Dear ${user.name}, our system detected a password recovery on the digital platform of the 
                Galvão bookstore</p>
                <p>Please use this token: ${resetToken}: ${resetToken}</p>
                `
            }, async (err) => {
                if (err) {
                    throw new Error('Cannot send forgot password email');
                }
                const userEmail = await connection<user>('user')
                    .select('*').where({ email }).first();

                if (!userEmail) throw new Error('Cannot send forgot password email, user not found');

                await connection<PasswordRecoveryLog>('passwordRecoveryLog').insert({
                    id: crypto.randomBytes(7).toString('hex'),
                    idUser: userEmail.id,
                    resetExpires,
                    resetToken
                })
                return res.json({ resetToken, resetExpires })
            })
        } catch (error) {
            return res.json({
                status: 'Erro on forgot password, try again',
                error: error.message,
            });
        };
    },
    async resetPassword(req: Request, res: Response) {
        const { email, password, token } = req.body;

        try {
            const user = await connection('passwordRecoveryLog')
                .innerJoin('user', 'user.id', 'passwordRecoveryLog.idUser')
                .select(
                    'passwordRecoveryLog.id as protocol', 'user.id as userId',
                    'resetToken', 'resetExpires', 'isReseted',
                )
                .where({ email })
                .orderBy('resetExpires', 'desc')
                .first();

            if (!user) throw new Error('User not found');
            if (user.isReseted) throw new Error('Recovery token has already been used');
            if (token !== user.resetToken) throw new Error('Token invalid');

            const now = new Date();

            if (now > user.resetExpires) throw new Error('Token expired, generate a new one');

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    await connection<user>('user')
                        .where('id', user.userId)
                        .update({ password: hash });

                    await connection('passwordRecoveryLog')
                        .where({ id: user.protocol })
                        .update({ isReseted: true });
                });
            });

            const tokenAcess = generateToken(user.userId);

            return res.json({ tokenAcess });
        } catch (error) {
            return res.status(400).json({
                status: 'Erro on forgot password, try again',
                error: error.message,
            });
        };
    },
    async SignInWithGoogle(req: Request, res: Response) {
        const {
            email,
            password,
        } = req.body;

        try {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    const values: UserProps['create']['crud'] = {
                        id: req.body.uid,
                        xp: 0,
                        registrationDate: getDateNow(),
                        password: hash,
                        email: email.toLowerCase(),
                        cell: req.body.phoneNumber,
                        name: req.body.displayName,
                        avatarurl: req.body.photoURL,
                        cep: req.body.cep,
                        city: req.body.city,
                        cpf: req.body.cpf,
                        n: req.body.n,
                        neighborhood: req.body.neighborhood,
                        street: req.body.street,
                        premium: req.body.premium || false,
                        permission: req.body.permission || 1,
                    };

                    await connection<user>('user').insert(values);

                    const token = generateToken(values.id);
                    return res.json({
                        status: `User ${values.name} Was Successfully Registration with google `,
                        token
                    });
                });
            });
        } catch (error) {
            return res.json({
                status: "Error registering user with google",
                error: error.message,
            });
        }
    },
    async Delete(req: Request, res: Response) {

    },
}