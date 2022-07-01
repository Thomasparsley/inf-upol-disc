import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";

import { VOC_HasNotPermission } from "../vocabulary";
import { Command } from "../command";
import { Err, Ok } from "../result";

const RequiredOptionRequest = "popisek";
const RequestChannelID = "961981948740386826";

export const everyRequest = new Command(
    "everyreq",
    "Žádost o @everyone. Prosíme popište podrobně svoji žádost. Zneužití se trestá.",
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(RequiredOptionRequest)
                .setDescription("Zadej popisek žádosti o everyone.")
                .setRequired(true);
        }),
    async ({ interaction, client, replySilent, permissionRolesCount }) => {

        const hasPermission = await permissionRolesCount((size: Number) => size > 0);
        if (!hasPermission) {
            return Err(VOC_HasNotPermission);
        }

        const sender = interaction.member;
        const senderRoom = interaction.channel;
        const requestText = interaction.options.getString(RequiredOptionRequest);

        if (!requestText) {
            return Err("Popisek žádosti nemůže být prázdný.");
        }

        const channel = (client.channels.cache.get(RequestChannelID) as TextChannel);
        if (!channel) {
            return Err("Error: everyoneRequest#1");
        }

        channel.send(`Uživatel ${sender} zažádal v ${senderRoom} o everyone. Důvod žádost: ${requestText}`);
        await replySilent("Žádost byla odeslána.");
        return Ok({});
    },
);
