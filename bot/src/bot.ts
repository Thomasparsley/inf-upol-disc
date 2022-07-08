import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import { DataSource } from "typeorm";
import { 
    PartialMessageReaction,
    MessageReaction,
    Interaction,
    PartialUser,
    Awaitable,
    CacheType,
    Intents,
    Message,
    Client,
    Role,
    User,
} from "discord.js";

import { Command } from "./command";

const REST_VERSION = '9';

export class Bot {
    client: Client;
    rest: REST;
    commands: Map<string, Command>;
    reactionMessages: Map<Message, Map<String, Role>>;
    private onReady: OnReadyAction
        = async (args: OnReadyArgs) => {}
    private onReactionAdd: onReactionAddAction
        = async (args: OnReactionAddArgs) => {}
    private onReactionRemove: onReactionRemoveAction
        = async (args: OnReactionRemoveArgs) => {}
    private async onInteractionCreate(args: OnInteractionCreateArgs): Promise<void> {
        throw new Error("Empty on interaction create event");
    }

    constructor(
        private readonly applicationId: string,
        private readonly guildId: string,
        private readonly token: string,
        public db: DataSource,
        config: BotConfig
    ) {
        this.reactionMessages = new Map<Message, Map<String, Role>>();
        this.commands = new Map<string, Command>();

        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            ],
            partials : [
                'MESSAGE', 
                'CHANNEL', 
                'REACTION',
            ],
        });

        this.rest = new REST({ version: REST_VERSION })
            .setToken(this.token);

        if (config.commands) {
            this.initCommands(config.commands);
        }

        // if (config.reactionMessages) {
        //     this.initReactionMessages(config.reactionMessages);
        // }

        if (config.onReady) {
            this.onReady = config.onReady;
        }

        if (config.onReactionAdd) {
            this.onReactionAdd = config.onReactionAdd;
        }

        if (config.onReactionRemove) {
            this.onReactionRemove = config.onReactionRemove;
        }

        if (config.onInteractionCreate) {
            this.onInteractionCreate = config.onInteractionCreate;
        }

        this.initOnReady();
        this.initOnReactionAdd();
        this.initOnReactionRemove();
        this.initOnInteractionCreate();
    }

    private initOnReady() {
        this.client.on('ready', async () => {
            const args: OnReadyArgs = {
                client: this.client,
                commands: this.commands,
                db: this.db,
            };

            await this.onReady(args);
        });
    }

    private initOnReactionAdd() {
        this.client.on('messageReactionAdd', async (messageReaction, user) => {
            const args: OnReactionAddArgs = {
                client: this.client,
                reaction: messageReaction,
                user: user,
                commands: this.commands,
                db: this.db,
            };
        
            await this.onReactionAdd(args);
        });
    }

    private initOnReactionRemove() {
        this.client.on('messageReactionRemove', async (messageReaction, user) => {
            const args: OnReactionRemoveArgs = {
                client: this.client,
                reaction: messageReaction,
                user: user,
                commands: this.commands,
                db: this.db,
            };
    
            await this.onReactionRemove(args);
        });
    }

    private initOnInteractionCreate() {
        this.client.on('interactionCreate', async (interaction) => {
            const args: OnInteractionCreateArgs = {
                client: this.client,
                interaction: interaction,
                commands: this.commands,
                db: this.db,
                commandRegistration: this.registerSlashCommands,
            };

            try {
                await this.onInteractionCreate(args);
            } catch (error) {
                
            }
        });
    }

    private initCommands(commands: Command[]) {
        commands.forEach((command) => {
            this.commands.set(command.getName(), command);
        });
    }

    // private initReactionMessages() {}

    public async login() {
        await this.client.login(this.token);
    }

    public async registerSlashCommands(commands: Command[]) {
        const slashCommands = commands.map((command) => {
            return command.getBuilder().toJSON()
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
    commands?: Command[];
    onReady?: OnReadyAction;
    onReactionAdd?: onReactionAddAction;
    onReactionRemove?: onReactionRemoveAction;
    onInteractionCreate?: OnInteractionCreateAction;
}

export interface OnReadyArgs {
    client: Client;
    commands: Map<string, Command>;
    db: DataSource;
}

export type OnReadyAction = (args: OnReadyArgs) => Awaitable<void>

export interface OnReactionAddArgs {
    client: Client;
    reaction: MessageReaction | PartialMessageReaction; 
    user: User | PartialUser;
    commands: Map<string, Command>;
    db: DataSource;
}

export type onReactionAddAction = (args: OnReactionAddArgs) => Awaitable<void>

export interface OnReactionRemoveArgs {
    client: Client;
    reaction: MessageReaction | PartialMessageReaction; 
    user: User | PartialUser;
    commands: Map<string, Command>;
    db: DataSource;
}

export type onReactionRemoveAction = (args: OnReactionRemoveArgs) => Awaitable<void>

export interface OnInteractionCreateArgs {
    client: Client;
    interaction: Interaction<CacheType>;
    commands: Map<string, Command>;
    db: DataSource;
    commandRegistration: (commands: Command[]) => Promise<void>;
}

export type OnInteractionCreateAction = (args: OnInteractionCreateArgs) => Promise<void>
