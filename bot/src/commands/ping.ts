import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";

export const pingCommand = new Command(
    "ping",
    "Na každý `ping` odpoví `pong`.",
    new SlashCommandBuilder(),
    async ({ interaction }) => {
        await interaction.reply("pong");
    },
);
