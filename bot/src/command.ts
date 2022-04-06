import { SlashCommandBuilder } from "@discordjs/builders";

import { EventAction } from "./event";

export class Command {
    private name: string;
    private description: string;
    readonly action: EventAction;

    constructor(
        name: string,
        description: string,
        action: EventAction,
    ) {
        this.name = name;
        this.description = description;
        this.action = action;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }
}


export function buildSlashCommand(commands: Command[]): SlashCommandBuilder[] {
    const slashCommands: SlashCommandBuilder[] = [];

    commands.forEach((command) => {
        slashCommands.push(
            new SlashCommandBuilder()
                .setName(command.getName())
                .setDescription(command.getDescription())
        );
    });

    return slashCommands;
}
