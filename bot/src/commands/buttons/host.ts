import { InteractionResponse } from "discord.js"
import { ButtonCommand } from "../../command"

export class HostFirewallButtonComamand extends ButtonCommand {
    name = "btnHost"

    async executable(): Promise<void> {
        if (this.hasRole("Student")) {
            await this.replySilent("Student nemůže být hostem.")
            return
        }
        if (this.hasRole("Katedra")) {
            await this.replySilent("Jelikož jste součástí Katedry, nemůžete být hostem.")
            return
        }

        const roleHost = await this.guild().roles.fetch(this.getRoleID("Návštěva"))
        if (!roleHost) {
            return
        }

        let manageRole: Promise<void> | undefined = undefined
        let reply: Promise<void | InteractionResponse<boolean>> | undefined = undefined
        if (!this.hasRole("Návštěva")) {
            manageRole = this.addRole("Návštěva")
            reply = this.replySilent(`Děkujeme, že máte zájem navštívit náš server! Role ${roleHost} Vám byla přidělena.`)
        } else {
            manageRole = this.removeRole("Návštěva")
            reply = this.replySilent(`Děkujeme, že jste navštívili náš server! Role ${roleHost} Vám byla odebrána.`)
        }

        Promise.all([
            manageRole,
            reply,
        ])
    }
}
