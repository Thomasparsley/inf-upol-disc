import { onReactionAddAction } from "../bot";

const event: onReactionAddAction = async ({ reaction, user }) => {
    console.log(`${user.username} použil reakci ${reaction.emoji}!`);
}

export default event
