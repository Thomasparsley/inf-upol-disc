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
    roleCommand,
    everyRequest,
    addDepartmentRoleChatInputCommand,
    botMessage,
    verificationFirewallButtonComamand,
    hostFirewallButtonComamand,
    departmentFirewallButtonComamand,
    addRoleDropdownCommand,
    verificationModalCommand
} from "./commands";

import { Mailer } from "./mailer";

const {
    TOKEN,
    APPLICATION_ID,
    GUILD_ID,
    MAILER_PASS,
} = process.env;


(() => {
    if (!APPLICATION_ID)
        throw "APPLICATION_ID was not provided".toError();

    if (!GUILD_ID)
        throw "GUILD_ID was not provided".toError();

    if (!TOKEN)
        throw "TOKEN was not provided".toError();

    if (!MAILER_PASS)
        throw "Password for mailer was not provided".toError();

})();

(async () => {
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
            chatInputCommands: [
                roleCommand,
                everyRequest,
                botMessage,
                addDepartmentRoleChatInputCommand,
            ],
            buttonCommands: [
                hostFirewallButtonComamand,
                verificationFirewallButtonComamand,
                departmentFirewallButtonComamand,
            ],
            dropdownCommands: [
                addRoleDropdownCommand,
            ],
            modalCommands: [
                verificationModalCommand,
            ]
        });

    await bot.registerChatInputGuildCommands(Array.from(bot.chatInputCommands.values()));
    await bot.login();
})();
