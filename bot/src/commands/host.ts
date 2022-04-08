import crypto from "crypto";

import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";
import { GuildMemberRoleManager } from "discord.js";

const HostRoleID = "960478789161320448";

export const commandHost = new Command(
    "host",
    "Po odeslání obdržíš roli @Návštěvník.",
    new SlashCommandBuilder(),
    async ({ interaction, client }) => {

        const roles = (interaction.member?.roles as GuildMemberRoleManager)
        
        if (!roles) {
            await interaction.reply({
                content: 'Error: host#1',
                ephemeral: true,
            });

            return;
        } else if (roles.cache.size !== 0) {
            await interaction.reply({
                content: 'Nemáš oprávnění pro tento příkaz!',
                ephemeral: true,
            });

            return;
        }

        if (!roles.cache.has(HostRoleID)) {
            roles.add(HostRoleID);
        } else {
            await interaction.reply({
                content: `Tuto roli již máš.`,
                ephemeral: true,
            });
        }

        const HostRole = interaction.guild?.roles.cache.get(HostRoleID)
        
        if (!HostRole) {
            await interaction.reply({
                content: `Byla ti přidělena role ${HostRoleID}`,
                ephemeral: true,
            });

            return
        }
        
        await interaction.reply({
            content: `Byla ti přidělena role Návštěvník`,
            ephemeral: true,
        });
    },
);
