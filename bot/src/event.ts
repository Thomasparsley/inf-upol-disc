import { Client, Awaitable } from "discord.js";

export interface EventArgs {
    client: Client
    interaction: any
    commands: Map<string, Command>
}

export type EventAction = (args: EventArgs) => Awaitable<void>

export class Event {
    name: string;
    action: EventAction;

    constructor(
        name: string,
        action: EventAction
    ) {
        this.name = name;
        this.action = action;
    }
}