import { Awaitable } from "discord.js";
import { OnReactionAddArgs } from "../interfaces/onReactionAddArgs";

export type onReactionAddAction = (args: OnReactionAddArgs) => Awaitable<void>
