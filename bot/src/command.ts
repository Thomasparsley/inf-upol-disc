import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandAction } from "./types";


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
