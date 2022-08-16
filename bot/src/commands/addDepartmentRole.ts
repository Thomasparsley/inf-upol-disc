import { SlashCommandBuilder } from "@discordjs/builders";
import { Role, User } from "discord.js";

import { VOC_RoleAdded } from "../vocabulary";
import { UnauthorizedError } from "../errors";
import { ChatInputCommand } from "../command";
import { CD_Katedra as cd} from "../cd";
import { Roles } from "../enums";


export const addDepartmentRoleChatInputCommand = new ChatInputCommand(
	cd.name,
	cd.description,
	new SlashCommandBuilder()
		.addUserOption(option => {
			return option
				.setName(cd.options[0].name)
				.setDescription(cd.options[0].description)
				.setRequired(true);
		}),
	async ({ interaction, replySilent, hasRole }) => {

		const target = (interaction.options.getUser(cd.options[0].name) as User);
		if (!target) 
			throw "katedra#1".toError();
			
        // 
        if (!(hasRole(Roles["Katedra"]) || hasRole(Roles["Root"])))
			throw new UnauthorizedError(); 

        const targetAsMember = interaction.guild?.members.cache.get(target.id);
		if (!targetAsMember)
			throw "katedra#2".toError();
		
		const katedraRole = interaction.guild?.roles.cache.get(Roles["Katedra"]) as Role;
        if (!katedraRole)
            throw "katedra#3".toError();
	
        if (!targetAsMember.roles.cache.has(katedraRole.id)) {
			await targetAsMember.roles.add(katedraRole);
			await replySilent(VOC_RoleAdded(katedraRole));
		} else {
			await replySilent("Tento uživatel roli katedra již má.");
		}
	},
);
