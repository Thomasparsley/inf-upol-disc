import { Event } from "./event";

export default new Event(
    'ready',
    ({ client }) => {
        console.log(`Logged in as ${client.user.tag}!`);
    },
);
