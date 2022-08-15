import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonCommand } from "../../command";


const modalRow = new ActionRowBuilder()
    .addComponents(
        new TextInputBuilder()
            .setCustomId("customId")
            .setLabel("Zadejte Váš studentský email v rámci UPOL")
            .setStyle(TextInputStyle.Short),
    ) as ActionRowBuilder<TextInputBuilder>;
const modal = new ModalBuilder()
    .setCustomId("customId")
    .setTitle("Verifikace studenta")
    .addComponents(modalRow);

export const verificationFirewallButtonComamand = new ButtonCommand(
    "btnStuden",
    "Vrátí formulář pro verifikaci studenta",
    async ({ interaction }) => {
        await interaction.showModal(modal);
    },
);
