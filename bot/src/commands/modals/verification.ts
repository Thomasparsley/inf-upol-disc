import { VOC_VerificationCodeSended } from "../../vocabulary";
import { ModalCommand } from "../../command";
import { Validation } from "../../models";

import {
    isValidateEmail,
    isUpolEmail,
    makeRegisterText,
    makeRegisterHTML
} from "../../utils";
import {
    InvalidEmailFormatError,
    UnknownUpolEmailError,
} from "../../errors";

export const verificationModalCommand = new ModalCommand(
    "verificationStudentModal",
    "Zpracování verifikace studenta",
    async ({ interaction, replySilent, mailer }) => {

        const email = interaction.fields.getTextInputValue("verificationStudentUpolEmail")
        // validace emailu
        if (email === null || !isValidateEmail(email))
            throw new InvalidEmailFormatError(email as string);

        // validace domény emailu    
        if (!isUpolEmail(email))
            throw new UnknownUpolEmailError(email);

        // vygenerování 6 místného klíče   
        const verificationCode = Math.floor(Math.random() * 900000) + 100000;

        console.log(`Nové vygenerované heslo je: ${verificationCode}`);

        /* const validation = new Validation();
        validation.user = interaction.user.id;
        validation.key = verificationCode.toString();
        validation.createdAt = new Date();
        validation.expiresAt = new Date();
        validation.expiresAt.setHours(validation.expiresAt.getHours() + 1);

        await validation.save(); */

        await mailer.send({
            subject: "Validační kód pro discord server katedry informatiky - UPOL",
            to: email,
            text: makeRegisterText(verificationCode.toString().split("")),
            html: makeRegisterHTML(verificationCode.toString().split("")),
        });
        await replySilent(VOC_VerificationCodeSended(email));
    },
);
