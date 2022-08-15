import { DataSource } from "typeorm";
import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import { 
    GatewayIntentBits,
    Message,
    Client,
    Role,
    Partials,
} from "discord.js";

import { 
    ButtonCommand,
    ChatInputCommand,
    Command
} from "./command";
import { Mailer } from "./mailer";
import { 
    BotConfig,
    OnGuildMemberAddArgs,
    OnInteractionCreateArgs,
    OnReactionAddArgs,
    OnReactionRemoveArgs,
    OnReadyArgs
} from "./interfaces";
import {
    OnGuildMemberAddAction,
    onReactionAddAction,
    onReactionRemoveAction,
    OnReadyAction
} from "./types";
import { replySilent } from "./utils";

const REST_VERSION = "10";

export class Bot {
    client: Client;
    rest: REST;
    chatInputCommands: Map<string, ChatInputCommand>;
    buttonCommands: Map<string, ButtonCommand>;
    modalCommands: Map<string, Command>;
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
    private isLogedIn: boolean = false;

    constructor(
        private readonly applicationId: string,
        private readonly guildId: string,
        private readonly token: string,
        private readonly mailer: Mailer,
        public db: DataSource,
        config: BotConfig
    ) {
        this.reactionMessages = new Map<Message, Map<String, Role>>();
        this.chatInputCommands = new Map<string, ChatInputCommand>();
        this.buttonCommands = new Map<string, ButtonCommand>();
        this.modalCommands = new Map<string, Command>();

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

        if (config.commands) this.initChatInputCommands(config.commands);
        if (config.buttons) this.initButtonCommands(config.buttons);
        if (config.modals) this.initModals(config.modals);

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
                commands: this.chatInputCommands,
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
                commands: this.chatInputCommands,
                buttons: this.buttonCommands,
                modals: this.modalCommands,
                db: this.db,
                mailer: this.mailer,
                commandRegistration: this.registerChatInputGuildCommands,
            };

            try {
                await this.onInteractionCreate(args);
            } catch (err) {
                console.error(err);
                await replySilent(interaction)((err as Error).toString());
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
                commands: this.chatInputCommands,
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
                commands: this.chatInputCommands,
                db: this.db,
            };
    
            try {
                await this.onReactionRemove(args);
            } catch (err) {
                console.error(err);
            }
        });
    }

    private initChatInputCommands(commands: ChatInputCommand[]) {
        commands.forEach((command) => {
            this.chatInputCommands.set(command.getName(), command);
        });
    }

    private initButtonCommands(commands: ButtonCommand[]) {
        commands.forEach((command) => {
            this.buttonCommands.set(command.getName(), command);
        });
    }

    private initModals(commands: Command[]) {
        commands.forEach((command) => {
            this.modalCommands.set(command.getName(), command);
        });
    }

    public async login() {
        if (this.isLogedIn)
            return

        await this.client.login(this.token);
        this.isLogedIn = true;
    }

    private async registerChatInputCommands(commands: ChatInputCommand[], path: any) {
        const slashCommands = commands.map((command) => {
            return command.getBuilder().toJSON()
        });

        try {
            await this.rest.put(path, { body: slashCommands });
        } catch (err) {
            console.error(err);
        }
    }

    public async registerChatInputGuildCommands(commands: ChatInputCommand[]) {
        const path = Routes.applicationGuildCommands(this.applicationId, this.guildId);
        this.registerChatInputCommands(commands, path)
    }

    public async registerChatInputGlobalCommands(commands: ChatInputCommand[]) {
        const path = Routes.applicationCommands(this.applicationId)
        this.registerChatInputCommands(commands, path)
    }
}
