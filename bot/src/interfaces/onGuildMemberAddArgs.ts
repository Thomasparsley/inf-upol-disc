import { Client, GuildMember } from "discord.js"

/**
 * Event arguments for a user joining a guild (server) the bot is part of
 */
export interface OnGuildMemberAddArgs {
    /**
     * Client that invoked this event
     */
    client: Client
    /**
     * Member that joined the server
     */
    member: GuildMember
}
