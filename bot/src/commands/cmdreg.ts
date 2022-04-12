import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";

const cmdname = "cmdname";

export const commandCmdreg = new Command(
    "cmdreg",
    "Zaregistruje command, který je součástí S2A2 botu. WIP.",
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(cmdname)
                .setDescription("Jméno příkazu k registraci.")
                .setRequired(true);
        }),
    async ({ commands, commandRegistration }) => {

        const command = commands.get("name of command");

        if (!command) {
            return;
        }

        await commandRegistration([command]);
    },
);
