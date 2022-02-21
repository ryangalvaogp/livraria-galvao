import { Response, Request } from 'express';
import { connection } from '../../database/connection';
import { AchievementProps } from '../../types/achievementControllerstTypes';
import crypto from 'crypto';
import useCSV from '../../utils/useCSV';
import checkAuthorization, { checkToken } from '../../utils/checkAuthorization';

export default {
    async index(req: Request, res: Response) {
        try {
            const allAchievements = await connection<AchievementProps>('achievement').select('*');

            return res.json(allAchievements);
        } catch (error) {
            return res.json({
                status: `Error showing all achievements`,
                error,
            });
        };
    },

    async create(req: Request, res: Response) {
        const id = crypto.randomBytes(4).toString('hex');
        const values = req.body;
        const csv = req.file;
        let { authorization } = req.headers;

        let valuesAchievement

        try {
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
            if (!req.file || (req.file && req.body)) {
                valuesAchievement = {
                    id,
                    title: values.title,
                    type: values.type,
                    reward: values.reward,
                    amount: values.amount,
                    isActive: values.isActive,
                };

                await connection('achievement').insert(valuesAchievement);
            };

            if (req.file && !req.body) {
                valuesAchievement = await useCSV(csv.path, 'achievement');
                for (var i = 0; i < valuesAchievement.length; i++) {
                    console.log(valuesAchievement[i])
                    await connection('achievement').insert(valuesAchievement[i]);
                };
            };

            return res.json({ status: `The achievement has been successfully registered` });
        } catch (error) {
            return res.json({
                status: "Error registering the achievement",
                error,
            });
        };
    },

    async showOne(req: Request, res: Response) {
        const { id: idAchievement } = req.params;

        try {
            const achievement = await connection('achievement')
                .select('*')
                .where('id', idAchievement)
                .first();

            return res.json(achievement);
        } catch (error) {
            return res.json({
                status: `Error showing achievement`,
                error,
            });
        };
    },

    async Modify(req: Request, res: Response) {
        const { id: idAchievement } = req.params;
        const newValues = req.body;
        let { authorization } = req.headers;

        try {
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
            await connection('achievement')
                .where('id', idAchievement)
                .update(newValues);

            return res.json({
                status: 'The achievement has been successfully modified'
            });
        } catch (error) {
            return res.json({
                status: 'Error modifying achievement',
                error,
            });
        };
    },

    async Delete(req: Request, res: Response) {
        const { id: idAchievement } = req.params;
        let { authorization } = req.headers;

        try {
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
            await connection('achievement')
                .where('id', idAchievement)
                .delete();

            return res.json({ status: `Successfully deleted achievement` });
        } catch (error) {
            return res.json({
                status: `Error deleting achievement`,
                error,
            });
        };
    },
};