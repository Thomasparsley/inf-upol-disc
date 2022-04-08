import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager, Role } from "discord.js";

import { Command } from "../command";

const StudentID = "960478701684936734";
const RequiredRoleOptionName = "nazev_role";
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
    async ({ interaction, replySilent, permissionRole }) => {

        if (!(await permissionRole(interaction, StudentID))) {
            return
        }
        
        const role = (interaction.options.getRole(RequiredRoleOptionName) as Role);
        if (!role) {
            replySilent("Error: Role#2")

            return;
        }

        if (!permittedRoleColors.includes(role.hexColor)) {
            replySilent("Tuto roli si zvolit nemůžeš.")

            return;
        }

        const roles = (interaction.member?.roles as GuildMemberRoleManager)
        if (!roles.cache.has(role.id)) {
            roles.add(role.id);
            replySilent(`Role ${role} byla "přidána".`)
        } else {
            roles.remove(role.id);
            replySilent(`Role ${role} byla "odebrána".`)
        }
    },
);
