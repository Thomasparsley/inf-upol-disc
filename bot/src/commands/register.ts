import crypto from "crypto";

import { SlashCommandBuilder } from "@discordjs/builders";
import { VOC_HasNotPermission } from "../vocabulary";
import { Command } from "../command";
import { Validation } from "../models";

const RequiredOptionEmail = "email";

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

        const hasPermission = await permissionRolesCount((size: Number) => size === 1);
        if (!hasPermission) {
            await replySilent(VOC_HasNotPermission);
            return;
        }

        const email = interaction.options.getString(RequiredOptionEmail);
        if (email === null || !isValidateEmail(email)) {
            await replySilent(`Email není ve správném tvaru ${email}.`);
            return;
        }

        if (!isUpolEmail(email)) {
            await replySilent(`${email} napatrí do domény Univerzitě Palackého. Registrace je jen pro emaily typu \`uživatel@upol.cz\`.`);
            return;
        }

        const verificationCode = Math.floor(Math.random() * 900000) + 100000;

        console.log(`Nové vygenerované heslo je: ${verificationCode}`)

        const validation = new Validation();
        validation.user = interaction.user.id;
        validation.key = verificationCode.toString();
        validation.createdAt = new Date();
        validation.expiresAt = new Date();
        validation.expiresAt.setHours(validation.expiresAt.getHours() + 1);

        await validation.save();

        // send email

        await replySilent(`Verifikační kod byl zaslán na email: ${email}.`);
    },
);
