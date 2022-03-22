import sequelizeAuto from 'sequelize-auto'
import database from './config/database.js';
import dotenv from 'dotenv'

dotenv.config()
const auto = new sequelizeAuto(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD,{
    lang:'esm',
    host: process.env.HOST,
    dialect: 'postgres',
    caseModel: 'c', 
    caseFile: 'c', 
    singularize: true, 
    additional: {
        timestamps: false
        
    },
    tables: ['user_tables', 'user_roles'],
    
    
   });
  auto.run();