import { SlashCommandBuilder } from "@discordjs/builders";

import { UnknownCommandError } from "../errors";
import { ChatInputCommand } from "../command";
import { CD_Cmdreg as cd } from "../cd";

//  TODO: WIP
export const commandCmdreg = new ChatInputCommand(
    cd.name,
    cd.description,
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(cd.options[0].name)
                .setDescription(cd.options[0].description)
                .setRequired(true);
        }),
    async ({ commands, commandRegistration }) => {
        const cmd = commands.get(cd.options[0].name);

        if (!cmd)
            throw new UnknownCommandError();

        await commandRegistration([cmd]);
    },
);
