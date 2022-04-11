import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";

import { VOC_HasNotPermission } from "../vocabulary";
import { Command, CommandArgs } from "../command";

const RequiredOptionMessageID = "message";
const RequiredOptionText = "text";
const SubCommandAdd = "add";
const SubCommandEdit = "edit";
const SubCommandFetch = "fetch";
const rootID = "960452395312234537";
const modID = "960478652494118952";

export const botMessage = new Command(
    "botmessage",
    "Pošle nebo upraví zprávu pomocí bota.",
    new SlashCommandBuilder()
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
                        .setName(RequiredOptionText)
                        .setDescription("URL adresa.")
                        .setRequired(true);
                })
        }),
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

        await replySilent("Akce byla provedena.")
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
            await replySilent("Bot může upravovat jen svoje zprávy!"); // <-- Move into VOC
        }

        message.edit(text);

        return;
    }

    await replySilent("Error botmessage#3");
}

async function commandFetch(args: CommandArgs): Promise<void> {
    const { client, interaction, replySilent } = args;

    const channel = interaction.channel;
    const messageID = interaction.options.getString(RequiredOptionMessageID)?.trim();
    const url = interaction.options.getString(RequiredOptionText);

    if (!channel || !messageID || !url) {
        // Reply with error
        return;
    }

    const message = await channel.messages.fetch(messageID);

    if (message.author !== client.user) {
        await replySilent("Bot může upravovat jen svoje zprávy!"); // <-- Move into VOC
        return;
    }


    if (!url) {
        return;
    }

    // valid?

    let data: string = "";
    try {
        const response = await axios.get(url);
        data = (response.data as string);
    } catch (err) {
        console.error(err);
        // Reply with error

        return;
    }

    message.edit(data);

}
