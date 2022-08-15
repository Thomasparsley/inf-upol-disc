import { ActionRowBuilder } from "@discordjs/builders";
import { ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonCommand } from "../../command";

const modal = new ModalBuilder()
    .setCustomId("customId")
    .setTitle("Verifikace studenta")
    .addComponents(
        new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("customId")
                    .setLabel("Zadejte Váš studentský email v rámci UPOL")
                    .setStyle(TextInputStyle.Short),
            ),
    );

export const verificationComamand = new ButtonCommand(
    "",
    "cd.description",
    async ({ interaction }) => {
        await interaction.showModal(modal);
    },
);
