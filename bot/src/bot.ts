import { DataSource } from "typeorm"
import { Routes } from "discord-api-types/v9"
import { REST } from "@discordjs/rest"
import {
    GatewayIntentBits,
    Message,
    Client,
    Role,
    Partials,
    Snowflake,
    Emoji,
    GuildTextBasedChannel,
} from "discord.js"

import {
    ChatInputCommand,
    ButtonCommand,
    ModalCommand,
    DropdownCommand,
    ICommand,
    IDropdownCommand
} from "./command"
import { Mailer } from "./mailer"
import {
    BotConfig,
    OnGuildMemberAddArgs,
    OnInteractionCreateArgs,
    OnReactionAddArgs,
    OnReactionRemoveArgs,
    OnReadyArgs
} from "./interfaces"
import {
    OnGuildMemberAddAction,
    OnReactionAddAction,
    OnReactionRemoveAction,
} from "./types"
import {
    MessageReaction
} from "./models"

const REST_VERSION = "10"

export class Bot {
    client: Client
    rest: REST
    chatInputCommands = new Map<string, ICommand<ChatInputCommand>>()
    buttonCommands = new Map<string, ICommand<ButtonCommand>>()
    modalCommands = new Map<string, ICommand<ModalCommand>>()
    dropdownCommands = new Map<string, IDropdownCommand<DropdownCommand>>()
    reactionMessages = new Map<Snowflake, Map<string, string>>()
    private async onReady(args: OnReadyArgs): Promise<void> {
        throw new Error("Event 'onReady' is not implementet")
    }
    private onGuildMemberAdd: OnGuildMemberAddAction
        = async (args: OnGuildMemberAddArgs) => { }
    private onReactionAdd: OnReactionAddAction
        = async (args: OnReactionAddArgs) => { }
    private onReactionRemove: OnReactionRemoveAction
        = async (args: OnReactionRemoveArgs) => { }
    private async onInteractionCreate(args: OnInteractionCreateArgs): Promise<void> {
        throw new Error("Empty on interaction create event")
    }
    private isLogedIn: boolean = false

