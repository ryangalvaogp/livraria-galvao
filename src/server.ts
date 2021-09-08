import express from 'express';
import { route } from './routes';
import cors from 'cors';

const server = express();

server.use(express.json());
server.use(cors());
server.use(route);

server.listen(process.env.PORT || 3333);