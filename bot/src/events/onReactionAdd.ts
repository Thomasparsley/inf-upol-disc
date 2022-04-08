import { onReactionAddAction } from "../bot";

const event: onReactionAddAction = async ({ client, reaction, user }) => {
    console.log(`${user} použil reakci ${reaction}!`);
}

export default event
