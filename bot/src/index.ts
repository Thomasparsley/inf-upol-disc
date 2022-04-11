import onInteractionCreate from "./events/onInteractionCreate";
import onReady from "./events/onReady";
import { Bot } from "./bot";

import {
    validationCommand,
    roleCommand,
    everyRequest,
    commandCmdreg,
    commandRegister,
    commandHost,
    botMessage,
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
        roleCommand,
        everyRequest,
        commandCmdreg,
        commandRegister,
        commandHost,
        botMessage,
    ],
});

(async () => {

    await bot.registerSlashCommands(Array.from(bot.commands.values()))
    await bot.login()

})()
