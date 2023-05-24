import {Sequelize} from "sequelize";
import pg = require('pg');
require('dotenv').config()

console.log("CWD:")
console.log(process.cwd());
console.log("ENV:")
console.log(process.env)


export const db = new Sequelize({
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_DATABASE,
    "port": parseInt(process.env.DB_PORT ?? '5432'),
    "host": process.env.DB_HOST,
    "dialect":"postgres",
    dialectModule: pg,
});


module.exports = {
    db: db,
};