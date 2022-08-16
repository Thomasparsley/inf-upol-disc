import { CommandAction } from "./types";
import {
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    CacheType,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    SelectMenuInteraction
} from "discord.js";


type BuilderType = SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder

export class Command<T> {
    constructor(
        protected name: string,
        protected description: string,
        public readonly execute: CommandAction<T>,
    ) {}

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }
}

export class ChatInputCommand extends Command<ChatInputCommandInteraction<CacheType>> {
    constructor(
        name: string,
        description: string,
        private builder: BuilderType,
        execute: CommandAction<ChatInputCommandInteraction<CacheType>>,
    ) {
        super(name, description, execute)

        this.builder = builder;
        this.builder.setName(this.name);
        this.builder.setDescription(this.description);
    }

    public getBuilder(): BuilderType {
        return this.builder;
    }
}

export class ButtonCommand extends Command<ButtonInteraction<CacheType>> { }

export class ModalCommand extends Command<ModalSubmitInteraction<CacheType>> { }

export class DropdownCommand extends Command<SelectMenuInteraction<CacheType>> { }
