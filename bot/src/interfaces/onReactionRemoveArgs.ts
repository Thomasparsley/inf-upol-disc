import { Client, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js"
import { DataSource } from "typeorm"

export interface OnReactionRemoveArgs {
    client: Client;
    reaction: MessageReaction | PartialMessageReaction;
    user: User | PartialUser;
    db: DataSource;
}
