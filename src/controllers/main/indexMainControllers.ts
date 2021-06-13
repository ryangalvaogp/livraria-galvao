import express from 'express';
import mainControllers from './mainControllers';

export const mainControll = express.Router();

mainControll.get('/', mainControllers.index);