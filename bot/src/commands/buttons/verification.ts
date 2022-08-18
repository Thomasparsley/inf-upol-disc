import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ButtonCommand } from "../../command";


const modalRow = new ActionRowBuilder()
    .addComponents(
        new TextInputBuilder()
            .setCustomId("verificationStudentUpolEmail")
            .setLabel("Zadejte Váš studentský email v rámci UPOL")
            .setStyle(TextInputStyle.Short),
    ) as ActionRowBuilder<TextInputBuilder>;
const modal = new ModalBuilder()
    .setCustomId("verificationStudentModal")
    .setTitle("Verifikace studenta")
    .addComponents(modalRow);

export const verificationFirewallButtonComamand = new ButtonCommand(
    "btnStuden",
    "Vrátí formulář pro verifikaci studenta",
    async ({ interaction, hasRole, replySilent }) => {
        if (hasRole("Student")) {
            await replySilent("Již jste oveřený.");
            return;
        }

        await interaction.showModal(modal);
    },
);
