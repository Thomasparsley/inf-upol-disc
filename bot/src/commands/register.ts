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
    async ({ interaction, replySilent, permissionRolesCount }) => {

        if (!(await permissionRolesCount(
                interaction,
                function isNotZero(size: Number){return size !== 0}))) {
            return
        }
        
        const email = interaction.options.getString(RequiredOptionEmail);

        if (email === null || !isValidateEmail(email)) {
            replySilent(`Email není ve správném tvaru ${email}.`)

            return
        } else if (!isUpolEmail(email)) {
            replySilent(`${email} napatrí do domény Univerzitě Palackého. Registrace je jen pro emaily typu \`uživatel@upol.cz\`.`)

            return
        }

        const verificationCode = crypto
            .randomBytes(VerificationCodeLength)
            .toString();

        // Save verification code to DB and send email.

        replySilent(`Verifikační kod byl zaslán na email: ${email}.`)
    },
);
