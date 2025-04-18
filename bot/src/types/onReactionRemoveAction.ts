import { Awaitable } from "discord.js"
import { OnReactionRemoveArgs } from "../interfaces"

/**
 * Type for a function that handles a reaction being removed from a message
 */
export type OnReactionRemoveAction = (args: OnReactionRemoveArgs) => Awaitable<void>
