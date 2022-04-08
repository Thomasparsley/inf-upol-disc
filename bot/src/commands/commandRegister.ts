import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";

const RequiredOptionEmail = "argemail";

export const commandRegister = new Command(
    "cmdreg",
    "Zaregistruje command, který je součástí S2A2 botu. WIP.",
    new SlashCommandBuilder()
    .addStringOption(option => {
        return option
            .setName(RequiredOptionEmail)
            .setDescription("Zadejte validní email.")
            .setRequired(true);
    }),
    async ({ interaction }) => {
        await interaction.reply("WIP");
    },
);
