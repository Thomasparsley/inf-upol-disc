import { Client, Awaitable } from 'discord.js';

import { Command } from './command';

export interface EventArgs {
    client: Client;
    interaction: any;
    commands: Map<string, Command>;
}

export type EventAction = (args: EventArgs) => Awaitable<void>

export class Event {
    private name: string;
    readonly action: EventAction;

    constructor(
        name: string,
        action: EventAction,
    ) {
        this.name = name;
        this.action = action;
    }

    public getName(): string {
        return this.name;
    }
}
