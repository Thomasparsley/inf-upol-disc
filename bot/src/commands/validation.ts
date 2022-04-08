import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager } from "discord.js";

import { Command } from "../command";

const RequiredKeyOptionName = "key";

export const validationCommand = new Command(
    "validace",
    "Na každý `validation` odpoví `pong`.",
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(RequiredKeyOptionName)
                .setDescription("Zadejte validační klíč.")
                .setRequired(true);
        }),
    async ({ interaction, replySilent, permissionRolesCount }) => {
        
        if (!(await permissionRolesCount(
                interaction,
                function isNotZero(size: Number){return size !== 0}))) {
            return
        }

        const key = interaction.options.getString(RequiredKeyOptionName);

        if (key !== "1234567") {
            replySilent("Zadali jste invalidní klíč.")

            return;
        }

        replySilent("Úspěšně jste se ověřil.")
    },
);
