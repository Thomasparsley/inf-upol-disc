import { GuildMemberRoleManager } from "discord.js";
import { ButtonCommand } from "../../command";
import { RoleIds } from "../../enums";

export const hostFirewallButtonComamand = new ButtonCommand(
    "btnHost",
    "Přidělí roli @host",
    async ({ interaction, replySilent, hasRole, getGuild }) => {

        if (hasRole("Student")) {
            await replySilent("Student nemůže být hostem.");
            return;
        }
        if (hasRole("Katedra")) {
            await replySilent("Jelikož jste součástí Katedry, nemůžete být hostem.");
            return;
        }

        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        const hostRole = await getGuild().roles.fetch(RoleIds["Návštěva"])
        if (!hostRole)
            return;

        if (!roles.cache.has(hostRole.id)) {
            await roles.add(hostRole.id);
            await replySilent(`Děkujeme, že máte zájem navštívit náš server! Role ${hostRole} Vám byla přidělena.`);
        } else {
            await roles.remove(hostRole.id);
            await replySilent(`Děkujeme, že jste navštívili náš server! Role ${hostRole} Vám byla odebrána.`);
        }
    },
);
