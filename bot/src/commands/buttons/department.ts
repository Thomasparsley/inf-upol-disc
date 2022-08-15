import { ButtonCommand } from "../../command";
import { Roles } from "../../enums";

export const departmentFirewallButtonComamand = new ButtonCommand(
    "bntDepartment",
    "cd.description",
    async ({ replySilent, hasRole, client }) => {

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

        const guild = await client.guilds.fetch("960452395312234536");
        const katedraRole = await guild.roles.fetch(Roles["Katedra"]);
        const rootRole = await guild.roles.fetch(Roles["Root"]);

        if (!katedraRole || !rootRole) {
            return; // TODO:
        }

        const katedraUsers = katedraRole.members.map(member => member.user.tag);
        const rootUsers = rootRole.members.map(member => member.user.tag);
        const users = [...katedraUsers, ...rootUsers];

        await replySilent(`Děkujeme že máte zájem se stát součástí @Katedry, prosím kontaktuje někoho z ${users}.`);
    },
);
