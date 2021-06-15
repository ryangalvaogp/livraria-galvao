// Update with your config settings.
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_LOCAL_CONNECTION_HOST,
      user: process.env.PG_LOCAL_CONNECTION_USER,
      password: process.env.PG_LOCAL_CONNECTION_PASSWORD,
      database: process.env.PG_LOCAL_CONNECTION_DATABASE,
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'pg',
    connection: {
      host: process.env.PG_CONNECTION_HOST,
      user: process.env.PG_CONNECTION_USER,
      password: process.env.PG_CONNECTION_PASSWORD,
      database: process.env.PG_CONNECTION_DATABASE,
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },
};
