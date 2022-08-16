import { Client } from "discord.js";
import { DataSource } from "typeorm";
import { Command } from "../command";

export interface OnReadyArgs {
    client: Client;
    commands: Map<string, Command<any>>;
    db: DataSource;
}
