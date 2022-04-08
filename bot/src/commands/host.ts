import crypto from "crypto";

import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";
import { GuildMemberRoleManager } from "discord.js";

const HostRoleID = "960478789161320448";

export const commandHost = new Command(
    "host",
    "Po odeslání obdržíš roli @Návštěvník.",
    new SlashCommandBuilder(),
    async ({ interaction, client, replySilent }) => {

        const roles = (interaction.member?.roles as GuildMemberRoleManager)
        
        if (!roles) {
            replySilent("Error: host#1")

            return;
        } else if (roles.cache.size !== 0) {
            replySilent("Nemáš oprávnění pro tento příkaz!")

            return;
        }

        if (!roles.cache.has(HostRoleID)) {
            roles.add(HostRoleID);
        } else {
            replySilent("Tuto roli již máš.")
        }

        const HostRole = interaction.guild?.roles.cache.get(HostRoleID)
        
        if (!HostRole) {
            replySilent(`Byla ti přidělena role ${HostRoleID}`)
        } else {
            replySilent("Byla ti přidělena role Návštěvník")
        }
    },
);
