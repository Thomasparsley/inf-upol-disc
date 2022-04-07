import { Awaitable, CacheType, Client, Intents, Interaction } from "discord.js";
import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";

import { Command } from "./command";
import { SlashCommandBuilder } from "@discordjs/builders";

const REST_VERSION = '9';

export class Bot {
    client: Client;
    rest: REST;
    commands: Map<string, Command>;
    private applicationId: string;
    private guildId: string;
    private token: string;
    private onReady: OnReadyAction
        = async (args: OnReadyArgs) => {}
    private onInteractionCreate: OnInteractionCreateAction
        = async (args: OnInteractionCreateArgs) => {}

    
    constructor(config: BotConfig) {
        this.commands = new Map<string, Command>();
        this.applicationId = config.applicationId;
        this.guildId = config.guildId;
        this.token = config.token;

        this.client = new Client({
            intents: [Intents.FLAGS.GUILDS],
        });

        this.rest = new REST({ version: REST_VERSION })
            .setToken(this.token);

        if (config.commands) {
            this.initCommands(config.commands);
        }

        if (config.onReady) {
            this.onReady = config.onReady;
        }

        if (config.onInteractionCreate) {
            this.onInteractionCreate = config.onInteractionCreate;
        }

        this.initOnReady();
        this.initOnInteractionCreate();
    }

    private initOnReady() {
        this.client.on('ready', () => {
            const args: OnReadyArgs = {
                client: this.client,
                commands: this.commands,
            };

            this.onReady(args);
        });
    }

    private initOnInteractionCreate() {
        this.client.on('interactionCreate', (interaction) => {
            const args: OnInteractionCreateArgs = {
                client: this.client,
                interaction,
                commands: this.commands,
            };

            this.onInteractionCreate(args);
        });
    }

    private initCommands(commands: Command[]) {
        commands.forEach((command) => {
            this.commands.set(command.getName(), command);
        });
    }

    public async login() {
        await this.client.login(this.token);
    }

    public async registerSlashCommands(commands: Command[]) {
        const slashCommands = commands.map((command) => {
            return (command.getBuilder() as SlashCommandBuilder).toJSON()
        });

        const path = Routes.applicationGuildCommands(this.applicationId, this.guildId);

        try {
            await this.rest.put(path, { body: slashCommands });
        } catch (err) {
            console.error(err);
        }
    }
}

interface BotConfig {
    token: string;
    applicationId: string;
    guildId: string;
    commands?: Command[];
    onReady?: OnReadyAction;
    onInteractionCreate?: OnInteractionCreateAction;
}

export interface OnReadyArgs {
    client: Client;
    commands: Map<string, Command>;
}
export type OnReadyAction = (args: OnReadyArgs) => Awaitable<void>

export interface OnInteractionCreateArgs {
    client: Client;
    interaction: Interaction<CacheType>;
    commands: Map<string, Command>;
}
export type OnInteractionCreateAction = (args: OnInteractionCreateArgs) => Awaitable<void>
