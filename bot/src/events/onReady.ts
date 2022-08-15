import { OnReadyAction } from "../types";

const event: OnReadyAction = async ({ client }) => {
    if (!client.user) {
        return;
    }

    console.log(`Logged in as ${client.user.tag}!`);
}

export default event
