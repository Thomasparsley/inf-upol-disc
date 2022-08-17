import { Client, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { DataSource } from "typeorm";
import { Command } from "../command";

export interface OnReactionAddArgs {
    client: Client;
    reaction: MessageReaction | PartialMessageReaction;
    user: User | PartialUser;
    commands: Map<string, Command<any>>;
    db: DataSource;
}
