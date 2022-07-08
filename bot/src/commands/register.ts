import { SlashCommandBuilder } from "@discordjs/builders";

import { InvalidEmailFormatError, UnauthorizedError, UnknownUpolEmailError } from "../errors";
import { VOC_VerificationCodeSended } from "../vocabulary";
import { Validation } from "../models";
import { Command } from "../command";
import { CD_Register } from "../cd";

const cd = CD_Register;

export const commandRegister = new Command(
    cd.name,
    cd.description,
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(cd.options[0].name)
                .setDescription(cd.options[0].description)
                .setRequired(true);
        }),
    async ({ interaction, replySilent, permissionRolesCount }) => {
        const hasPermission = permissionRolesCount((size: Number) => size === 1);
        if (!hasPermission)
            throw new UnauthorizedError();

        const email = interaction.options.getString(cd.options[0].name);
        if (email === null || !isValidateEmail(email))
            throw new InvalidEmailFormatError(email as string);

        if (!isUpolEmail(email))
            throw new UnknownUpolEmailError(email);

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

        await replySilent(VOC_VerificationCodeSended(email));
    },
);

// TODO: Move outside
function isValidateEmail(email: string): boolean {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) !== null;
}

// TODO: Move outside
function isUpolEmail(email: string): boolean {
    return email
        .toLowerCase()
        .includes("@upol.cz");
}