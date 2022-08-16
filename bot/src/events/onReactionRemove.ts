import { onReactionRemoveAction } from "../types";

const event: onReactionRemoveAction = async ({ reaction, user }) => {
    console.log(`${user.username} smazal reakci ${reaction.emoji}!`);
}

export default event
