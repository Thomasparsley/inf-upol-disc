import { Awaitable } from "discord.js"
import { OnReactionAddArgs } from "../interfaces"

export type onReactionAddAction = (args: OnReactionAddArgs) => Awaitable<void>
