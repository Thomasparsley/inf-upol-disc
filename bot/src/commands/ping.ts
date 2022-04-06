import { Command } from "../command";

export const pingCommand = new Command(
    "ping",
    "Na každý `ping` odpoví `pong`.",
    async ({ interaction }) => {
        await interaction.reply("pong");
    },
);
