import { SlashCommandBuilder } from "@discordjs/builders";

import { VOC_VerificationCodeSended } from "../../vocabulary";
import { Validation } from "../../models";
import { Command } from "../../command";
import { CD_Register as cd } from "../../cd";

import {
    isValidateEmail,
    isUpolEmail,
    makeRegisterText,
    makeRegisterHTML
} from "../../utils";
import {
    BadInputForChatCommandError,
    InvalidEmailFormatError,
    UnknownUpolEmailError,
} from "../../errors";

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
    async ({ interaction, replySilent, permissionRolesCount, mailer }) => {
        if (!interaction.isChatInputCommand())
            throw new BadInputForChatCommandError();

        // mohou použít jen nový uživatelé, kteří nejsou zvalidováni
        // const hasPermission = permissionRolesCount((size: Number) => size === 1);
        // if (!hasPermission)
        //     throw new UnauthorizedError();
        
        const email = interaction.options.getString(cd.options[0].name);
        // validace emailu
        if (email === null || !isValidateEmail(email))
            throw new InvalidEmailFormatError(email as string);

        // validace domény emailu    
        if (!isUpolEmail(email))
            throw new UnknownUpolEmailError(email);

        // vygenerování 6 místného klíče   
        const verificationCode = Math.floor(Math.random() * 900000) + 100000;

        console.log(`Nové vygenerované heslo je: ${verificationCode}`)

        const validation = new Validation();
        validation.user = interaction.user.id;
        validation.key = verificationCode.toString();
        validation.createdAt = new Date();
        validation.expiresAt = new Date();
        validation.expiresAt.setHours(validation.expiresAt.getHours() + 1);

        await validation.save();
        await mailer.send({
            subject: "Validační kód pro discord server katedry informatiky - UPOL",
            to: email,
            text: makeRegisterText(),
            html: makeRegisterHTML(verificationCode.toString()),
        });
        await replySilent(VOC_VerificationCodeSended(email));
    },
);
