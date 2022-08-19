import {
    CacheType,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    SelectMenuInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

import { UnrepliableInteractionError } from "./errors";


class Command {
    protected name: string = "";
    protected description: string = "";

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public execute(): void {}
}

class InteractionCommand<T> extends Command {
    constructor(
        protected interaction: T,
    ) {
        super();
    }
}


type BuilderType = SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder

export class ChatInputCommand extends InteractionCommand<ChatInputCommandInteraction<CacheType>> {
    protected builder: BuilderType | undefined = undefined;

    constructor(
        interaction: ChatInputCommandInteraction<CacheType>,
    ) {
        super(interaction);

        if (this.builder) {
            this.builder.setName(this.name);
            this.builder.setDescription(this.description);
        }
    }

    public getBuilder(): BuilderType {
        return this.builder;
    }

    protected async sendReply(content: string, silent: boolean) {
        if (this.interaction.isRepliable())
            return await this.interaction.reply({
                content,
                ephemeral: false,
            });

        throw new UnrepliableInteractionError();
    }

    async reply(content: string) {
        return await this.sendReply(content, false);
    }

    async replySilent(content: string) {
        return await this.sendReply(content, true);
    }
}

/* export class ButtonCommand extends Command<ButtonInteraction<CacheType>> { }

export class ModalCommand extends Command<ModalSubmitInteraction<CacheType>> { }

export class DropdownCommand extends Command<SelectMenuInteraction<CacheType>> { } */
