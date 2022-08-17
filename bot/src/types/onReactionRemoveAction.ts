import { Awaitable } from "discord.js";
import { OnReactionRemoveArgs } from "../interfaces";

export type onReactionRemoveAction = (args: OnReactionRemoveArgs) => Awaitable<void>
