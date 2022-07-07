import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";

import { VOC_HasNotPermission } from "../vocabulary";
import { Command } from "../command";
import { Result } from "../result";

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
            return Result.err(VOC_HasNotPermission.toError());
        }

        const sender = interaction.member;
        const senderRoom = interaction.channel;
        const requestText = interaction.options.getString(RequiredOptionRequest);

        if (!requestText) {
            return Result.err("Popisek žádosti nemůže být prázdný.".toError());
        }

        const channel = (client.channels.cache.get(RequestChannelID) as TextChannel);
        if (!channel) {
            return Result.err("Error: everyoneRequest#1".toError());
        }

        
        return Result.ok([
            channel.send(`Uživatel ${sender} zažádal v ${senderRoom} o everyone. Důvod žádost: ${requestText}`),
            replySilent("Žádost byla odeslána."),
        ]);
    },
);
