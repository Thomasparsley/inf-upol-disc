import "reflect-metadata";

import { DataSource } from "typeorm";

import { 
    Validation,
    Errors,
    Users
} from "./models";

const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
} = require('../../.env');

export const DatabaseSource = new DataSource({
    type: "postgres",
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities: [
        Errors,
        Users,
        Validation,
    ],
    synchronize: true,
    logging: true,
});
