import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";
import { Result } from "../result";

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
        const cmd = commands.get(cmdname);
        if (!cmd) {
            return Result.err("Příkaz není k dispozici".toError());
        }

        return Result.ok(commandRegistration([cmd]));
    },
);
