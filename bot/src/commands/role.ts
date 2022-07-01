import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager, Role } from "discord.js";

import { VOC_HasNotPermission } from "../vocabulary";
import { Command } from "../command";
import { Err, Ok } from "../result";

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
            return Err("Error: role#1");
        }

        const hasPermission = await permissionRolesCount((size: Number) => size > 0);
        if (!hasPermission) {
            return Err(VOC_HasNotPermission);
        }

        const isStudent = await permissionRole(StudentID);
        const isStudentColor = isStudent && studentOnlyRoleColors.includes(role.hexColor);
        const isEveryoneColor = everyoneRoleColors.includes(role.hexColor);

        if (!isStudentColor && !isEveryoneColor) {
            return Err("Tuto roli si zvolit nemůžeš.");
        }

        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        if (!roles) {
            return Err("Error: role#2");
        }

        if (!roles.cache.has(role.id)) {
            return Ok([
                roles.add(role.id),
                replySilent(`Role ${role} byla **přidána**.`),
            ]);
        }

        return Ok([
            roles.remove(role.id),
            replySilent(`Role ${role} byla **odebrána**.`),
        ]);
    },
);
