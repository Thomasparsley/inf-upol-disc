import { ButtonCommand } from "../../command";
import { Roles } from "../../enums";

export const departmentFirewallButtonComamand = new ButtonCommand(
    "bntDepartment",
    "cd.description",
    async ({ replySilent, hasRole, getGuild }) => {

        if (hasRole(Roles["Student"])) {
            await replySilent("Student nemůže být součástí Katedry.");
            return;

        } else if (hasRole(Roles["Návštěva"])) {
            await replySilent("Host nemůže být součástí Katedry.");
            return;

        }  else if (hasRole(Roles["Katedra"])) {
            await replySilent("Již jste součástí Katedry.");
            return;
        }

        await getGuild().members.fetch({ withPresences: true })
        const users = (await getGuild().roles.fetch())
            .filter((role) => [Roles["Katedra"], Roles["Root"]].includes(role.id))
            .map((role) => role.members.map(member => member))
            .reduce((acc, members) => acc.concat(members), [])
            .sort((member) => member.roles.highest.id === Roles["Katedra"] ? -1 : 1)
            .map((member) => member.user);

        await replySilent(`Pro přidělení této role kontaktujte jednoho z těchto uživatelů ${users}.`);
    },
);
