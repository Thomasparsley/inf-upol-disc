import axios from "axios"

import { ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } from "@discordjs/builders"
import { ButtonBuilder, TextBasedChannel} from "discord.js"


import { TextFile, TextFileMessage } from "../interfaces"
import { VOC_ActionSuccessful } from "../vocabulary"
import { ChatInputCommand } from "../command"
import { CD_Botmsg as cd } from "../cd"
import {
    isHttpUrlWithFileExt,
    getButtonStyle,
    replaceTags,
    parseByTag,
} from "../utils"
import {
    BotCanEditOnlySelfMessagesError,
    InvalidTextBasedChannel,
    UnknownCommandError,
    UnauthorizedError,
    InvalidURLError,
} from "../errors"

const maxMessageLength = 2000
const channelTagName = "channel"
const mentionTagName = "mention"
const roleTagName = "role"

/**
 * Chat command used for managing messages sent by the bot
 */
export class MessageManagerCommand extends ChatInputCommand {
    name = cd.name
    description = cd.description
    builder = new SlashCommandBuilder()
        .addSubcommand(subcommand => {
            return subcommand
                .setName(cd.sub.add.name)
                .setDescription(cd.sub.add.description)
                .addStringOption(option => {
                    return option
                        .setName(cd.sub.add.options.text.name)
                        .setDescription(cd.sub.add.options.text.description)
                        .setRequired(true)
                })
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName(cd.sub.edit.name)
                .setDescription(cd.sub.edit.description)
                .addStringOption(option => {
                    return option
                        .setName(cd.sub.edit.options.messageid.name)
                        .setDescription(cd.sub.edit.options.messageid.description)
                        .setRequired(true)
                })
                .addStringOption(option => {
                    return option
                        .setName(cd.sub.edit.options.text.name)
                        .setDescription(cd.sub.edit.options.text.description)
                        .setRequired(true)
                })
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName(cd.sub.fetch.name)
                .setDescription(cd.sub.fetch.description)
                .addStringOption(option => {
                    return option
                        .setName(cd.sub.fetch.options.messageid.name)
                        .setDescription(cd.sub.fetch.options.messageid.description)
                        .setRequired(true)
                })
                .addStringOption(option => {
                    return option
                        .setName(cd.sub.fetch.options.url.name)
                        .setDescription(cd.sub.fetch.options.url.description)
                        .setRequired(true)
                })
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName(cd.sub.load.name)
                .setDescription(cd.sub.load.description)
                .addStringOption(option => {
                    return option
                        .setName(cd.sub.load.options.url.name)
                        .setDescription(cd.sub.load.options.url.description)
                        .setRequired(true)
                })
        })

    protected async executable(): Promise<void> {
        if (!this.hasOneOfRoles(["Root", "Moderátor"]))
            throw new UnauthorizedError()

        await this.interaction.deferReply({ ephemeral: true })
        const subCommand = this.interaction.options.getSubcommand()
        switch (subCommand) {
            case cd.sub.add.name:
                await this.subCommandAdd()
                break

            case cd.sub.edit.name:
                await this.subCommandEdit()
                break

            case cd.sub.fetch.name:
                await this.subCommandFetch()
                break

            case cd.sub.load.name:
                await this.subCommandLoad()
                break

            default:
                throw new UnknownCommandError()
        }

        await this.followUpSilent(VOC_ActionSuccessful)
    }

    /**
     * Adds a new bot message
     * @returns Promise representing completion of the addition
     */
    async subCommandAdd(): Promise<void> {
        const channel = this.interaction.channel
        const text = this.interaction.options
            .getString(cd.sub.add.options.text.name)

        if (channel && text) {
            channel.send(text)
            return
        }

        throw "botmessage#1".toError()
    }

    /**
     * Edits the bot's message
     * @returns Promise representing completion of the edit action
     */
    async subCommandEdit(): Promise<void> {
        const channel = this.interaction.channel
        const messageID = this.interaction.options
            .getString(cd.sub.edit.options.messageid.name)
            ?.trim()
        const text = this.interaction.options
            .getString(cd.sub.edit.options.text.name)

        if (channel && messageID && text) {
            const message = await channel.messages.fetch(messageID)

            if (!message)
                throw "botmessage#2".toError()

            if (message.author !== this.client.user)
                throw new BotCanEditOnlySelfMessagesError()

            message.edit(text)
            return
        }

        throw new Error("botmessage#3")
    }

