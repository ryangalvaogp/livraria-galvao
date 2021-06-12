import express from 'express';
import {route} from './routes';

const server = express();

server.use(express.json());
server.use(route);


server.listen(process.env.PORT || 3333);