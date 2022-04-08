import crypto from "crypto";

import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";
import { GuildMemberRoleManager } from "discord.js";

const RequiredOptionEmail = "email";
const VerificationCodeLength = 6;

function isValidateEmail(email: string): boolean {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) !== null;
}

function isUpolEmail(email: string): boolean {
    return email
        .toLowerCase()
        .includes("@upol.cz");
}

export const commandRegister = new Command(
    "registrace",
    "Zaregistruj se na náš discord a pokud jsi student tak obdrž roli @Studnet",
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(RequiredOptionEmail)
                .setDescription("Zadejte validní email.")
                .setRequired(true);
        }),
    async ({ interaction }) => {

        const email = interaction.options.getString(RequiredOptionEmail);

        if (email === null || !isValidateEmail(email)) {
            await interaction.reply({
                content: `Email není ve správném tvaru ${email}.`,
                ephemeral: true,
            });

            return
        } else if (!isUpolEmail(email)) {
            await interaction.reply({
                content: `Email nenáleží Univerzitě Palackého.`,
                ephemeral: true,
            });

            return
        }

        const roles = (interaction.member?.roles as GuildMemberRoleManager)
        if (!roles) {
            await interaction.reply({
                content: 'Error: regiter#1',
                ephemeral: true,
            });

            return;
        } else if (roles.cache.size === 0) {
            await interaction.reply({
                content: 'Nemáš oprávnění pro tento příkaz!',
                ephemeral: true,
            });
            
            return;
        }

        const verificationCode = crypto
            .randomBytes(VerificationCodeLength)
            .toString();

        // Save verification code to DB and send email.

        await interaction.reply({
            content: `Verifikační kod byl zaslán na email: ${email}.`,
            ephemeral: true,
        });
    },
);
