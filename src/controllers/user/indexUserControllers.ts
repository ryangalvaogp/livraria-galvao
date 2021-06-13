import express from 'express';
import usersControllers from './usersControllers';

export const userControllers = express.Router();

userControllers.get('/user', usersControllers.index);
userControllers.post('/user', usersControllers.create);
userControllers.post('/user/premium/:id', usersControllers.premium);