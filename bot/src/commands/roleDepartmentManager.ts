import { SlashCommandBuilder } from "@discordjs/builders";

import { ChatInputCommand } from "../command";
import { CD_Katedra as cd } from "../cd";


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
    async ({ addRoleToTarget }) => {
        await addRoleToTarget(
            cd.options[0].name,
            "Katedra",
            ["Katedra", "Root"],
        );
	},
);
