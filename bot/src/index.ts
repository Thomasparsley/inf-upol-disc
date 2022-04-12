import onInteractionCreate from "./events/onInteractionCreate";
import onReactionRemove from "./events/onReactionRemove"
import onReactionAdd from "./events/onReactionAdd"
import onReady from "./events/onReady";

import { Bot } from "./bot";
import { DatabaseSource } from "./databaseSource";

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

(async () => {

    await DatabaseSource.initialize();

    const bot = new Bot({
        token: TOKEN,
        applicationId: APPLICATION_ID,
        // reactionMessages: new Map,
        guildId: GUILD_ID,
        db: DatabaseSource,
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

    await bot.registerSlashCommands(Array.from(bot.commands.values()));
    await bot.login();

})();
