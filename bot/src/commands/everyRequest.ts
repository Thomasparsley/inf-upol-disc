import { channelMention, SlashCommandBuilder } from "@discordjs/builders";
import { Channel, GuildChannel, Message, TextChannel } from "discord.js";

import { Command } from "../command";

const RequiredOptionRequest = "popisek_zadosti";
const RequestChannelID = "961981948740386826";

export const everyRequest = new Command(
    "everyreq",
    "Žádost o @overyone. Je možné žádat jednou za 96 hodin.",
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(RequiredOptionRequest)
                .setDescription("Zadej popisek žádosti o everyone.")
                .setRequired(true);
        }),
    async ({ interaction, client }) => {
        
        const sender = interaction.member
        const senderRoom = interaction.channel
        const requestText = interaction.options.getString(RequiredOptionRequest);

        if (!requestText) {
            await interaction.reply({
                content: `Popisek žádosti nemůže být prázdný.`,
                ephemeral: true,
            });
            return;
        }

        const channel = (client.channels.cache.get(RequestChannelID) as TextChannel);
        if (!channel) {
            await interaction.reply({
                content: 'Error: everyoneRequest#1',
                ephemeral: true,
            });
        } else {
            channel.send(`Uživatel ${sender} zažádal v ${senderRoom} s popiskem: \n ${requestText}`);
        }

        await interaction.reply({
            content: "Žádost byla odeslána.",
            ephemeral: true,
        });
    },
);
