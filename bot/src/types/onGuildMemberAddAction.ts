import { Awaitable } from "discord.js"
import { OnGuildMemberAddArgs } from "../interfaces"

/**
 * Type for a function that handles a new user joining a guild (server)
 */
export type OnGuildMemberAddAction = (args: OnGuildMemberAddArgs) => Awaitable<void>
