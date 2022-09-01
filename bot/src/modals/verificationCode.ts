import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

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
