import onInteractionCreate from "./events/onInteractionCreate";
import onReady from "./events/onReady";
import { Bot } from "./bot";

import {
    validationCommand,
    pingCommand,
    helpCommand,
} from './commands'

const bot = new Bot({
    token: "token",
    applicationId: "clientID",
    guildId: "guildID",
    onReady: onReady,
    onInteractionCreate: onInteractionCreate,
    commands: [
        validationCommand,
        pingCommand,
        helpCommand,
    ],
});
