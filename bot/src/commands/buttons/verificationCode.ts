import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js"
import { getButtonStyle } from "../../utils"
import { VerificationCodeModal } from "../modals/verificationCode"
import { VerificationFirewallButtonComamand } from "./verification"


export const VerificationCodeButton = new ButtonBuilder()
    .setCustomId("veficationCodeStudent")
    .setLabel("Mám verifikační klíč")
    .setStyle(getButtonStyle(ButtonStyle.Primary as unknown as string))

export class VerificationCodeButtonComamand extends VerificationFirewallButtonComamand {
    name = "veficationCodeStudent"
    modal = VerificationCodeModal
}
