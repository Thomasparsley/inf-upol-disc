import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";

export const commandRegister = new Command(
    "registrace",
    "Zaregistruj se na náš discord a pokud jsi student tak obdrž roli @Studnet",
    new SlashCommandBuilder(),
    async ({ interaction }) => {
        await interaction.reply("WIP");
    },
);
