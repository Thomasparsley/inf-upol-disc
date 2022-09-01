import { Awaitable } from "discord.js"
import { OnReactionRemoveArgs } from "../interfaces"

export type OnReactionRemoveAction = (args: OnReactionRemoveArgs) => Awaitable<void>
