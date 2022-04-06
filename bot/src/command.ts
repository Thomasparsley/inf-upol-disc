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
    private builder: SlashCommandBuilder;
    readonly execute: CommandAction;

    constructor(
        name: string,
        description: string,
        builder: SlashCommandBuilder,
        action: CommandAction,
    ) {
        this.name = name;
        this.description = description;
        this.builder = builder;
        this.execute = action;

        this.builder.setName(this.name);
        this.builder.setDescription(this.description);
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getBuilder(): SlashCommandBuilder {
        return this.builder;
    }
}
