import { GuildChannelManager, GuildMemberManager, RoleManager } from "discord.js";

export function replaceTags(
    data: string,
    tagName: string,
    items: string[],
    manager: RoleManager | GuildMemberManager | GuildChannelManager,
): string {
    for (const itemName of items) {
        // Used datatype any due to different managers find methods.
        const item = (manager.cache as any).find((item: { name: string; }) => item.name === itemName);

        if (item)
            data = data.replace(`<${tagName}>${itemName}</${tagName}>`, item.toString());
    }

    return data;
}
