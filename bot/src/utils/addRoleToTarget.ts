import { CacheType, Interaction, ChatInputCommandInteraction } from "discord.js";

import { hasRole as hasRoleMaker } from "./hasRole";
import { replySilent as replySilentMaker } from "./replySilent";

import { UnauthorizedError } from "../errors";
import { RoleName } from "../types";
import { VOC_RoleAdded } from "../vocabulary";
import { RoleIds } from "../enums";


export function addRoleToTarget(interaction: Interaction<CacheType>) {
    return async function (fieldNameOfTarget: string, nameOfRoleToAdd: RoleName, allowedRoles: RoleName[]) {
        interaction = interaction as ChatInputCommandInteraction<CacheType>;

        const target = interaction.options.getUser(fieldNameOfTarget);
        if (!target)
            throw "addRole#1".toError();

        const hasRole = hasRoleMaker(interaction);

        const hasOneOfAllowedRoles = allowedRoles.some((roleName) => hasRole(roleName))
        if (!hasOneOfAllowedRoles)
            throw new UnauthorizedError();

        const targetAsMember = interaction.guild?.members.cache.get(target.id);
        if (!targetAsMember)
            throw "addRole#2".toError();

        const roleToAdd = interaction.guild?.roles.cache.get(RoleIds[nameOfRoleToAdd]);
        if (!roleToAdd)
            throw "addRole#3".toError();

        const replySilent = replySilentMaker(interaction);

        if (hasRole(roleToAdd.name as RoleName, targetAsMember)) {
            await replySilent(`Uživatel ${targetAsMember} roli ${roleToAdd} již má.`);
            return;
        }

        await targetAsMember.roles.add(roleToAdd);
        await replySilent(VOC_RoleAdded(roleToAdd));
    }
}
