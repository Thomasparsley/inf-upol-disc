import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction } from "discord.js";
import { DataSource } from "typeorm";
import { Mailer } from "./mailer";

export interface CommandArgs {
    client: Client;
    interaction: CommandInteraction<CacheType>;
    commands: Map<string, Command>;
    db: DataSource;
    mailer: Mailer;
    commandRegistration: (commands: Command[]) => Promise<void>;
    reply: (content: string) => Promise<void>;
    replySilent: (content: string) => Promise<void>;
    permissionRolesCount: (predicate: Function) => boolean;
    permissionRole: (roleID: string) => boolean;
}
export type CommandAction = (args: CommandArgs) => Promise<void>

export class Command {
    constructor(
        private name: string,
        private description: string,
        private builder: SlashCommandBuilder
            | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
            | SlashCommandSubcommandsOnlyBuilder,
        public readonly execute: CommandAction,
    ) {
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
