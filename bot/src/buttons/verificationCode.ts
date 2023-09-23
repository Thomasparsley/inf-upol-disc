import { ButtonBuilder, ButtonStyle } from "discord.js";
import { getButtonStyle } from "../utils";

/**
 * Builder for the verification code button
 */
export const VerificationCodeButton = new ButtonBuilder()
    .setCustomId("veficationCodeStudent")
    .setLabel("Mám verifikační klíč")
    .setStyle(getButtonStyle(ButtonStyle.Primary as unknown as string))