    /**
     * Loads message from a file
     * @returns Promise representing completion of the fetching action
     */
    async subCommandFetch(): Promise<void> {
        const channel = this.interaction.channel
        const messageID = this.interaction.options
            .getString(cd.sub.fetch.options.messageid.name)
            ?.trim()
        const url = this.interaction.options
            .getString(cd.sub.fetch.options.url.name)

        if (!channel || !messageID || !url)
            throw "botmsg#1".toError()

        if (!isHttpUrlWithFileExt(url, ["md", "markdown", "txt"]))
            throw new InvalidURLError()

        const message = await channel.messages.fetch(messageID)
        if (message.author !== this.client.user)
            throw new BotCanEditOnlySelfMessagesError()

        let data: string = ""
        try {
            const response = await axios.get(url)
            data = (response.data as string)
        } catch (err) {
            throw `Error: botmsg#2: ${err}`.toError()
        }

        const messageContent = this.handleMentions(data)
        if (!messageContent)
            throw "botmsg#5".toError()

        if (messageContent.length > maxMessageLength)
            throw `Požadavek nebyl zpracován, protože text překročil ${maxMessageLength} znaků.`.toError()

        message.edit(messageContent)
    }

    /**
     * Loads all the messages in the specified file
     * 
     * Also loads components unlike {@link subCommandFetch}
     */
    async subCommandLoad(): Promise<void> {
        const urlForFile = this.interaction.options
            .getString(cd.sub.load.options.url.name)

        if (!urlForFile || !isHttpUrlWithFileExt(urlForFile, ["json"]))
            throw new InvalidURLError()

        let data: TextFile | undefined
        try {
            const response = await axios.get(urlForFile)
            data = (response.data as TextFile)
        } catch (err) {
            throw `Error: botmsg#6: ${err}`.toError()
        }

        const channelID = data.channelID
        const channel = await this.fetchChannelFromGuild(channelID)
        if (!channel.isTextBased())
            throw new InvalidTextBasedChannel()

        for (const rawMessage of data.messages)
            await this.processOneMessage(rawMessage, channel)
    }

    async processOneMessage(rawMessage: TextFileMessage, channel: TextBasedChannel): Promise<void> {
        const messageId = rawMessage.id
        const message = await channel.messages.fetch(messageId)

        if (!message)
            throw `Zpráva s id ${messageId} nebyla nalezena v kanále s id ${channel.id}`.toError()
        if (message.author !== this.client.user)
            throw new BotCanEditOnlySelfMessagesError()

        const rows = []
        // Dropdown
        if (rawMessage.components && rawMessage.components.dropdowns)
            for (const raw of rawMessage.components.dropdowns) {
                const component = this.createDropdownComponent(raw)
                const row = new ActionRowBuilder().addComponents(component)
                rows.push(row)
            }

        // Buttons
        if (rawMessage.components && rawMessage.components.buttons) {
            const components = []

            for (const raw of rawMessage.components.buttons)
                components.push(this.createButtonComponent(raw))

            const row = new ActionRowBuilder().addComponents(...components)
            rows.push(row)
        }

        // Reactions 
        const reactionMap = new Map<string, string>()
        if (rawMessage.reactions) {
            
            for (const [key, value] of Object.entries(rawMessage.reactions)) {
                reactionMap.set(value, key)
            }

            await this.bot.addReactionMessage(rawMessage.id, channel.id, reactionMap)
            
            // Clean old reactions before adding new ones
            await message.reactions.removeAll()

            reactionMap.forEach(async (role, emoji) => {
                await message.react(emoji)
            });
        }
        
        const unparsedContent = rawMessage.content.join("\n")
        let content = this.handleMentions(unparsedContent)

        // Adds list of reaction and assigned roles
        reactionMap.forEach((role, emoji) => {
            content += `\n- ${emoji} - ${role}`
        })

        if (rows.length > 0) {
            await message.edit({
                content: content,
                // @ts-ignore
                components: rows
            })
        } else {
            await message.edit({ content: content })
        }
    }

    createButtonComponent(raw: { id: string; label: string; style: string; }) {
        return new ButtonBuilder()
            .setCustomId(raw.id)
            .setLabel(raw.label)
            .setStyle(getButtonStyle(raw.style))
    }

    createDropdownComponent(raw: { id: string; flag: string; placeholder: string; min: number; max: number; options: string[]; }) {
        const optionalValues: any[] = []
        for (const value of raw.options)
            optionalValues.push({
                label: value,
                value: value,
            })

        let maxValue = (raw.max < 0) ? raw.options.length : raw.max
        if (maxValue > 25)
            maxValue = 25

        const values = optionalValues.slice(0, 24)
        const component = new SelectMenuBuilder()
            .setCustomId(`${raw.id}-${raw.flag}`)
            .setPlaceholder(raw.placeholder)
            .setMinValues(raw.min)
            .setMaxValues(maxValue)
            .setOptions(...values)

        return component
    }


    handleMentions(message: string): string {
        const channels = parseByTag(message, channelTagName)
        const roles = parseByTag(message, roleTagName)
        const mentions = parseByTag(message, mentionTagName)

        const guild = this.guild()
        const roleManager = guild?.roles
        const channelManager = guild?.channels
        const memberManager = guild?.members

        if (!guild || !roleManager || !channelManager || !memberManager)
            throw "botmsg#4".toError()

        message = replaceTags(message, roleTagName, roles, roleManager)
        message = replaceTags(message, channelTagName, channels, channelManager)
        message = replaceTags(message, mentionTagName, mentions, memberManager)

        return message
    }
}
