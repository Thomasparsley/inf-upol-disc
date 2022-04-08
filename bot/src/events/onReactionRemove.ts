import { onReactionRemoveAction } from "../bot";

const event: onReactionRemoveAction = async ({ client, reaction, user }) => {
    console.log(`${user} smazal reakci ${reaction}!`);
}

export default event
