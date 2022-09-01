import { Awaitable } from "discord.js"
import { OnReactionAddArgs } from "../interfaces"

export type OnReactionAddAction = (args: OnReactionAddArgs) => Awaitable<void>
