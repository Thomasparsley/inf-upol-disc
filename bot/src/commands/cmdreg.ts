import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";

export const commandCmdreg = new Command(
    "cmdreg",
    "Zaregistruje command, který je součástí S2A2 botu. WIP.",
    new SlashCommandBuilder(),
    async ({ interaction }) => {
        
    },
);
