import { Awaitable } from "discord.js";

export class Command {
    eventName: string;
    event: (...args: any[]) => Awaitable<void>;

    constructor(
        eventName: string,
        event: (...args: any[]) => Awaitable<void>
    ) {
        this.eventName = eventName;
        this.event = event;
    }
}