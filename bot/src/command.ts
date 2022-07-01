import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction } from "discord.js";
import { DataSource } from "typeorm";
import { Result } from "./result";

export interface CommandArgs {
    client: Client;
    interaction: CommandInteraction<CacheType>;
    commands: Map<string, Command>;
    db: DataSource;
    commandRegistration: (commands: Command[]) => Promise<void>;
    reply: (content: string) => Promise<void>;
    replySilent: (content: string) => Promise<void>;
    permissionRolesCount: (predicate: Function) => Promise<Result<boolean | Error>>;
    permissionRole: (roleID: string) => Promise<Result<boolean | Error>>;
}
export type CommandAction<T> = (args: CommandArgs) => Promise<Result<T>>

export class Command {
    private name: string;
    private description: string;
    private builder: SlashCommandBuilder
        | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
        | SlashCommandSubcommandsOnlyBuilder;
    readonly execute: CommandAction<any>;

    constructor(
        name: string,
        description: string,
        builder: SlashCommandBuilder
            | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
            | SlashCommandSubcommandsOnlyBuilder,
        action: CommandAction<any>,
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

    public getBuilder(): SlashCommandBuilder
        | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand"> 
        | SlashCommandSubcommandsOnlyBuilder
    {
        return this.builder;
    }
}
