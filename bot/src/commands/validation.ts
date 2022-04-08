import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager } from "discord.js";

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
    async ({ interaction, replySilent }) => {

        const roles = (interaction.member?.roles as GuildMemberRoleManager)
        
        if (!roles) {
            replySilent("Error: validation#1")

            return;
        } else if (roles.cache.size !== 0) {
            replySilent("Nemáš oprávnění pro tento příkaz!")

            return;
        }

        const key = interaction.options.getString(RequiredKeyOptionName);

        if (key !== "1234567") {
            replySilent("Zadali jste invalidní klíč.")

            return;
        }

        replySilent("Úspěšně jste se ověřil.")
    },
);
