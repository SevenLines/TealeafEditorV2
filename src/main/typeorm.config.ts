import {DataSource} from "typeorm";
require('dotenv').config()


const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: process.env.npm_lifecycle_event =="typeorm" ? ["**/models/*.entity.ts"] : ["**/models/*.entity.js"],
    subscribers: [],
    migrations: process.env.npm_lifecycle_event =="typeorm" ? ["**/migrations/*.ts"] : [],
})


export default dataSource