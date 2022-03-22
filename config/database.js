import {Sequelize} from 'sequelize';
import dotenv from 'dotenv'
dotenv.config();

export default new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
   

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  });
