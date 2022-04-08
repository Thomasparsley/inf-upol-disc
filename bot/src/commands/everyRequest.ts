import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";

export const everyRequest = new Command(
    "everyreq",
    "Žádost o @overyone. Je možné žádat jednou za 96 hodin. WIP",
    new SlashCommandBuilder(),
    async ({ interaction }) => {
        await interaction.reply("WIP");
    },
);
