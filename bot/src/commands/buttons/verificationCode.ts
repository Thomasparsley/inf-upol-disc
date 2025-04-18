import { VerificationCodeModal } from "../../modals/verificationCode"
import { VerificationButtonComamand } from "./verification"

/** 
 * Button command ran when a user tries to verify their email address when attempting to acquire the Student role
 */
export class VerificationCodeButtonComamand extends VerificationButtonComamand {
    name = "veficationCodeStudent"
    modal = VerificationCodeModal
}
