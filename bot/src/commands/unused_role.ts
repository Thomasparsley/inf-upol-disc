/* import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager, Role } from "discord.js";

import { VOC_RoleAdded, VOC_RoleRemoved } from "../vocabulary";
import { UnauthorizedError } from "../errors";
import { ChatInputCommand } from "../command";
import { CD_Role as cd} from "../cd";
import { RoleIds, RoleColors } from "../enums"
import { RoleName } from "../types";


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
            
        const isStudent = hasRole("Katedra"); 
        const isStudentColor = isStudent && [RoleColors["Student"], ].includes(role.hexColor);
        const isEveryoneColor = RoleColors["Everyone"].includes(role.hexColor);

        if (!isStudentColor && !isEveryoneColor) 
            throw "Tuto roli si zvolit nemůžeš.".toError();
        
        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        if (!roles) 
            throw "role#2".toError();

        if (!hasRole(role.name as RoleName)) {
            await roles.add(role.id);
            await replySilent(VOC_RoleAdded(role));
        } else {
            await roles.remove(role.id);
            await replySilent(VOC_RoleRemoved(role));
        }
    },
); */
