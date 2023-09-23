import "reflect-metadata"

import { DataSource } from "typeorm"

import {
    Validation,
    Error,
    User,
    MessageReaction,
} from "./models"

const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME,
} = process.env

/**
 * Represents the database used in the application
 */
export const DatabaseSource = new DataSource({
    type: "postgres",
    host: DATABASE_HOST,
    port: parseInt(DATABASE_PORT as string),
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities: [
        Validation,
        Error,
        User,
        MessageReaction,
    ],
    synchronize: true,
    logging: false,
})
