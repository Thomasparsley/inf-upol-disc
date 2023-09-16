import { MessageReaction, PartialMessageReaction, PartialUser, Snowflake, User } from "discord.js"

export interface OnReactionAddArgs {
    reaction: MessageReaction | PartialMessageReaction;
    user: User | PartialUser;
    reactionMessages: Map<Snowflake, Map<string, string>>;
}
