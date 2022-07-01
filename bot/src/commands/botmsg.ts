import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { JSDOM } from "jsdom";

import { VOC_CantEditPermission, VOC_HasNotPermission } from "../vocabulary";
import { Command, CommandArgs } from "../command";
import { GuildChannelManager, GuildMemberManager, RoleManager } from "discord.js";
import { Err, Ok } from "../result";

const RequiredOptionMessageID = "message";
const RequiredOptionText = "text";
const RequiredOptionURL = "url";
const SubCommandAdd = "add";
const SubCommandEdit = "edit";
const SubCommandFetch = "fetch";
const rootID = "960452395312234537";
const modID = "960478652494118952";


const maxMessageLength = 2000;

const slashCommandBuilder = new SlashCommandBuilder()
.addSubcommand(subcommand => {
    return subcommand
        .setName(SubCommandAdd)
        .setDescription("Pošle zprávu pomocí bota.")
        .addStringOption(option => {
            return option
                .setName(RequiredOptionText)
                .setDescription("Text zprávy.")
                .setRequired(true);
        })
})
.addSubcommand(subcommand => {
    return subcommand
        .setName(SubCommandEdit)
        .setDescription("Upraví zprávu pomocí bota.")
        .addStringOption(option => {
            return option
                .setName(RequiredOptionMessageID)
                .setDescription("ID zprávy, kterou chceš upravit.")
                .setRequired(true);
        })
        .addStringOption(option => {
            return option
                .setName(RequiredOptionText)
                .setDescription("Nový text zprávy.")
                .setRequired(true);
        })
})
.addSubcommand(subcommand => {
    return subcommand
        .setName(SubCommandFetch)
        .setDescription("Načte z dané URL obsah zprávy.")
        .addStringOption(option => {
            return option
                .setName(RequiredOptionMessageID)
                .setDescription("ID zprávy, kterou chceš upravit.")
                .setRequired(true);
        })
        .addStringOption(option => {
            return option
                .setName(RequiredOptionURL)
                .setDescription("URL adresa.")
                .setRequired(true);
        })
}); 

export const botMessage = new Command(
    "botmessage",
    "Pošle nebo upraví zprávu pomocí bota.",
    slashCommandBuilder,
    async (args) => {
        const { interaction, replySilent, permissionRole } = args;

        const isRoot = await permissionRole(rootID);
        const isMod = await permissionRole(modID);
        if (!isRoot && !isMod) {
            return Err(VOC_HasNotPermission);
        }

        const subCommand = interaction.options.getSubcommand();
        switch (subCommand) {
            case SubCommandAdd:
                await commandAdd(args);
                break;

            case SubCommandEdit:
                await commandEdit(args);
                break;

            case SubCommandFetch:
                await commandFetch(args);
                break;

            default:
                return Err("Neznámý podpříkaz!");
        }

        await replySilent("Akce byla provedena.");
        return Ok({});
    },
);

async function commandAdd(args: CommandArgs): Promise<void> {
    const { interaction, replySilent } = args;

    const channel = interaction.channel
    const text = interaction.options.getString(RequiredOptionText);

    if (channel && text) {
        channel.send(text);
        return;
    }

    await replySilent("Error botmessage#1"); // TODO: Move to error
}

async function commandEdit(args: CommandArgs): Promise<void> {
    const { client, interaction, replySilent } = args;

    const channel = interaction.channel;
    const messageID = interaction.options.getString(RequiredOptionMessageID)?.trim();
    const text = interaction.options.getString(RequiredOptionText);

    if (channel && messageID && text) {
        const message = await channel.messages.fetch(messageID);

        if (!message) {
            await replySilent("Error botmessage#2"); // TODO: Move to error
            return;
        }

        if (message.author !== client.user) {
            await replySilent(VOC_CantEditPermission); 
        }

        message.edit(text);

        return;
    }

    await replySilent("Error botmessage#3"); // TODO: Move to error
}

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
    const { client, interaction, replySilent } = args;

    const channel = interaction.channel;
    const messageID = interaction.options.getString(RequiredOptionMessageID)?.trim();
    const url = interaction.options.getString(RequiredOptionURL);

    if (!channel || !messageID || !url) {
        await replySilent("Error: botmsg#1");
        return;
    }

    if (!isHttpUrl(url)) {
        await replySilent("Nepředal jsi validní URL."); // TODO: Move to error
        return;
    }

    const message = await channel.messages.fetch(messageID);

    if (message.author !== client.user) {
        await replySilent(VOC_CantEditPermission); // TODO: Move to error
        return;
    }

    let data: string = "";
    try {
        const response = await axios.get(url);
        data = (response.data as string);
    } catch (err) {
        console.error(err);
        await replySilent("Error: botmsg#2"); // TODO: Move to error
        return;
    }

    const messageContent = await handleMentions(data, args);
    
    if (!messageContent) {
        replySilent("Error: botmsg#5"); // TODO: Move to error
        return;
    }

    if (messageContent.length > maxMessageLength) {
        await replySilent(`Požadavek nebyl zpracován, protože text překročil ${maxMessageLength} znaků.`); // TODO: Move to error
        return;
    }

    message.edit(messageContent);
}

const channelTagName = "channel";
const roleTagName = "role";
const mentionTagName = "mention";

async function handleMentions(message: string, args: CommandArgs): Promise<string | null> {
    const { interaction, replySilent } = args;

    const channels = parseByTag(message, channelTagName);
    const roles = parseByTag(message, roleTagName);
    const mentions = parseByTag(message, mentionTagName);

    const guild = interaction.guild;
    const roleManager = guild?.roles;
    const channelManager = guild?.channels;
    const memberManager = guild?.members;
    
    if (!guild || !roleManager || !channelManager || !memberManager) {
        await replySilent("Error: botmsg#4"); // TODO: Move to error

        return null;
    }

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

        if (item) {
            data = data.replace(`<${tagName}>${itemName}</${tagName}>`, item.toString());
        }
    }

    return data;
}

function parseByTag(data: string, tagName: string): string[] {
    const { document } = new JSDOM(`<!DOCTYPE html>${data}`).window;

    const tagCollection = document.getElementsByTagName(tagName);
    const elements = Array.from(tagCollection);
    
    return elements.map(el => (el.textContent !== null) ? el.textContent : "");
}