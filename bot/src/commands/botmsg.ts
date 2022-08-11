import axios from "axios";
import { JSDOM } from "jsdom";

import { GuildChannelManager, GuildMemberManager, RoleManager } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import { BadInputForChatCommandError, InvalidURLError, UnauthorizedError, UnknownCommandError } from "../errors";
import { VOC_ActionSuccessful, VOC_CantEditPermission } from "../vocabulary";
import { Command, CommandArgs } from "../command";
import { CD_BotMessage } from "../cd";

const rootID = "960452395312234537";
const modID = "960478652494118952";

const cd = CD_BotMessage;
const subAdd = cd.sub.add;
const subEdit = cd.sub.edit;
const subFetch = cd.sub.fetch;

const maxMessageLength = 2000;

const slashCommandBuilder = new SlashCommandBuilder()
.addSubcommand(subcommand => {
    return subcommand
        .setName(subAdd.name)
        .setDescription(subAdd.description)
        .addStringOption(option => {
            return option
                .setName(subAdd.options[0].name)
                .setDescription(subAdd.options[0].description)
                .setRequired(true);
        })
})
.addSubcommand(subcommand => {
    return subcommand
        .setName(subEdit.name)
        .setDescription(subEdit.description)
        .addStringOption(option => {
            return option
                .setName(subEdit.options[0].name)
                .setDescription(subEdit.options[0].description)
                .setRequired(true);
        })
        .addStringOption(option => {
            return option
                .setName(subEdit.options[1].name)
                .setDescription(subEdit.options[1].description)
                .setRequired(true);
        })
})
.addSubcommand(subcommand => {
    return subcommand
        .setName(subFetch.name)
        .setDescription(subFetch.description)
        .addStringOption(option => {
            return option
                .setName(subFetch.options[0].name)
                .setDescription(subFetch.options[0].description)
                .setRequired(true);
        })
        .addStringOption(option => {
            return option
                .setName(subFetch.options[1].name)
                .setDescription(subFetch.options[1].description)
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
            case subAdd.name:
                await commandAdd(args);
                break;

            case subEdit.name:
                await commandEdit(args);
                break;

            case subFetch.name:
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
    const text = interaction.options.getString(subAdd.options[0].name);

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
    const messageID = interaction.options.getString(subEdit.options[0].name)?.trim();
    const text = interaction.options.getString(subEdit.options[1].name);

    if (channel && messageID && text) {
        const message = await channel.messages.fetch(messageID);

        if (!message)
            throw "botmessage#2".toError();
        

        if (message.author !== client.user) {
            await replySilent(VOC_CantEditPermission); // TODO: Move to error?
        }

        message.edit(text);
        return;
    }

    throw new Error("botmessage#3");
}

// TODO: Move outside
function isHttpUrl(string: string): boolean {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }

    if (!string.endsWith(".md")
        && !string.endsWith(".markdown")
        && !string.endsWith(".txt")
    ) {
        return false;
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

async function commandFetch(args: CommandArgs): Promise<void> {
    const { client, interaction } = args;

    if (!interaction.isChatInputCommand())
        throw "ERRR".toError();

    const channel = interaction.channel;
    const messageID = interaction.options.getString(subFetch.options[0].name)?.trim();
    const url = interaction.options.getString(subFetch.options[1].name);

    if (!channel || !messageID || !url)
        throw "botmsg#1".toError();

    if (!isHttpUrl(url))
        throw new InvalidURLError();
    

    const message = await channel.messages.fetch(messageID);

    if (message.author !== client.user)
        throw VOC_CantEditPermission.toError();

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

const channelTagName = "channel";
const roleTagName = "role";
const mentionTagName = "mention";

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

function replaceTags(
        data: string, 
        tagName: string, 
        items: string[],
        manager: RoleManager | GuildMemberManager | GuildChannelManager,
    ): string {
    for (const itemName of items) {
        // Used datatype any due to different managers find methods.
        const item = (manager.cache as any).find((item: { name: string; }) => item.name === itemName);

        if (item)
            data = data.replace(`<${tagName}>${itemName}</${tagName}>`, item.toString());
    }

    return data;
}

function parseByTag(data: string, tagName: string): string[] {
    const { document } = new JSDOM(`<!DOCTYPE html>${data}`).window;

    const tagCollection = document.getElementsByTagName(tagName);
    const elements = Array.from(tagCollection);
    
    return elements.map(el => (el.textContent !== null) ? el.textContent : "");
}