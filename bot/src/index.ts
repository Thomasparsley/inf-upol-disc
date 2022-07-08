require('dotenv').config({ path: "../.env" });

import "./string.ext";

import onInteractionCreate from "./events/onInteractionCreate";
import onReactionRemove from "./events/onReactionRemove"
import onReactionAdd from "./events/onReactionAdd"
import onReady from "./events/onReady";

import { DatabaseSource } from "./databaseSource";
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
} = process.env;

(async () => {
    await DatabaseSource.initialize();

    const bot = new Bot(
        TOKEN as string,
        APPLICATION_ID as string,
        GUILD_ID as string,
        DatabaseSource,
        {
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
