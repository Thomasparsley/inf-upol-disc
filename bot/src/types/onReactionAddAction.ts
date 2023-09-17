import { Awaitable } from "discord.js"
import { OnReactionAddArgs } from "../interfaces"

/**
 * Type for a function that handles a new reaction being added to a message
 */
export type OnReactionAddAction = (args: OnReactionAddArgs) => Awaitable<void>
