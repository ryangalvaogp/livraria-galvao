import express from 'express';
import roomsControllers from './roomsControllers';

export const roomControllers = express.Router();

roomControllers.get('/room', roomsControllers.index);
roomControllers.get('/room/:id', roomsControllers.showOne);
roomControllers.post('/room', roomsControllers.create);
roomControllers.delete('/room/:id', roomsControllers.Delete);