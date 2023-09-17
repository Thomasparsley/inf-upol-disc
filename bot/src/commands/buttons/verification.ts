import { ButtonCommand } from "../../command"
import { VerificationModal } from "../../modals/verification"

/**
 * Button command ran when a user tries to acquire the Student role
 */
export class VerificationButtonComamand extends ButtonCommand {
    name = "btnStuden"
    modal = VerificationModal

    async executable(): Promise<void> {
        if (this.hasRole("Student")) {
            await this.replySilent("Již jste oveřený.")
            return
        }

        await this.interaction.showModal(this.modal)
    }
}
