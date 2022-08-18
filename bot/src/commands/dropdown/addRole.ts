import { GuildMemberRoleManager } from "discord.js";
import { DropdownCommand } from "../../command";


export const addRoleDropdownCommand = new DropdownCommand(
    "dropdownAddRole",
    "Přidá nebo odebere role",
    async ({ client, interaction, replySilent, flag }) => {
        const guild = await client.guilds.fetch("960452395312234536");
        
        const roles = interaction.values;
        for (const roleNameRaw of roles) {
            let roleName: string;
            if (flag && ["predmety_0n", "predmety_pz"].includes(flag))
                roleName = roleNameRaw.split(" ")[0];
            else
                roleName = roleNameRaw;

            const role = guild.roles.cache.find(r => r.name === roleName);
            if (!role)
                throw `${roleName} role neexistuje `.toError();

            const roles = (interaction.member?.roles as GuildMemberRoleManager);
            if (!roles.cache.has(role.id))
                await roles.add(role.id);
            else
                await roles.remove(role.id);
        }

        await replySilent("Vybrané role Vám byly přidělěny.");
    }
);
