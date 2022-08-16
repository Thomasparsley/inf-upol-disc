import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager, Role } from "discord.js";

import { VOC_RoleAdded, VOC_RoleRemoved } from "../vocabulary";
import { BadInputForChatCommandError, UnauthorizedError } from "../errors";
import { ChatInputCommand } from "../command";
import { CD_Role as cd} from "../cd";
import { Roles } from "../enums"

const everyoneRoleColors = cd.everyoneRoleColors;
const studentOnlyRoleColors = cd.studentOnlyRoleColors;

export const roleCommand = new ChatInputCommand(
    cd.name,
    cd.description,
    new SlashCommandBuilder()
        .addRoleOption(option => {
            return option
                .setName(cd.options[0].name)
                .setDescription(cd.options[0].description)
                .setRequired(true);
        }),
    async ({ interaction, replySilent, hasRole, permissionRolesCount }) => {

        const role = (interaction.options.getRole(cd.options[0].name) as Role);
        if (!role) 
            throw "role#1".toError();

        const hasPermission = permissionRolesCount((size: Number) => size > 0);
        if (!hasPermission) 
            throw new UnauthorizedError();
            
        const isStudent = hasRole(Roles["Katedra"]); 
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
