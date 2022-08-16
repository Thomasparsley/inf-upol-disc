import { CacheType, Interaction, NonThreadGuildBasedChannel } from "discord.js";
import { InvalidChannel } from "../errors";
import { getGuild } from "./getGuild";

export function fetchChannelFromGuild(interaction: Interaction<CacheType>) {

    return async function name(id: string): Promise<NonThreadGuildBasedChannel> {
        const guild = getGuild(interaction)();
        const channel = await guild.channels.fetch(id);
        if (!channel)
            throw new InvalidChannel();

        return channel
    }
}
