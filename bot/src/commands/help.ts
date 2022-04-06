import { Command } from "../command";

export const helpCommand = new Command(
    "help",
    "Na každý `help` odpoví `pong`.",
    async ({ interaction }) => {
        await interaction.reply("pong");
    },
);
