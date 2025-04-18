import { Client } from "discord.js"
import { DataSource } from "typeorm"

/**
 * Event arguments of the Discord client being ready
 */
export interface OnReadyArgs {
    /**
     * Client that invoked this event
     */
    client: Client;
    /**
     * DataSource instance used for accessing the database
     */
    db: DataSource;
}
