import { CacheType, Interaction } from "discord.js";
import { UnrepliableInteractionError } from "../errors";

export function reply(interaction: Interaction<CacheType>) {
    return async function (content: string) {
        if (interaction.isRepliable())
            return await interaction.reply({
                content,
            });

        throw new UnrepliableInteractionError();
    }
}
