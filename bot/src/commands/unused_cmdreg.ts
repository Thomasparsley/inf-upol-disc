/* import { SlashCommandBuilder } from "@discordjs/builders";

import { UnknownCommandError } from "../errors";
import { ChatInputCommand } from "../command";
import { CD_Cmdreg as cd } from "../cd";

export class RegistrationCommand extends ChatInputCommand {
    name = cd.name;
    description = cd.description;
    builder = new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(cd.options[0].name)
                .setDescription(cd.options[0].description)
                .setRequired(true);
        });

    async executable() {
        const cmd = chatInputCommands.get(cd.options[0].name);

        if (!cmd)
            throw new UnknownCommandError();

        await this.commandRegistration([cmd]);
    }
} */
