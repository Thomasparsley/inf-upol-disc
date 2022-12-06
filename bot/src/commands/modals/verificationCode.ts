import { ModalCommand } from "../../command";
import { Validation } from "../../models";


const VERIFICATION_CODE_LENGTH = 6

export class VerificationCodeModalCommand extends ModalCommand {
    name = "verificationCodeStudentModal"

    protected async executable(): Promise<void> {
        const user = this.interaction.user.id
        const code = this.interaction.fields.getTextInputValue("verificationCodeStudentInput")

        if (!code) {
            await this.replySilent("Verifikační klíč nebyl zaslán")
            return
        }
        if (code.length !== VERIFICATION_CODE_LENGTH) {
            await this.replySilent("Verifikační klíč musí mít právě 6 znaků")
            return
        }

        const validation = await Validation.findOne({ where: { user: user, key: code } })
        if (!validation) {
            await this.replySilent("Verifikační klíč není platný")
            return
        }
        if (validation.expiresAt <= new Date()) {
            await this.replySilent("Platnost verifikačního klíče vypršela")
            return
        }

        if (this.hasRole("Návštěva")) {
            await this.removeRole("Návštěva")
        }

        const addRole = this.addRole("Student")
        const reply = this.replySilent("Úspěšně jste se oveřil!")
        const removeValidation = validation.remove()

        Promise.all([
            addRole,
            reply,
            removeValidation,
        ])
    }
}
