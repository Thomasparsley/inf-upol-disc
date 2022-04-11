import onInteractionCreate from "./events/onInteractionCreate";
import onReady from "./events/onReady";
import onReactionAdd from "./events/onReactionAdd"
import onReactionRemove from "./events/onReactionRemove"
import { Bot } from "./bot";

import {
    validationCommand,
    roleCommand,
    everyRequest,
    commandCmdreg,
    commandRegister,
    commandHost,
    reactionMessage,
    botMessage,
} from "./commands";

const { token, ApplicationID, GuildID  } = require('./token.json');

const bot = new Bot({
    token: token,
    applicationId: ApplicationID,
    // reactionMessages: new Map,
    guildId: GuildID,
    onReady: onReady,
    onReactionAdd: onReactionAdd,
    onReactionRemove: onReactionRemove,
    onInteractionCreate: onInteractionCreate,
    commands: [
        validationCommand,
        roleCommand,
        everyRequest,
        commandCmdreg,
        commandRegister,
        commandHost,
        reactionMessage,
        botMessage,
    ],
});

(async () => {

    await bot.registerSlashCommands(Array.from(bot.commands.values()))
    await bot.login()

})()
