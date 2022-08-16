import { CacheType, Interaction } from "discord.js";
import { UnrepliableInteractionError } from "../errors";

export function replySilent(interaction: Interaction<CacheType>) {
    return async function (content: string) {
        if (interaction.isRepliable())
            return await interaction.reply({
                content,
                ephemeral: true,
            });

        throw new UnrepliableInteractionError();
    }
}
