import { ButtonCommand } from "../../command";
import { RoleIds } from "../../enums";

export const departmentFirewallButtonComamand = new ButtonCommand(
    "bntDepartment",
    "cd.description",
    async ({ replySilent, hasRole, getGuild }) => {

        if (hasRole("Student")) {
            await replySilent("Student nemůže být součástí Katedry.");
            return;

        } else if (hasRole("Návštěva")) {
            await replySilent("Host nemůže být součástí Katedry.");
            return;

        }  else if (hasRole("Katedra")) {
            await replySilent("Již jste součástí Katedry.");
            return;
        }

        await getGuild().members.fetch({ withPresences: true })
        const users = (await getGuild().roles.fetch())
            .filter((role) => [RoleIds["Katedra"], RoleIds["Root"]].includes(role.id))
            .map((role) => role.members.map(member => member))
            .reduce((acc, members) => acc.concat(members), [])
            .sort((member) => member.roles.highest.id === RoleIds["Katedra"] ? -1 : 1)
            .map((member) => member.user);

        await replySilent(`Pro přidělení této role kontaktujte jednoho z těchto uživatelů ${users}.`);
    },
);
