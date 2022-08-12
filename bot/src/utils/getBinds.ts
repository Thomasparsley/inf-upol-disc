import { Guild, Role } from "discord.js";

export function getBinds(input: string, guild: Guild): Map<String, Role> | null {
    const binds = input.split(",")
    const mapBinds = new Map<String, Role>()

    binds.forEach(bind => {
        const arr = bind.slice(1, -1).split(" ")
        const inputEmote: string = arr[0].trim()
        const inputRole: string = arr[1].trim().replace("@", "")

        const role = guild.roles.cache.find((r: Role) => r.name === inputRole);

        if (!role)
            return null

        mapBinds.set(inputEmote, role)
    })

    return mapBinds
}
