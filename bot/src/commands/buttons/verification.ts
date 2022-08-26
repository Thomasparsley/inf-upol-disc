import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import { ButtonCommand } from "../../command"

export class VerificationFirewallButtonComamand extends ButtonCommand {
    name = "btnStuden"
    modal = new ModalBuilder()
        .setCustomId("verificationStudentModal")
        .setTitle("Verifikace studenta")
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId("verificationStudentUpolEmail")
                        .setLabel("Zadejte Váš studentský email v rámci UPOL")
                        .setStyle(TextInputStyle.Short),
                ) as ActionRowBuilder<TextInputBuilder>
        )

    async executable(): Promise<void> {
        if (this.hasRole("Student")) {
            await this.replySilent("Již jste oveřený.")
            return
        }

        await this.interaction.showModal(this.modal)
    }
}
