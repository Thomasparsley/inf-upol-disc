import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager, Role } from "discord.js";

import { VOC_HasNotPermission } from "../vocabulary";
import { Command } from "../command";

const StudentID = "960478701684936734";
const RequiredRoleOptionName = "role";
const everyoneRoleColors = ["#9b59b6", "#1abc9c"] // oznámení (zelená)
const studentOnlyRoleColors = ["#9b59b6", "#33aadd", "#95a5a6"] // programovací jazyky (fialová), obory (modrá), předměty (šedá)

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
    async ({ interaction, replySilent, permissionRole, permissionRolesCount }) => {

        const role = (interaction.options.getRole(RequiredRoleOptionName) as Role);
        if (!role) {
            await replySilent("Error: role#1");
            return;
        }

        const hasPermission = await permissionRolesCount((size: Number) => size > 0);
        if (!hasPermission) {
            await replySilent(VOC_HasNotPermission);
            return;
        }

        const isStudent = await permissionRole(StudentID);
        const isStudentColor = isStudent && studentOnlyRoleColors.includes(role.hexColor);
        const isEveryoneColor = everyoneRoleColors.includes(role.hexColor);

        if (!isStudentColor && !isEveryoneColor) {
            await replySilent("Tuto roli si zvolit nemůžeš.");
            return;
        }

        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        if (!roles) {
            await replySilent("Error: role#2");
            return;
        }

        if (!roles.cache.has(role.id)) {
            roles.add(role.id);
            await replySilent(`Role ${role} byla **přidána**.`);

            return;
        }

        roles.remove(role.id);
        await replySilent(`Role ${role} byla **odebrána**.`);
    },
);
