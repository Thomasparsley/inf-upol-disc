import { Client, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js"
import { DataSource } from "typeorm"

/**
 * Event arguments for a reaction being removed from a message
 */
export interface OnReactionRemoveArgs {
    /**
     * Client that invoked this event
     */
    client: Client;
    /**
     * Reaction that was removed from the message
     */
    reaction: MessageReaction | PartialMessageReaction;
    /**
     * User that removed the reaction
     */
    user: User | PartialUser;
    /**
     * DataSource instance used for accessing the database
     */
    db: DataSource;
}
