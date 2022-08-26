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
        if (!roleHost)
            return

        if (!this.hasRole("Návštěva")) {
            await this.addRole("Návštěva")
            await this.replySilent(`Děkujeme, že máte zájem navštívit náš server! Role ${roleHost} Vám byla přidělena.`)
        } else {
            await this.removeRole("Návštěva")
            await this.replySilent(`Děkujeme, že jste navštívili náš server! Role ${roleHost} Vám byla odebrána.`)
        }
    }
}
