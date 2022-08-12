import axios from "axios";
import { ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { CD_Botmsg as cd } from "../cd";
import { isHttpUrlWithFileExt, replaceTags, parseByTag } from "../utils";
import { VOC_ActionSuccessful } from "../vocabulary";
import { Command } from "../command";
import {
    BadInputForChatCommandError,
    UnknownCommandError,
    UnauthorizedError,
    InvalidURLError,
    BotCanEditOnlySelfMessagesError,
    InvalidChannel,
    InvalidTextBasedChannel,
    InvalidGuild,
} from "../errors";
import { CommandArgs, TextFile, TextFileMessage } from "../interfaces";
import { ButtonBuilder, ButtonStyle, Channel, Client, TextBasedChannel } from "discord.js";


const rootID = "960452395312234537";
const modID = "960478652494118952";
const maxMessageLength = 2000;
const channelTagName = "channel";
const roleTagName = "role";
const mentionTagName = "mention";

const slashCommandBuilder = new SlashCommandBuilder()
    .addSubcommand(subcommand => {
        return subcommand
            .setName(cd.sub.add.name)
            .setDescription(cd.sub.add.description)
            .addStringOption(option => {
                return option
                    .setName(cd.sub.add.options.text.name)
                    .setDescription(cd.sub.add.options.text.description)
                    .setRequired(true);
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
                    .setRequired(true);
            })
            .addStringOption(option => {
                return option
                    .setName(cd.sub.edit.options.text.name)
                    .setDescription(cd.sub.edit.options.text.description)
                    .setRequired(true);
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
                    .setRequired(true);
            })
            .addStringOption(option => {
                return option
                    .setName(cd.sub.fetch.options.url.name)
                    .setDescription(cd.sub.fetch.options.url.description)
                    .setRequired(true);
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
                    .setRequired(true);
            })
    }); 

export const botMessage = new Command(
    cd.name,
    cd.description,
    slashCommandBuilder,
    async (args) => {
        const { interaction, replySilent, permissionRole } = args;


        const isRoot = permissionRole(rootID);
        const isMod = permissionRole(modID);

        if (!isRoot && !isMod)
            throw new UnauthorizedError();

        if (!interaction.isChatInputCommand())
            throw new BadInputForChatCommandError();

        const subCommand = interaction.options.getSubcommand();
        switch (subCommand) {
            case cd.sub.add.name:
                await commandAdd(args);
                break;

            case cd.sub.edit.name:
                await commandEdit(args);
                break;

            case cd.sub.fetch.name:
                await commandFetch(args);
                break;

            case "load":
                await commandLoad(args);
                break;

            default:
                throw new UnknownCommandError();
        }

        await replySilent(VOC_ActionSuccessful);
    },
);

async function commandAdd(args: CommandArgs): Promise<void> {
    const { interaction } = args;

    if (!interaction.isChatInputCommand())
        throw new BadInputForChatCommandError();

    const channel = interaction.channel
    const text = interaction.options
        .getString(cd.sub.add.options.text.name);

    if (channel && text) {
        channel.send(text);
        return;
    }

    throw "botmessage#1".toError();
}

async function commandEdit(args: CommandArgs): Promise<void> {
    const { client, interaction } = args;

    if (!interaction.isChatInputCommand())
        throw new BadInputForChatCommandError();

    const channel = interaction.channel;
    const messageID = interaction.options
        .getString(cd.sub.edit.options.messageid.name)?.trim();
    const text = interaction.options
        .getString(cd.sub.edit.options.text.name);

    if (channel && messageID && text) {
        const message = await channel.messages.fetch(messageID);

        if (!message)
            throw "botmessage#2".toError();
        
        if (message.author !== client.user)
            throw new BotCanEditOnlySelfMessagesError();

        message.edit(text);
        return;
    }

    throw new Error("botmessage#3");
}

async function commandFetch(args: CommandArgs): Promise<void> {
    const { client, interaction } = args;

    if (!interaction.isChatInputCommand())
        throw new BadInputForChatCommandError();

    const channel = interaction.channel;
    const messageID = interaction.options
        .getString(cd.sub.fetch.options.messageid.name)
        ?.trim();
    const url = interaction.options
        .getString(cd.sub.fetch.options.url.name);

    if (!channel || !messageID || !url)
        throw "botmsg#1".toError();

    if (!isHttpUrlWithFileExt(url, ["md", "markdown", "txt"]))
        throw new InvalidURLError();

    const message = await channel.messages.fetch(messageID);
    if (message.author !== client.user)
        throw new BotCanEditOnlySelfMessagesError();

    let data: string = "";
    try {
        const response = await axios.get(url);
        data = (response.data as string);
    } catch (err) {
        throw `Error: botmsg#2: ${err}`.toError();
    }

    const messageContent = await handleMentions(data, args);
    if (!messageContent)
        throw "botmsg#5".toError();

    if (messageContent.length > maxMessageLength)
        throw `Požadavek nebyl zpracován, protože text překročil ${maxMessageLength} znaků.`.toError();

    message.edit(messageContent);
}

async function commandLoad(args: CommandArgs): Promise<void> {
    const { client, interaction } = args;

    if (!interaction.isChatInputCommand())
        throw new BadInputForChatCommandError();

    const urlForFile = interaction.options
        .getString(cd.sub.load.options.url.name);

    if (!urlForFile || !isHttpUrlWithFileExt(urlForFile, ["json"]))
        throw new InvalidURLError();

    let data: TextFile | undefined;
    try {
        const response = await axios.get(urlForFile);
        data = (response.data as TextFile);
    } catch (err) {
        throw `Error: botmsg#6: ${err}`.toError();
    }

    console.log(data);

    const channelID = data.channelID;
    
    const guild = interaction.guild;
    if (!guild)
        throw new InvalidGuild();

    const channel = await guild.channels.fetch(channelID);
    if (!channel)
        throw new InvalidChannel();
    if (!channel.isTextBased())
        throw new InvalidTextBasedChannel();

    for (const rawMessage of data.messages)
        await processOneMessage(rawMessage, channel, client, args);
}

async function processOneMessage(
    rawMessage: TextFileMessage,
    channel: TextBasedChannel,
    client: Client<boolean>,
    args: CommandArgs
) {
    const messageId = rawMessage.id;
    const message = await channel.messages.fetch(messageId);
    if (!message)
        throw "".toError();
    if (message.author !== client.user)
        throw new BotCanEditOnlySelfMessagesError();

    const components = [];
    // Dropdown
    if (rawMessage.components && rawMessage.components.dropdowns)
        for (const raw of rawMessage.components.dropdowns)
            components.push(createDropwodnComponent(raw));

    // Buttons
    if (rawMessage.components && rawMessage.components.buttons)
        for (const raw of rawMessage.components.buttons)
            components.push(createButtonComponent(raw));

    const unparsedContent = rawMessage.content.join("\n");
    const content = await handleMentions(unparsedContent, args);
    const row = new ActionRowBuilder()
        .addComponents(components);

    await message.edit({
        content: content,
        // @ts-ignore
        components: [row]
    });
}

function createButtonComponent(raw: { id: string; label: string; style: string; }) {
    return new ButtonBuilder()
        .setCustomId(raw.id)
        .setLabel(raw.label)
        .setStyle(getButtonStyle(raw.style));
}

function createDropwodnComponent(raw: { id: string; flag: string; placeholder: string; min: number; max: number; options: string[]; }) {
    const component = new SelectMenuBuilder()
        .setCustomId(`${raw.id}-${raw.flag}`)
        .setPlaceholder(raw.placeholder)
        .setMinValues(raw.min)
        .setMinValues((raw.max < 0) ? raw.options.length : raw.max);

    const optionalValues: any[] = [];
    for (const value of raw.options)
        optionalValues.push({
            label: value,
            value: value,
        });

    return component;
}

function getButtonStyle(style: string): ButtonStyle {
    switch (style) {
        case "Primary":
            return ButtonStyle.Primary;

        case "Secondary":
            return ButtonStyle.Secondary;

        case "Success":
            return ButtonStyle.Success;

        case "Danger":
            return ButtonStyle.Danger;

        case "Link":
            return ButtonStyle.Link;

        default:
            return ButtonStyle.Primary;
    }
}

async function handleMentions(message: string, args: CommandArgs): Promise<string> {
    const { interaction } = args;

    const channels = parseByTag(message, channelTagName);
    const roles = parseByTag(message, roleTagName);
    const mentions = parseByTag(message, mentionTagName);

    const guild = interaction.guild;
    const roleManager = guild?.roles;
    const channelManager = guild?.channels;
    const memberManager = guild?.members;
    
    if (!guild || !roleManager || !channelManager || !memberManager)
        throw "botmsg#4".toError();

    message = replaceTags(message, roleTagName, roles, roleManager);
    message = replaceTags(message, channelTagName, channels, channelManager);
    message = replaceTags(message, mentionTagName, mentions, memberManager);

    return message;
}
