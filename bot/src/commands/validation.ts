import { SlashCommandBuilder } from "@discordjs/builders";

import { VOC_HasNotPermission } from "../vocabulary";
import { Command } from "../command";

const RequiredKeyOptionName = "key";

export const validationCommand = new Command(
    "validace",
    "Tento příkaz slouží k validaci účtu.",
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(RequiredKeyOptionName)
                .setDescription("Zadejte validační klíč. Pokud nemáš klíč tak použí příkaz register.")
                .setRequired(true);
        }),
    async ({ interaction, replySilent, permissionRolesCount }) => {
        
        const hasPermission = await permissionRolesCount((size: Number) => size === 0);
        if (!hasPermission) {
            await replySilent(VOC_HasNotPermission);
            return;
        }

        const userInput = interaction.options.getString(RequiredKeyOptionName);

        // getKeyFromDatabase

        if (userInput !== "1234567") {
            replySilent("Zadali jste invalidní klíč.");
            return;
        }

        replySilent("Úspěšně jste se ověřil.");
    },
);
