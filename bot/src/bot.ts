import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import { DataSource } from "typeorm";
import { 
    PartialMessageReaction,
    GatewayIntentBits,
    MessageReaction,
    Interaction,
    PartialUser,
    GuildMember,
    Awaitable,
    CacheType,
    Message,
    Client,
    Role,
    User,
    Partials,
} from "discord.js";

import { Command } from "./command";
import { Mailer } from "./mailer";

const REST_VERSION = "10";

export class Bot {
    client: Client;
    rest: REST;
    commands: Map<string, Command>;
    reactionMessages: Map<Message, Map<String, Role>>;
    private onReady: OnReadyAction
        = async (args: OnReadyArgs) => {}
    private onGuildMemberAdd: OnGuildMemberAddAction
        = async (args: OnGuildMemberAddArgs) => {}
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
        private readonly mailer: Mailer,
        public db: DataSource,
        config: BotConfig
    ) {
        this.reactionMessages = new Map<Message, Map<String, Role>>();
        this.commands = new Map<string, Command>();

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessages,
            ],
            partials : [
                Partials.Message, 
                Partials.Channel, 
                Partials.Reaction,
            ],
        });

        this.rest = new REST({ version: REST_VERSION })
            .setToken(this.token);

        if (config.commands) {
            this.initCommands(config.commands);
        }

        /* if (config.reactionMessages) {
            this.initReactionMessages(config.reactionMessages);
        } */

        if (config.onReady) {
            this.onReady = config.onReady;
        }

        if (config.onGuildMemberAdd) {
            this.onGuildMemberAdd = config.onGuildMemberAdd;
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
        this.initOnInteractionCreate();
        this.initOnGuildMemberAdd();
        this.initOnReactionAdd();
        this.initOnReactionRemove();
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

    private initOnInteractionCreate() {
        this.client.on('interactionCreate', async (interaction) => {
            const args: OnInteractionCreateArgs = {
                client: this.client,
                interaction: interaction,
                commands: this.commands,
                db: this.db,
                mailer: this.mailer,
                commandRegistration: this.registerSlashGuildCommands,
            };

            

            try {
                await this.onInteractionCreate(args);
            } catch (err) {
                console.error(err);
            }
        });
    }

    private initOnGuildMemberAdd() {
        this.client.on('guildMemberAdd', async (member) => {
            const args: OnGuildMemberAddArgs = {
                client: this.client,
                member: member,
            };
            
            try {
                await this.onGuildMemberAdd(args);
            } catch (err) {
                console.error(err);
            }
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
        
            try {
                await this.onReactionAdd(args);
            } catch (err) {
                console.error(err);
            }
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
    
            try {
                await this.onReactionRemove(args);
            } catch (err) {
                console.error(err);
            }
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

    private async registerSlashCommands(commands: Command[], path: any) {
        const slashCommands = commands.map((command) => {
            return command.getBuilder().toJSON()
        });

        try {
            await this.rest.put(path, { body: slashCommands });
        } catch (err) {
            console.error(err);
        }
    }

    public async registerSlashGuildCommands(commands: Command[]) {
        const path = Routes.applicationGuildCommands(this.applicationId, this.guildId);
        this.registerSlashCommands(commands, path)
    }

    public async registerSlashGlobalCommands(commands: Command[]) {
        const path = Routes.applicationCommands(this.applicationId)
        this.registerSlashCommands(commands, path)
    }
}

interface BotConfig {
    commands?: Command[];
    onReady?: OnReadyAction;
    onReactionAdd?: onReactionAddAction;
    onReactionRemove?: onReactionRemoveAction;
    onInteractionCreate?: OnInteractionCreateAction;
    onGuildMemberAdd?: OnGuildMemberAddAction;
}

export interface OnReadyArgs {
    client: Client;
    commands: Map<string, Command>;
    db: DataSource;
}

export interface OnGuildMemberAddArgs {
    client: Client;
    member: GuildMember;
}

export type OnReadyAction = (args: OnReadyArgs) => Awaitable<void>
export type OnGuildMemberAddAction = (args: OnGuildMemberAddArgs) => Awaitable<void>


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
    mailer: Mailer;
    commandRegistration: (commands: Command[]) => Promise<void>;
}

export type OnInteractionCreateAction = (args: OnInteractionCreateArgs) => Promise<void>
