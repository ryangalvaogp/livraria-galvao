import express from 'express';
import profileControllers from './profileControllers';
import usersControllers from './usersControllers';

export const userControllers = express.Router();

userControllers.get('/user', usersControllers.index);
userControllers.get('/user/:id', usersControllers.showOne);
userControllers.post('/user', usersControllers.create);
userControllers.post('/user/premium/:id', usersControllers.premium);

userControllers.post('/auth', profileControllers.auth);
userControllers.post('/forgotPassword', profileControllers.forgotPassword);
userControllers.post('/resetPassword', profileControllers.resetPassword);

userControllers.post('/signInWithGoogle', profileControllers.SignInWithGoogle);
userControllers.post('/loginInWithGoogle', profileControllers.LoginInWithGoogle);