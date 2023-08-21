import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


let database;
let user;
let password;
let host;  

database = 'toursight_database' ;
user = 'root';
password = '';  // password untuk server: 'rootpassword'
host = 'localhost'; // host server db: '34.101.186.29'

const db = new Sequelize (database, user, password,{
    host: host,
    dialect: 'mysql'
});

export default db;





