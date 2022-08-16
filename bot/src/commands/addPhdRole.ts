import { SlashCommandBuilder } from "@discordjs/builders";
import { Role, User } from "discord.js";

import { VOC_RoleAdded } from "../vocabulary";
import { UnauthorizedError } from "../errors";
import { ChatInputCommand } from "../command";
import { CD_PhD as cd } from "../cd";
import { Roles } from "../enums";


export const addPhdRoleChatInputCommand = new ChatInputCommand(
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
			throw "addphd#1".toError();
			
        // 
        if (!(hasRole(Roles["Katedra"]) || hasRole(Roles["PhD."])))
			throw new UnauthorizedError(); 

        const targetAsMember = interaction.guild?.members.cache.get(target.id);
		if (!targetAsMember)
            throw "addphd#2".toError();
		
        const phdRole = interaction.guild?.roles.cache.get(Roles["PhD."]) as Role;
        if (!phdRole)
            throw "addphd#3".toError();
	
        if (!targetAsMember.roles.cache.has(phdRole.id)) {
			await targetAsMember.roles.add(phdRole);
			await replySilent(VOC_RoleAdded(phdRole));
		} else {
            await replySilent(`Tento uživatel roli ${phdRole} již má.`);
		}
	},
);
