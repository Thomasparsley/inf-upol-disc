import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";

export const validationCommand = new Command(
    "validation",
    "Na každý `validation` odpoví `pong`.",
    new SlashCommandBuilder(),
    async ({ interaction }) => {
        await interaction.reply("pong");
    },
);
