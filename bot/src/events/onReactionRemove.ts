import { OnReactionRemoveAction } from "../types"

/**
 * Function that runs when a reaction is removed from a message
 * @param args Argument representing the event of reaction being removed
 */
export const onReactionRemove: OnReactionRemoveAction = async ({ reaction, user }) => {
    console.log(`${user.username} smazal reakci ${reaction.emoji}!`)
}
