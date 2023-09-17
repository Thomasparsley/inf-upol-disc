import { Client, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js"
import { DataSource } from "typeorm"

/**
 * Event arguments for a new reaction being added by a user to a message
 */
export interface OnReactionAddArgs {
    /**
     * Client that invoked this event
     */
    client: Client;
    /**
     * Reaction that was added by the user
     */
    reaction: MessageReaction | PartialMessageReaction;
    /**
     * User who added the reaction to the message
     */
    user: User | PartialUser;
    /**
     * DataSource instance used for accessing the database
     */
    db: DataSource;
}
