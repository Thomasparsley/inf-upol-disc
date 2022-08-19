import {
    CacheType,
    GuildMember,
    Interaction,
    GuildMemberRoleManager,
} from "discord.js";

import { RoleIds } from "../enums";
import { RoleName } from "../types";


export function hasRole(interaction: Interaction<CacheType>) {
    return function (roleName: RoleName, user: GuildMember | null = null): boolean {
        const roleID = RoleIds[roleName];

        if (user)
            return user.roles.cache.has(roleID);

        const roles = (interaction.member?.roles as GuildMemberRoleManager)
        if (roles)
            return roles.cache.has(roleID);
        
        return false;
    }
}
