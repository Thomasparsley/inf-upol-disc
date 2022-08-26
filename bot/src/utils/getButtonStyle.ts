import { ButtonStyle } from "discord.js"

export function getButtonStyle(style: string): ButtonStyle {
    switch (style) {
    case "Primary":
        return ButtonStyle.Primary

    case "Secondary":
        return ButtonStyle.Secondary

    case "Success":
        return ButtonStyle.Success

    case "Danger":
        return ButtonStyle.Danger

    case "Link":
        return ButtonStyle.Link

    default:
        return ButtonStyle.Primary
    }
}
