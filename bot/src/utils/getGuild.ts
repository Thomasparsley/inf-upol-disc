import { CacheType, Guild, Interaction } from "discord.js";
import { InvalidGuild } from "../errors";


export function getGuild(interaction: Interaction<CacheType>) {
    return function(): Guild {
        const guild = interaction.guild;
        if (!guild)
            throw new InvalidGuild();

        return guild;
    }
}
