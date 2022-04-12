import { SlashCommandBuilder } from "@discordjs/builders";

import { VOC_HasNotPermission } from "../vocabulary";
import { GuildMemberRoleManager } from "discord.js";
import { Command } from "../command";

const HostRoleID = "960478789161320448";

export const commandHost = new Command(
    "host",
    "Po odeslání obdržíš roli @Návštěvník.",
    new SlashCommandBuilder(),
    async ({ interaction, replySilent, permissionRolesCount }) => {

        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        if (roles.cache.has(HostRoleID)) {
            await replySilent("Tuto roli již máš.");
            return;
        }

        const hasPermission = await permissionRolesCount((size: Number) => size === 0);
        if (!hasPermission) {
            await replySilent(VOC_HasNotPermission);
            return;
        }

        roles.add(HostRoleID);
        const HostRole = interaction.guild?.roles.cache.get(HostRoleID);

        if (!HostRole) {
            await replySilent(`Byla ti přidělena role ${HostRoleID}`);
        } else {
            await replySilent("Byla ti přidělena role Návštěvník");
        }
    },
);
