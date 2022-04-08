import onInteractionCreate from "./events/onInteractionCreate";
import onReady from "./events/onReady";
import { Bot } from "./bot";

import {
    validationCommand,
    pingCommand,
    helpCommand,
    roleCommand,
    everyRequest,
} from "./commands";

const { token, ApplicationID, GuildID  } = require('./token.json');

const bot = new Bot({
    token: token,
    applicationId: ApplicationID,
    guildId: GuildID,
    onReady: onReady,
    onInteractionCreate: onInteractionCreate,
    commands: [
        validationCommand,
        pingCommand,
        helpCommand,
        roleCommand,
        everyRequest,
    ],
});

(async () => {

    await bot.registerSlashCommands(Array.from(bot.commands.values()))
    await bot.login()

})()
