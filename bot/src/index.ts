import onInteractionCreate from "./events/onInteractionCreate";
import onReady from "./events/onReady";
import onReactionAdd from "./events/onReactionAdd"
import onReactionRemove from "./events/onReactionRemove"
import { Bot } from "./bot";

import {
    validationCommand,
    roleCommand,
    everyRequest,
    commandRegister,
    commandHost,
    botMessage,
} from "./commands";

const {
    TOKEN,
    APPLICATION_ID,
    GUILD_ID,
} = require('../../.env');

const bot = new Bot({
    token: TOKEN,
    applicationId: APPLICATION_ID,
    // reactionMessages: new Map,
    guildId: GUILD_ID,
    onReady: onReady,
    onReactionAdd: onReactionAdd,
    onReactionRemove: onReactionRemove,
    onInteractionCreate: onInteractionCreate,
    commands: [
        validationCommand,
        roleCommand,
        everyRequest,
        commandRegister,
        commandHost,
        botMessage,
    ],
});

(async () => {

    await bot.registerSlashCommands(Array.from(bot.commands.values()));
    await bot.login();

})();
