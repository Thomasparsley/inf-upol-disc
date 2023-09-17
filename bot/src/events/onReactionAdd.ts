import { OnReactionAddAction } from "../types"

/**
 * Function that runs when a new reaction is added to a message
 * @param args Argument representing the event of reaction being added
 */
export const onReactionAdd: OnReactionAddAction = async ({ reaction, user }) => {
    console.log(`${user.username} použil reakci ${reaction.emoji}!`)
}
