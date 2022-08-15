import { GuildMemberRoleManager } from "discord.js";
import { ButtonCommand } from "../../command";
import { Roles } from "../../enums";

export const hostFirewallButtonComamand = new ButtonCommand(
    "btnHost",
    "Přidělí roli @host",
    async ({ interaction, replySilent, hasRole }) => {

        if (hasRole(Roles["Student"])) {
            await replySilent("Student nemůže být hostem.");
            return;
        }

        if (hasRole(Roles["Katedra"])) {
            await replySilent("Jelikož jste součástí Katedry, nemůžete být hostem.");
            return;
        }

        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        if (!roles.cache.has(Roles["Návštěva"])) {
            await roles.add(Roles["Návštěva"]);
            await replySilent("Děkujeme, že máte zájem navštívit náš server! Role @Návštěva Vám byla přidělena.");
        } else {
            await roles.remove(Roles["Návštěva"]);
            await replySilent("Děkujeme, že jste navštívili náš server! Role @Návštěva Vám byla odebrána.");
        }
    },
);
