import { MessageReaction, PartialMessageReaction, PartialUser, Snowflake, User } from "discord.js"

/**
 * Event arguments for a new reaction being added by a user to a message
 */
export interface OnReactionAddArgs {
    /**
     * Reaction that was added by the user
     */
    reaction: MessageReaction | PartialMessageReaction;
    /**
     * User who added the reaction to the message
     */
    user: User | PartialUser;
    /**
     * Map that converts a channel ID and an emoji to a role
     */
    reactionMessages: Map<Snowflake, Map<string, string>>;
}
