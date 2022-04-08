import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";

const RequiredKeyOptionName = "key";

export const validationCommand = new Command(
    "validation",
    "Na každý `validation` odpoví `pong`.",
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(RequiredKeyOptionName)
                .setDescription("Zadejte validační klíč.")
                .setRequired(true);
        }),
    async ({ interaction }) => {

        const key = interaction.options.getString(RequiredKeyOptionName);

        if (key !== "1234567") {
            await interaction.reply({
                content: "Zadali jste invalidní klíč.",
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({
            content: "Úspěšně jste se ověřil.",
            ephemeral: true,
        });
        
    },
);
