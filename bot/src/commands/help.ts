import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";

export const helpCommand = new Command(
    "help",
    "Na každý `help` odpoví `pong`.",
    new SlashCommandBuilder(),
    async ({ interaction }) => {
        await interaction.reply("pong");
    },
);
