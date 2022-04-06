import { Command } from "../command";

export const validationCommand = new Command(
    "validation",
    "Na každý `validation` odpoví `pong`.",
    async ({ interaction }) => {
        await interaction.reply("pong");
    },
);
