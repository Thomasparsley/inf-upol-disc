import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager } from "discord.js";

import { UnauthorizedError } from "../errors";
import { VOC_RoleAdded } from "../vocabulary";
import { Command } from "../command";
import { CD_Host } from "../cd";

const HostRoleID = "960478789161320448";
const cd = CD_Host;


export const commandHost = new Command(
    cd.name,
    cd.description,
    new SlashCommandBuilder()
        .setDMPermission(true),
    async ({ interaction, replySilent, permissionRolesCount }) => {
        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        if (roles.cache.has(HostRoleID)) 
            throw "Tuto roli již máš.".toError();

        const hasPermission = permissionRolesCount((size: Number) => size === 0);
        if (!hasPermission) 
            throw new UnauthorizedError();

        roles.add(HostRoleID);
        const HostRole = interaction.guild?.roles.cache.get(HostRoleID);

        await replySilent(
            VOC_RoleAdded((!HostRole)? HostRoleID : "Návštěvník")
        );
    },
);
