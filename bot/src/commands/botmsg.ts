import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";

import { VOC_CantEditPermission, VOC_HasNotPermission } from "../vocabulary";
import { Command, CommandArgs } from "../command";
import { Client, CommandInteraction } from "discord.js";

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
            await replySilent(VOC_HasNotPermission);
            return;
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
                await replySilent("Marek.") // WIP <--
                return;
        }

        await replySilent("Akce byla provedena.");
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

    await replySilent("Error botmessage#1");
}

async function commandEdit(args: CommandArgs): Promise<void> {
    const { client, interaction, replySilent } = args;

    const channel = interaction.channel;
    const messageID = interaction.options.getString(RequiredOptionMessageID)?.trim();
    const text = interaction.options.getString(RequiredOptionText);

    if (channel && messageID && text) {
        const message = await channel.messages.fetch(messageID);

        if (!message) {
            await replySilent("Error botmessage#2");
            return;
        }

        if (message.author !== client.user) {
            await replySilent(VOC_CantEditPermission); 
        }

        message.edit(text);

        return;
    }

    await replySilent("Error botmessage#3");
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
        await replySilent("Nepředal jsi validní URL.");
        return;
    }

    const message = await channel.messages.fetch(messageID);

    if (message.author !== client.user) {
        await replySilent(VOC_CantEditPermission);
        return;
    }

    let data: string = "";
    try {
        const response = await axios.get(url);
        data = (response.data as string);
    } catch (err) {
        console.error(err);
        await replySilent("Error: botmsg#2");
        return;
    }

    if (data.length > maxMessageLength) {
        await replySilent(`Požadavek nebyl zpracován, protože text překročil ${maxMessageLength} znaků.`);
        return;
    }

    const messageContent = await handleMentions(data, args);

    if (!messageContent) {
        replySilent("Error: botmsg#5");

        return;
    }

    message.edit(messageContent);
}

function tagSubstring(string: string):string {
    const regex = /[&\/\,+()$~%.'":*?<>{}\s]/g;
    const index = string.search(regex);

    if(index === -1) {
        return string;
    }

    return string.slice(0, index);
}

async function handleMentions(message: string, args: CommandArgs): Promise<string | null> {
    const { interaction, replySilent } = args;

    const words = message.split(/\s*(?:;|\s|,)\s*/);
    const rooms = words.filter(word => word.startsWith('#')).map(word => tagSubstring(word));
    const mentions = words.filter(word => word.startsWith('@')).map(word => tagSubstring(word));

    const guild = interaction.guild;
    const roleManager = guild?.roles;
    const channelManager = guild?.channels;
    
    if (!guild || !roleManager || !channelManager) {
        await replySilent("Error: botmsg#4");

        return null;
    }

    for (const room of rooms) {
        const channel = channelManager.cache.find(r => r.name === room.replace("#", ""));

        if (channel) {
            message = message.replace(room, channel.toString());
        }
    }
    
    for (const mention of mentions) {
        const role = roleManager.cache.find(r => r.name === mention.replace("@", ""));

        if (role) {
            message = message.replace(mention, role.toString());
        }
    }

    return message;
}
