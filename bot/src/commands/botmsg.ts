import axios from "axios";
import { SlashCommandBuilder } from "@discordjs/builders";

import { isHttpUrlWithFileExt, replaceTags, parseByTag } from "../functions";
import { VOC_ActionSuccessful } from "../vocabulary";
import { Command } from "../command";
import {
    BadInputForChatCommandError,
    UnknownCommandError,
    UnauthorizedError,
    InvalidURLError,
    BotCanEditOnlySelfMessagesError,
} from "../errors";
import { CommandArgs } from "../interfaces";


const rootID = "960452395312234537";
const modID = "960478652494118952";
const maxMessageLength = 2000;
const channelTagName = "channel";
const roleTagName = "role";
const mentionTagName = "mention";

const commandDefinition = {
    name: "botmessage",
    description: "Pošle nebo upraví zprávu pomocí bota.",
    sub: {
        add: {
            name: "add",
            description: "Pošle zprávu pomocí bota.",
            options:  {
                text: {
                    name: "text",
                        description: "Text zprávy."
                },
            },
        },
        edit: {
            name: "edit",
            description: "Upraví zprávu pomocí bota.",
            options: {
                messageid: {
                    name: "messageid",
                    description: "ID zprávy, kterou chceš upravit."
                },
                text: {
                    name: "text",
                    description: "Nový text zprávy."
                },
            },
        },
        fetch: {
            name: "fetch",
            description: "Načte z dané URL obsah zprávy.",
            options: {
                messageid: {
                    name: "messageid",
                    description: "ID zprávy, kterou chceš upravit."
                },
                url: {
                    name: "url",
                    description: "Text zprávy."
                },
            },
        },
    },
};

const slashCommandBuilder = new SlashCommandBuilder()
    .addSubcommand(subcommand => {
        return subcommand
            .setName(commandDefinition.sub.add.name)
            .setDescription(commandDefinition.sub.add.description)
            .addStringOption(option => {
                return option
                    .setName(commandDefinition.sub.add.options.text.name)
                    .setDescription(commandDefinition.sub.add.options.text.description)
                    .setRequired(true);
            })
    })
    .addSubcommand(subcommand => {
        return subcommand
            .setName(commandDefinition.sub.edit.name)
            .setDescription(commandDefinition.sub.edit.description)
            .addStringOption(option => {
                return option
                    .setName(commandDefinition.sub.edit.options.messageid.name)
                    .setDescription(commandDefinition.sub.edit.options.messageid.description)
                    .setRequired(true);
            })
            .addStringOption(option => {
                return option
                    .setName(commandDefinition.sub.edit.options.text.name)
                    .setDescription(commandDefinition.sub.edit.options.text.description)
                    .setRequired(true);
            })
    })
    .addSubcommand(subcommand => {
        return subcommand
            .setName(commandDefinition.sub.fetch.name)
            .setDescription(commandDefinition.sub.fetch.description)
            .addStringOption(option => {
                return option
                    .setName(commandDefinition.sub.fetch.options.messageid.name)
                    .setDescription(commandDefinition.sub.fetch.options.messageid.description)
                    .setRequired(true);
            })
            .addStringOption(option => {
                return option
                    .setName(commandDefinition.sub.fetch.options.url.name)
                    .setDescription(commandDefinition.sub.fetch.options.url.description)
                    .setRequired(true);
            })
    }); 

export const botMessage = new Command(
    commandDefinition.name,
    commandDefinition.description,
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
            case commandDefinition.sub.add.name:
                await commandAdd(args);
                break;

            case commandDefinition.sub.edit.name:
                await commandEdit(args);
                break;

            case commandDefinition.sub.fetch.name:
                await commandFetch(args);
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
        .getString(commandDefinition.sub.add.options.text.name);

    if (channel && text) {
        channel.send(text);
        return;
    }

    throw "botmessage#1".toError();
}

async function commandEdit(args: CommandArgs): Promise<void> {
    const { client, interaction, replySilent } = args;

    if (!interaction.isChatInputCommand())
        throw new BadInputForChatCommandError();

    const channel = interaction.channel;
    const messageID = interaction.options
        .getString(commandDefinition.sub.edit.options.messageid.name)?.trim();
    const text = interaction.options
        .getString(commandDefinition.sub.edit.options.text.name);

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
        .getString(commandDefinition.sub.fetch.options.messageid.name)
        ?.trim();
    const url = interaction.options
        .getString(commandDefinition.sub.fetch.options.url.name);

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
