import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import { UserAchievementsProps } from '../../types/userAchievementControllersTypes';
import { convertDateToPrint, getDateNow } from '../../utils/date';
import crypto from 'crypto';
import checkAuthorization, { checkToken } from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
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
            let allUserAchievements = await connection<UserAchievementsProps>
                ('userAchievements')
                .innerJoin('user', 'user.id', 'userAchievements.idUser')
                .innerJoin('achievement', 'achievement.id', 'userAchievements.idAchievement')
                .select(
                    'userAchievements.id', 'idUser', 'idAchievement', 'achievementDate',
                    'isCollected', 'name', 'email', 'cpf', 'cell', 'permission',
                    'premium', 'title', 'type', 'reward', 'amount', 'isActive', 'collectedDate'
                );
            allUserAchievements = allUserAchievements.map(userAchievements => {
                return {
                    idUserAchievemente: userAchievements.id,
                    idAchievement: userAchievements.idAchievement,
                    achievementDate: convertDateToPrint(userAchievements.achievementDate),
                    isCollected: userAchievements.isCollected,
                    collectedDate: userAchievements.collectedDate,
                    title: userAchievements.title,
                    type: userAchievements.type,
                    reward: userAchievements.reward,
                    amount: userAchievements.amount,
                    isActive: userAchievements.isActive,
                    user: {
                        idUser: userAchievements.idUser,
                        name: userAchievements.name,
                        email: userAchievements.email,
                        cpf: userAchievements.cpf,
                        cell: userAchievements.cell,
                        permission: userAchievements.permission,
                        premium: userAchievements.premium,
                    },
                };
            });

            return res.json(allUserAchievements);
        } catch (error) {
            return res.json({
                status: `Error showing all user achievements`,
                error,
            });
        };
    },

    async create(req: Request, res: Response) {
        const id = crypto.randomBytes(4).toString('hex');
        const values = req.body;
        values.idAchievement = req.headers.idachievement;
        values.idUser = req.headers.iduser;
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

            const valuesUserAchievement: UserAchievementsProps = {
                id,
                idUser: values.idUser,
                idAchievement: values.idAchievement,
                achievementDate: getDateNow(),
                isCollected: values.isCollected || false,
                collectedDate: values.isCollected === true ? getDateNow() : ''
            };
            await connection<UserAchievementsProps>
                ('userAchievements')
                .insert(valuesUserAchievement);

            return res.json({
                status: `The user achievement has been successfully registered`,
            });
        } catch (error) {
            return res.json({
                status: "Error registering the user achievement",
                error,
            });
        };
    },

    async showOne(req: Request, res: Response) {
        const { id: idUser } = req.params;
        let { authorization } = req.headers;

        try {
            await checkToken(authorization).then(res => {
                if (res.error) {
                    throw new Error(res.error);
                }
                authorization = res.authorization
            });

            if (idUser !== authorization) {
                const validateAuthorization = await checkAuthorization(authorization, 2);

                if (!validateAuthorization.status) {
                    throw new Error(validateAuthorization.error);
                };
            };

            let userAchievements = await connection<UserAchievementsProps>
                ('userAchievements')
                .innerJoin('user', 'user.id', 'userAchievements.idUser')
                .innerJoin('achievement', 'achievement.id', 'userAchievements.idAchievement')
                .where('idUser', idUser)
                .select(
                    'userAchievements.id', 'idUser', 'idAchievement', 'achievementDate',
                    'isCollected', 'name', 'email', 'cpf', 'cell', 'permission',
                    'premium', 'title', 'type', 'reward', 'amount', 'isActive',
                    'collectedDate',
                );

            userAchievements = userAchievements.map(userAchievements => {
                return {
                    idUserAchievemente: userAchievements.id,
                    idAchievement: userAchievements.idAchievement,
                    achievementDate: convertDateToPrint(userAchievements.achievementDate),
                    isCollected: userAchievements.isCollected,
                    collectedDate: userAchievements.collectedDate,
                    title: userAchievements.title,
                    type: userAchievements.type,
                    reward: userAchievements.reward,
                    amount: userAchievements.amount,
                    isActive: userAchievements.isActive,
                    user: {
                        idUser: userAchievements.idUser,
                        name: userAchievements.name,
                        email: userAchievements.email,
                        cpf: userAchievements.cpf,
                        cell: userAchievements.cell,
                        permission: userAchievements.permission,
                        premium: userAchievements.premium,
                    },
                };
            });

            return res.json(userAchievements);
        } catch (error) {
            return res.json({
                status: `Error showing user achievement`,
                error,
            });
        };
    },

    async Modify(req: Request, res: Response) {
        const { id: idUserAchievement } = req.params;
        let { authorization } = req.headers;
        const newValues = req.body;
        newValues.collectedDate = getDateNow();

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

            await connection<UserAchievementsProps>
                ('userAchievements')
                .where('id', idUserAchievement)
                .update(newValues);

            return res.json({
                status: 'The user achievement has been successfully modified',
            });
        } catch (error) {
            return res.json({
                status: 'Error modifying user achievement',
                error,
            });
        };
    },

    async Delete(req: Request, res: Response) {
        const { id: idUserAchievement } = req.params;
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
            await connection<UserAchievementsProps>('userAchievements')
                .where('id', idUserAchievement)
                .delete();

            return res.json({
                status: `Successfully deleted user achievement`,
            });
        } catch (error) {
            return res.json({
                status: `Error deleting user achievement`,
                error,
            });
        };
    },
};