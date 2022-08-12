import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager, Role } from "discord.js";

import { VOC_RoleAdded, VOC_RoleRemoved } from "../vocabulary";
import { BadInputForChatCommandError, UnauthorizedError } from "../errors";
import { Command } from "../command";
import { CD_Role as cd} from "../cd";

const StudentID = "960478701684936734";
const RequiredRoleOptionName = "role";
const everyoneRoleColors = ["#9b59b6", "#1abc9c"] // oznámení (zelená)
const studentOnlyRoleColors = ["#9b59b6", "#33aadd", "#95a5a6"] // programovací jazyky (fialová), obory (modrá), předměty (šedá)

export const roleCommand = new Command(
    cd.name,
    cd.description,
    new SlashCommandBuilder()
        .addRoleOption(option => {
            return option
                .setName(cd.options[0].name)
                .setDescription(cd.options[0].description)
                .setRequired(true);
        }),
    async ({ interaction, replySilent, permissionRole, permissionRolesCount }) => {
        if (!interaction.isChatInputCommand())
            throw new BadInputForChatCommandError();

        const role = (interaction.options.getRole(RequiredRoleOptionName) as Role);
        if (!role) 
            throw "role#1".toError();

        const hasPermission = permissionRolesCount((size: Number) => size > 0);
        if (!hasPermission) 
            throw new UnauthorizedError();

        const isStudent = permissionRole(StudentID);
        const isStudentColor = isStudent && studentOnlyRoleColors.includes(role.hexColor);
        const isEveryoneColor = everyoneRoleColors.includes(role.hexColor);

        if (!isStudentColor && !isEveryoneColor) 
            throw "Tuto roli si zvolit nemůžeš.".toError();

        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        if (!roles) 
            throw "role#2".toError();

        if (!roles.cache.has(role.id)) {
            await roles.add(role.id);
            await replySilent(VOC_RoleAdded(role));
        } else {
            await roles.remove(role.id);
            await replySilent(VOC_RoleRemoved(role));
        }
    },
);
