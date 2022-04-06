import { Awaitable, CacheType, Client, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export interface CommandArgs {
    client: Client;
    interaction: CommandInteraction<CacheType>;
    commands: Map<string, Command>;
}
export type CommandAction = (args: CommandArgs) => Awaitable<void>

export class Command {
    private name: string;
    private description: string;
    readonly execute: CommandAction;

    constructor(
        name: string,
        description: string,
        action: CommandAction,
    ) {
        this.name = name;
        this.description = description;
        this.execute = action;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public buildSlashCommand(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName(this.getName())
            .setDescription(this.getDescription());
    }
}


export function buildSlashCommands(commands: Command[]): SlashCommandBuilder[] {
    const slashCommands: SlashCommandBuilder[] = [];

    commands.forEach((command) => {
        slashCommands.push(command.buildSlashCommand());
    });

    return slashCommands;
}
