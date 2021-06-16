import express from 'express';
import achievementsControllers from './achievementsControllers';
import multer from 'multer';
import achievementImportCSV from '../../config/multer/achievementImportCSV';
import userAchievementsControllers from './userAchievementsControllers';

export const achievementControllers = express.Router();
const configUpload = multer(achievementImportCSV)

achievementControllers.get('/achievement', achievementsControllers.index);
achievementControllers.get('/achievement/:id', achievementsControllers.showOne);
achievementControllers.post('/achievement', configUpload.single('csv'), achievementsControllers.create);
achievementControllers.put('/achievement/:id', achievementsControllers.Modify);
achievementControllers.delete('/achievement/:id', achievementsControllers.Delete);

achievementControllers.get('/userachievement/', userAchievementsControllers.index);
achievementControllers.get('/userachievement/:id', userAchievementsControllers.showOne);
achievementControllers.post('/userachievement/', userAchievementsControllers.create);
achievementControllers.put('/userachievement/:id', userAchievementsControllers.Modify);
achievementControllers.delete('/userachievement/:id', userAchievementsControllers.Delete);