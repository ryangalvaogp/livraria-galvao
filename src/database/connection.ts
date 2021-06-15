import knex from 'knex';
import config from '../../knexfile'
import env from 'dotenv';

env.config();

export const connection = knex(
    process.env.NODE_ENV==='development'
    ? config.development
    : config.staging
);