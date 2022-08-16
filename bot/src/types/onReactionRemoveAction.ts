import { Awaitable } from "discord.js";
import { OnReactionRemoveArgs } from "../interfaces/onReactionRemoveArgs";

export type onReactionRemoveAction = (args: OnReactionRemoveArgs) => Awaitable<void>
