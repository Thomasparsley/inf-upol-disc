import { OnReactionAddAction } from "../types"

export const onReactionAdd: OnReactionAddAction = async ({ reaction, user }) => {
    console.log(`${user.username} použil reakci ${reaction.emoji}!`)
    // TODO
}
