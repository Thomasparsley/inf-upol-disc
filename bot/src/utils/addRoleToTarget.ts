import { Role, User, CacheType, Interaction, ChatInputCommandInteraction } from "discord.js";

import { hasRole as hasRoleMaker } from "./hasRole";
import { replySilent as replySilentMaker } from "./replySilent";

import { UnauthorizedError } from "../errors";
import { RoleName } from "../types";
import { VOC_RoleAdded } from "../vocabulary";
import { RoleIds } from "../enums";


export function addRoleToTarget(interaction: Interaction<CacheType>) {
    return async function (fieldNameOfTarget: string, nameOfRoleToAdd: RoleName, allowedRoles: RoleName[]) {
        interaction = interaction as ChatInputCommandInteraction<CacheType>;

        const target = (interaction.options.getUser(fieldNameOfTarget) as User);
        if (!target)
            throw "addRole#1".toError();

        const hasRole = hasRoleMaker(interaction);
        const replySilent = replySilentMaker(interaction);

        const hasOneOfAllowedRoles = allowedRoles.every((roleName) => hasRole(roleName))
        if (!hasOneOfAllowedRoles)
            throw new UnauthorizedError();

        const targetAsMember = interaction.guild?.members.cache.get(target.id);
        if (!targetAsMember)
            throw "addRole#2".toError();

        const roleToAdd = interaction.guild?.roles.cache.get(RoleIds[nameOfRoleToAdd]) as Role;
        if (!roleToAdd)
            throw "addRole#3".toError();

        if (!targetAsMember.roles.cache.has(roleToAdd.id)) {
            await targetAsMember.roles.add(roleToAdd);
            await replySilent(VOC_RoleAdded(roleToAdd));
        } else {
            await replySilent("Tento uživatel roli katedra již má.");
        }
    }
}
