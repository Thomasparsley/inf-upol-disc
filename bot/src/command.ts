import { Awaitable, CacheType, Client, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export interface CommandArgs {
    client: Client;
    interaction: CommandInteraction<CacheType>;
    commands: Map<string, Command>;
    reply: (content: string) => Promise<void>;
    replySilent: (content: string) => Promise<void>;
    permissionRolesCount: (interaction: CommandInteraction, predicate: Function) => Promise<Boolean>;
    permissionRole: (interaction: CommandInteraction, roleID: string) => Promise<Boolean>;
}
export type CommandAction = (args: CommandArgs) => Awaitable<void>

export class Command {
    private name: string;
    private description: string;
    private builder: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;
    readonly execute: CommandAction;

    constructor(
        name: string,
        description: string,
        builder: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">,
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

    public getBuilder(): SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand"> {
        return this.builder;
    }
}
