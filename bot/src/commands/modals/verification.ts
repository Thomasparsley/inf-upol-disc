import { VOC_VerificationCodeSended } from "../../vocabulary";
import { ModalCommand } from "../../command";
import { Validation } from "../../models";

import {
    isUpolEmail,
    makeRegisterText,
    makeRegisterHTML
} from "../../utils";
import {
    UnknownUpolEmailError,
} from "../../errors";
import { VerificationCodeButton } from "../../buttons/verificationCode";

/**
 * Modal command used for verifying email address of UPOL students
 */
export class VerificationModalCommand extends ModalCommand {
    name = "verificationStudentModal"

    protected async executable(): Promise<void> {
        let email: string = this.interaction.fields.getTextInputValue("verificationStudentUpolEmail")
        if (email === null)
            email = ""

        email = email.trim()

        // Email domain validation  
        if (!isUpolEmail(email))
            throw new UnknownUpolEmailError(email)

        // Generating a 6-character key
        const verificationCode = Math.floor(Math.random() * 900000) + 100000;

        const validation = new Validation()
        validation.user = this.interaction.user.id
        validation.key = verificationCode.toString()
        validation.createdAt = new Date()
        validation.expiresAt = new Date()
        validation.expiresAt.setHours(validation.expiresAt.getHours() + 1)

        const reply = this.replySilentWithButton(
            VOC_VerificationCodeSended(email),
            VerificationCodeButton,
        )
        const saveValidation = validation.save()
        const sendEmail = this.mailer.send({
            subject: "Validační kód pro discord server katedry informatiky - UPOL",
            to: email,
            text: makeRegisterText(verificationCode.toString().split("")),
            html: makeRegisterHTML(verificationCode.toString().split("")),
        })

        Promise.all([
            reply,
            saveValidation,
            sendEmail,
        ])
    }
}
