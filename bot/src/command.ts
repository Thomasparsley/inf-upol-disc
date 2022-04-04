import { Awaitable } from "discord.js";

export interface Command {
    event: string,
    listener: (...args: any[]) => Awaitable<void>
}
