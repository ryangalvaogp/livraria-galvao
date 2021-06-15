import express from 'express';
import tablesControllers from './tablesControllers';

export const tableControllers = express.Router();

tableControllers.get('/table', tablesControllers.index);
tableControllers.get('/table/:id', tablesControllers.showOne);
tableControllers.get('/table/room/:id', tablesControllers.showAllTablesInTheRoom)
tableControllers.post('/table', tablesControllers.create);
tableControllers.delete('/table/:id', tablesControllers.Delete);