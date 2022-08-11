import { Awaitable } from "discord.js";
import { OnReadyArgs } from "../interfaces/OnReadyArgs";

export type OnReadyAction = (args: OnReadyArgs) => Awaitable<void>
