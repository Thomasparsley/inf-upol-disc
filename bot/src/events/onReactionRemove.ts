import { OnReactionRemoveAction } from "../types"

export const onReactionRemove: OnReactionRemoveAction = async ({ reaction, user }) => {
    console.log(`${user.username} smazal reakci ${reaction.emoji}!`)
}
