import { CacheType, GuildMemberRoleManager, Interaction } from "discord.js";

import { RoleIds } from "../enums";
import { RoleName } from "../types";


export function hasRole(interaction: Interaction<CacheType>) {
    return function (roleName: RoleName): boolean {
        const roleID = RoleIds[roleName];
        const roles = (interaction.member?.roles as GuildMemberRoleManager)
        if (!roles) {
            return false;
        }

        return roles.cache.has(roleID);
    }
}
