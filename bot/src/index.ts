import Bot from "./bot";

import onReady from "./events/onReady";
import onInteractionCreate from "./events/onInteractionCreate";

const bot = new Bot({
    token: 'token',
    clientID: 'clientID',
    guildID: 'guildID',
    events: [onReady, onInteractionCreate],
});
