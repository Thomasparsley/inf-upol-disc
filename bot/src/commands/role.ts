import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager } from "discord.js";

import { Command } from "../command";

const StudentID = 960478701684936734;
const RequiredRoleOptionName = "roleName";

export const validationCommand = new Command(
    "role",
    "Přidělí (odebere) požadovanou roli.",
    new SlashCommandBuilder()
        .addRoleOption(option => {
            return option
                .setName(RequiredRoleOptionName)
                .setDescription("Napiš jméno role.")
                .setRequired(true);
        }),
    async ({ interaction }) => {

        if (!interaction.member || !interaction.member.roles) {
            await interaction.reply({
                content: 'Error: Role#1',
                ephemeral: true,
            });
            return;
        }
           
        const roles = (interaction.member.roles as GuildMemberRoleManager)
        const hasPermissionRole = roles.cache.has;
        if (!hasPermissionRole((StudentID.toString()))) {
            await interaction.reply({
                content: 'Nemáš oprávnění pro tento příkaz!',
                ephemeral: true,
            });
            return;
        }
        
        const argRole = interaction.options.getRole(RequiredRoleOptionName);
        if (!argRole) {
            await interaction.reply({
                content: 'Error: Role#2',
                ephemeral: true,
            });
            return;
        }

        if (!hasPermissionRole(argRole.id)) {
            roles.add(argRole.id);
        } else {
            roles.remove(argRole.id);
        }

        await interaction.reply({
            content: `Role @${argRole.name} byla přidána.`,
            ephemeral: true,
        });
    },
);
