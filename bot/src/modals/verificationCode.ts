import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

/**
 * Modal used for finishing a student's verification
 * 
 * Takes a code sent to the user's email as an argument
 */
export const VerificationCodeModal = new ModalBuilder()
    .setCustomId("verificationCodeStudentModal")
    .setTitle("Verifikace studenta")
    .addComponents(
        new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("verificationCodeStudentInput")
                    .setLabel("Zadejte verifikační klíč")
                    .setStyle(TextInputStyle.Short),
            ) as ActionRowBuilder<TextInputBuilder>
    )
