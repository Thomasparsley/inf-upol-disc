import { Event } from "../event";

export default new Event(
    'ready',
    ({ client }) => {
        if (!client.user) {
            return;
        }

        console.log(`Logged in as ${client.user.tag}!`);
    },
);