    constructor(
        private readonly applicationId: string,
        private readonly guildId: string,
        private readonly token: string,
        private readonly mailer: Mailer,
        public db: DataSource,
        config: BotConfig
    ) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessages,
            ],
            partials: [
                Partials.Message,
                Partials.Channel,
                Partials.Reaction,
            ],
        })

        this.rest = new REST({ version: REST_VERSION })
            .setToken(this.token)

        if (config.chatInputCommands) this.initChatInputCommands(config.chatInputCommands)
        if (config.buttonCommands) this.initButtonCommands(config.buttonCommands)
        if (config.modalCommands) this.initModalCommands(config.modalCommands)
        if (config.dropdownCommands) this.initDropdownCommands(config.dropdownCommands)

        this.loadReactionMessages().then(value => {
            this.reactionMessages = value
        })

        this.initEvents(config)
        this.init()
    }

    private initEvents(config: BotConfig) {
        if (config.onReady)
            this.onReady = config.onReady
        if (config.onGuildMemberAdd)
            this.onGuildMemberAdd = config.onGuildMemberAdd
        if (config.onReactionAdd)
            this.onReactionAdd = config.onReactionAdd
        if (config.onReactionRemove)
            this.onReactionRemove = config.onReactionRemove
        if (config.onInteractionCreate)
            this.onInteractionCreate = config.onInteractionCreate
    }

    private init() {
        this.initOnReady()
        this.initOnInteractionCreate()
        this.initOnGuildMemberAdd()
        this.initOnReactionAdd()
        this.initOnReactionRemove()
    }

    private initOnReady() {
        this.client.on("ready", async () => {
            const args: OnReadyArgs = {
                client: this.client,
                db: this.db,
            }

            await this.onReady(args)
        })
    }

    private initOnInteractionCreate() {
        this.client.on("interactionCreate", async (interaction) => {
            const args: OnInteractionCreateArgs = {
                client: this.client,
                interaction: interaction,
                commands: this.chatInputCommands,
                buttons: this.buttonCommands,
                modals: this.modalCommands,
                dropdown: this.dropdownCommands,
                db: this.db,
                bot: this,
                mailer: this.mailer,
                commandRegistration: this.registerChatInputGuildCommands,
            }

            try {
                await this.onInteractionCreate(args)
            } catch (error) {
                console.log(new Date())
                console.log(error)

                try {
                    if (interaction.isRepliable()) {
                        const responseData = {
                            content: `Error: ${error}`,
                            ephemeral: true,
                        }

                        if (interaction.deferred) {
                            await interaction.followUp(responseData)
                        } else {
                            await interaction.reply(responseData)
                        }
                    }
                } catch (error) {
                    console.log(new Date())
                    console.log(error)
                }
            }
        })
    }

    private initOnGuildMemberAdd() {
        this.client.on("guildMemberAdd", async (member) => {
            const args: OnGuildMemberAddArgs = {
                client: this.client,
                member: member,
            }

            try {
                await this.onGuildMemberAdd(args)
            } catch (err) {
                console.log(new Date())
                console.log(err)
            }
        })
    }

    private initOnReactionAdd() {
        this.client.on("messageReactionAdd", async (messageReaction, user) => {
            const args: OnReactionAddArgs = {
                reaction: messageReaction,
                user: user,
                reactionMessages: this.reactionMessages,
            }

            try {
                await this.onReactionAdd(args)
            } catch (err) {
                console.log(new Date())
                console.log(err)
            }
        })
    }

    private initOnReactionRemove() {
        this.client.on("messageReactionRemove", async (messageReaction, user) => {
            const args: OnReactionRemoveArgs = {
                client: this.client,
                reaction: messageReaction,
                user: user,
                db: this.db,
            }

            try {
                await this.onReactionRemove(args)
            } catch (err) {
                console.log(new Date())
                console.log(err)
            }
        })
    }

    private initChatInputCommands(commands: ICommand<ChatInputCommand>[]) {
        commands.forEach((command) => {
            const cmd = new command()
            this.chatInputCommands.set(cmd.name, command)
        })
    }

    private initButtonCommands(commands: ICommand<ButtonCommand>[]) {
        commands.forEach((command) => {
            const cmd = new command()
            this.buttonCommands.set(cmd.name, command)
        })
    }

    private initModalCommands(commands: ICommand<ModalCommand>[]) {
        commands.forEach((command) => {
            const cmd = new command()
            this.modalCommands.set(cmd.name, command)
        })
    }

    private initDropdownCommands(commands: IDropdownCommand<DropdownCommand>[]) {
        commands.forEach((command) => {
            const cmd = new command()
            this.dropdownCommands.set(cmd.name, command)
        })
    }

    /**
     * Loads reaction messages from the database
     * @returns Promise that resolves to reaction messages
     */
    private async loadReactionMessages(): Promise<Map<Snowflake, Map<string, string>>> {
        const ReactionMessages = new Map<Snowflake, Map<string, string>>();

        const allReactions = await MessageReaction.find({
            select: {
                messageId: true,
                channelId: true
            }
        });

        // Gets mask of boolean values
        const uniqueMask = allReactions
            .map(item => item.messageId)
            .map((value, index, array) => array.indexOf(value) === index);

        // Gets all unique MessageReactions 
        const uniqueMessage = allReactions.filter((_, index) => uniqueMask[index]);

        uniqueMessage.forEach(async ({messageId, channelId}) => {
            const messageReactionsBinds = await MessageReaction.find({
                select: {
                    emoji: true,
                    role: true,
                },
                where: {
                    messageId: messageId
                }
            });

            const guild = await this.client.guilds.fetch(this.guildId)
            const channel = (await guild.channels.fetch(channelId)!) as GuildTextBasedChannel
            const message = await channel.messages.fetch(messageId)

            if(message === null){
                throw new Error("Invalid message")
            }
            
            const reactionBinds = new Map()
            messageReactionsBinds.forEach(async row => {
                reactionBinds.set(row.emoji, row.role)
                await message.react(row.emoji)
            });

            ReactionMessages.set(messageId, reactionBinds)
        });

        return ReactionMessages
    }

    /**
     * Adds a new reaction message to the bot config
     * @param messageId Reaction message id
     * @param reactions Binds that should be added for the message
     */
    public async addReactionMessage(messageId: string, channelId: string, reactions: Map<string, string>) {
        // Updating new reactions binds
        this.reactionMessages.set(messageId, reactions)

        // Removing reactions binds
        await MessageReaction.delete({ messageId: messageId })

        // Adding new reaction binds
        reactions.forEach(async (role, emoji) => {
            const messageReaction = new MessageReaction()
            messageReaction.messageId = messageId
            messageReaction.emoji = emoji
            messageReaction.role = role
            messageReaction.channelId = channelId
            await messageReaction.save();
        });
    }

    public async login() {
        if (this.isLogedIn)
            return

        await this.client.login(this.token)
        this.isLogedIn = true
    }

    private async registerChatInputCommands(commands: ICommand<ChatInputCommand>[], path: any) {
        const slashCommands = commands.map((command) => {
            const cmd = new command()
            return cmd.getBuilder().toJSON()
        })

        try {
            await this.rest.put(path, { body: slashCommands })
        } catch (err) {
            console.error(err)
        }
    }

    public async registerChatInputGuildCommands(commands: ICommand<ChatInputCommand>[]) {
        const path = Routes.applicationGuildCommands(this.applicationId, this.guildId)
        this.registerChatInputCommands(commands, path)
    }

    public async registerChatInputGlobalCommands(commands: ICommand<ChatInputCommand>[]) {
        const path = Routes.applicationCommands(this.applicationId)
        this.registerChatInputCommands(commands, path)
    }
}
