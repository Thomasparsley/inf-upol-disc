import { Client } from "discord.js"
import { DataSource } from "typeorm"

export interface OnReadyArgs {
    client: Client;
    db: DataSource;
}
