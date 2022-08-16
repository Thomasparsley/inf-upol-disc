import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";

import { VOC_QuoteRequest, VOC_RequestSended } from "../vocabulary";
import { BadInputForChatCommandError, UnauthorizedError } from "../errors";
import { CD_QuoteRequest as cd } from "../cd";
import { ChatInputCommand } from "../command";

const RequestChannelID = "1009076301019238540";

export const everyRequestChatCommnad = new ChatInputCommand(
    cd.name,
    cd.description,
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(cd.options[0].name)
                .setDescription(cd.options[0].description)
                .setRequired(true);
        }),
    async ({ interaction, client, replySilent, permissionRolesCount }) => {
        const hasPermission = permissionRolesCount((size: Number) => size > 0);
        if (!hasPermission)
            throw new UnauthorizedError();

        if (!interaction.isChatInputCommand())
            throw new BadInputForChatCommandError();

        const sender = interaction.member;
        const senderRoom = interaction.channel;
        const requestText = interaction.options.getString(cd.options[0].name);

        if (!requestText)
            throw "Popisek žádosti nemůže být prázdný.".toError();

        const channel = (client.channels.cache.get(RequestChannelID) as TextChannel);
        if (!channel)
            throw "quoteRequest#1".toError();

        await channel.send(VOC_QuoteRequest(sender, requestText));
        await replySilent(VOC_RequestSended);
    },
);
