import { ButtonStyle } from "discord.js"

/**
 * Helper function that translates a style string to its enum counterpart
 * @param style Style string, which should be translated
 * @returns Instance of ButtonStyle that represents the button style or ButtonStyle.Primary if the style did not match any other styles
 */
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
