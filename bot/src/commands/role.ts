import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager, Role } from "discord.js";

import { VOC_HasNotPermission } from "../vocabulary";
import { Command } from "../command";
import { Result } from "../result";

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
            return Result.err("Error: role#1".toError());
        }

        const hasPermission = await permissionRolesCount((size: Number) => size > 0);
        if (!hasPermission) {
            return Result.err(VOC_HasNotPermission.toError());
        }

        const isStudent = await permissionRole(StudentID);
        const isStudentColor = isStudent && studentOnlyRoleColors.includes(role.hexColor);
        const isEveryoneColor = everyoneRoleColors.includes(role.hexColor);

        if (!isStudentColor && !isEveryoneColor) {
            return Result.err("Tuto roli si zvolit nemůžeš.".toError());
        }

        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        if (!roles) {
            return Result.err("Error: role#2".toError());
        }

        if (!roles.cache.has(role.id)) {
            return Result.ok([
                roles.add(role.id),
                replySilent(`Role ${role} byla **přidána**.`),
            ]);
        }

        return Result.ok([
            roles.remove(role.id),
            replySilent(`Role ${role} byla **odebrána**.`),
        ]);
    },
);
