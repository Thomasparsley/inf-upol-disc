import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const VerificationModal = new ModalBuilder()
    .setCustomId("verificationStudentModal")
    .setTitle("Verifikace studenta")
    .addComponents(
        new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("verificationStudentUpolEmail")
                    .setLabel("Zadejte Váš studentský email v úplném tvaru.")
                    .setStyle(TextInputStyle.Short),
            ) as ActionRowBuilder<TextInputBuilder>
    )
