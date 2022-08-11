require('dotenv').config({ path: "../.env" });

import "./string.ext";

import onInteractionCreate from "./events/onInteractionCreate";
import onGuildMemberAdd from "./events/onGuildMemberAdd";
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
import { Mailer } from "./mailer";

const {
    TOKEN,
    APPLICATION_ID,
    GUILD_ID,
    MAILER_PASS,
} = process.env;

(async () => {
    if (!MAILER_PASS) {
        throw ""; // TODO:
    }

    await DatabaseSource.initialize();
    const mailer = new Mailer(
        "mail.inf.upol.cz",
        465,
        `"Discord Katedry Informatiky" <discord@inf.upol.cz>`,
        true,
        "discord@inf.upol.cz",
        MAILER_PASS,
    );

    const bot = new Bot(
        APPLICATION_ID as string,
        GUILD_ID as string,
        TOKEN as string,
        mailer,
        DatabaseSource,
        {
            onReady: onReady,
            onReactionAdd: onReactionAdd,
            onGuildMemberAdd: onGuildMemberAdd,
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

    await bot.registerSlashGuildCommands(Array.from(bot.commands.values()));
    await bot.login();

})();
