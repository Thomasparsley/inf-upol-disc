import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager, Role } from "discord.js";

import { Command } from "../command";

const StudentID = "960478701684936734";
const RequiredRoleOptionName = "rolename";
const permittedRoleColors = ["#9b59b6", "#607d8b", "#1abc9c"]

export const roleCommand = new Command(
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
        if (!roles.cache.has(StudentID)) {
            await interaction.reply({
                content: 'Nemáš oprávnění pro tento příkaz!',
                ephemeral: true,
            });
            return;
        }
        
        const role = (interaction.options.getRole(RequiredRoleOptionName) as Role);
        if (!role) {
            await interaction.reply({
                content: 'Error: Role#2',
                ephemeral: true,
            });
            return;
        }

        console.log(role.hexColor)

        if (!permittedRoleColors
                .includes(role.hexColor)) {
            await interaction.reply({
                content: 'Tuto roli si zvolit nemůžeš.',
                ephemeral: true,
            });
            return;
        }

        let text;
        if (!roles.cache.has(role.id)) {
            roles.add(role.id);
            text = "přidána";
        } else {
            roles.remove(role.id);
            text = "odebrána";
        }

        await interaction.reply({
            content: `Role @${role.name} byla ${text}.`,
            ephemeral: true,
        });
    },
);
