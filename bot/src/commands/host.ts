import { SlashCommandBuilder } from "@discordjs/builders";

import { VOC_HasNotPermission } from "../vocabulary";
import { GuildMemberRoleManager } from "discord.js";
import { Command } from "../command";
import { Err, Ok } from "../result";

const HostRoleID = "960478789161320448";

export const commandHost = new Command(
    "host",
    "Po odeslání obdržíš roli @Návštěvník.",
    new SlashCommandBuilder(),
    async ({ interaction, replySilent, permissionRolesCount }) => {

        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        if (roles.cache.has(HostRoleID)) {
            return Err("Tuto roli již máš.");
        }

        const hasPermission = await permissionRolesCount((size: Number) => size === 0);
        if (!hasPermission) {
            return Err(VOC_HasNotPermission);
        }

        roles.add(HostRoleID);
        const HostRole = interaction.guild?.roles.cache.get(HostRoleID);

        if (!HostRole) {
            await replySilent(`Byla ti přidělena role ${HostRoleID}`);
            return Ok({});
        }

        await replySilent("Byla ti přidělena role Návštěvník");
        return Ok({});
    },
);
