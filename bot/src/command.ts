import { Awaitable, CacheType, Client, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export interface CommandArgs {
    client: Client;
    interaction: CommandInteraction<CacheType>;
    commands: Map<string, Command>;
    reply: (content: string) => Promise<void>;
    replySilent: (content: string) => Promise<void>;
}
export type CommandAction = (args: CommandArgs) => Awaitable<void>

export class Command {
    private name: string;
    private description: string;
    private builder: SlashCommandBuilder | Omit<any, any>;
    readonly execute: CommandAction;

    constructor(
        name: string,
        description: string,
        builder: SlashCommandBuilder | Omit<any, any>,
        action: CommandAction,
    ) {
        this.name = name;
        this.description = description;
        this.builder = builder;
        this.execute = action;

        (this.builder as SlashCommandBuilder).setName(this.name);
        (this.builder as SlashCommandBuilder).setDescription(this.description);
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getBuilder(): SlashCommandBuilder | Omit<any, any> {
        return this.builder;
    }
}
