import { Client, GuildMember } from "discord.js"

export interface OnGuildMemberAddArgs {
    client: Client
    member: GuildMember
}
