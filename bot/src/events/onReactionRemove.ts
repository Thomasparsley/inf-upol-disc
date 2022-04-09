import { onReactionRemoveAction } from "../bot";

const event: onReactionRemoveAction = async ({ reaction, user }) => {
    console.log(`${user.username} smazal reakci ${reaction.emoji}!`);
}

export default event
