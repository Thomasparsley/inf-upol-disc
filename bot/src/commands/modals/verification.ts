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
import { VerificationCodeButton } from "../../buttons/verificationCode";


export class VerificationModalCommand extends ModalCommand {
    name = "verificationStudentModal"

    protected async executable(): Promise<void> {
        const email = this.interaction.fields.getTextInputValue("verificationStudentUpolEmail")

        // validace emailu
        if (email === null || !isValidateEmail(email))
            throw new InvalidEmailFormatError(email as string)

        // validace domény emailu    
        if (!isUpolEmail(email))
            throw new UnknownUpolEmailError(email)

        // vygenerování 6 místného klíče   
        const verificationCode = Math.floor(Math.random() * 900000) + 100000;

        const validation = new Validation()
        validation.user = this.interaction.user.id
        validation.key = verificationCode.toString()
        validation.createdAt = new Date()
        validation.expiresAt = new Date()
        validation.expiresAt.setHours(validation.expiresAt.getHours() + 1)

        await this.replySilentWithButton(
            VOC_VerificationCodeSended(email),
            VerificationCodeButton,
        )
        await validation.save()
        await this.mailer.send({
            subject: "Validační kód pro discord server katedry informatiky - UPOL",
            to: email,
            text: makeRegisterText(verificationCode.toString().split("")),
            html: makeRegisterHTML(verificationCode.toString().split("")),
        });
    }
}
