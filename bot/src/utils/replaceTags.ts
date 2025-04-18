import { GuildChannelManager, GuildMemberManager, RoleManager } from "discord.js"

/**
 * Function to replace tags in the given document
 * @param data Data in which tags should be replaced
 * @param tagName Name of the tag
 * @param items Items that should be replaced
 * @param manager Manager which should be used for replacement
 * @returns Modified document with the tags replaced
 */
export function replaceTags(
    data: string,
    tagName: string,
    items: string[],
    manager: RoleManager | GuildMemberManager | GuildChannelManager,
): string {
    for (const itemName of items) {
        // Used datatype any due to different managers find methods.
        const item = (manager.cache as any).find((item: { name: string; }) => item.name === itemName)

        if (item)
            data = data.replace(`<${tagName}>${itemName}</${tagName}>`, item.toString())
    }

    return data
}
