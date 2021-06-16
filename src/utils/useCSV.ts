import crypto from 'crypto';
import { AchievementProps } from '../types/achievementControllerstTypes';
import cJ from 'csvtojson';
import { connection } from '../database/connection';

export const useCSV = async (pathCSV: string) => {
    return new Promise<AchievementProps[]>(async (resolve, reject) => {
        const jsonConquistas = await cJ().fromFile(pathCSV);
        const valuesAchievementCSV = jsonConquistas.map((achievement: AchievementProps) => {
            const id = crypto.randomBytes(4).toString('hex');
            const isActive = true;//This could be in global config

            return {
                id,
                title: achievement.title,
                type: achievement.type,
                reward: achievement.reward,
                amount: Number(achievement.amount),
                isActive,
            }
        });
      
        resolve(valuesAchievementCSV)
        return valuesAchievementCSV;
    });
};
