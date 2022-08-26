require("dotenv").config({ path: "../.env" })

import "./string.ext"

import onInteractionCreate from "./events/onInteractionCreate"
import onGuildMemberAdd from "./events/onGuildMemberAdd"
import onReactionRemove from "./events/onReactionRemove"
import onReactionAdd from "./events/onReactionAdd"
import onReady from "./events/onReady"

import { DatabaseSource } from "./databaseSource"
import { Bot } from "./bot"

import {
    HostFirewallButtonComamand,
    DepartmentFirewallButtonComamand,
    VerificationFirewallButtonComamand,
    PhdRoleManagerCommand,
    DepartmentRoleManagerCommand,
    AddRoleDropdownCommand
} from "./commands"

import { Mailer } from "./mailer"


const {
    TOKEN,
    APPLICATION_ID,
    GUILD_ID,
    MAILER_HOST,
    MAILER_PORT,
    MAILER_PASS,
    MENZA_API,
} = process.env;

(() => {
    if (!APPLICATION_ID)
        throw "APPLICATION_ID was not provided".toError()

    if (!GUILD_ID)
        throw "GUILD_ID was not provided".toError()

    if (!TOKEN)
        throw "TOKEN was not provided".toError()

    if (!MAILER_HOST)
        throw "Host for mailer was not provided".toError()

    if (!MAILER_PORT)
        throw "Port for mailer was not provided".toError()

    if (!MAILER_PASS)
        throw "Password for mailer was not provided".toError()

    if (!MENZA_API)
        throw "URL for MENZA_API was not provided".toError()
})();

(async () => {
    await DatabaseSource.initialize()
    const mailer = new Mailer(
        MAILER_HOST,
        MAILER_PORT.toInt(),
        "\"Discord Katedry Informatiky\" <discord@inf.upol.cz>",
        false,
        "discord@inf.upol.cz",
        MAILER_PASS,
    )

    const bot = new Bot(
        APPLICATION_ID,
        GUILD_ID,
        TOKEN,
        mailer,
        DatabaseSource,
        {
            onReady: onReady,
            onReactionAdd: onReactionAdd,
            onGuildMemberAdd: onGuildMemberAdd,
            onReactionRemove: onReactionRemove,
            onInteractionCreate: onInteractionCreate,
            chatInputCommands: [
                new PhdRoleManagerCommand(),
                new DepartmentRoleManagerCommand(),
                quoteRequestChatCommnad,
                botMessage,
            ],
            buttonCommands: [
                new HostFirewallButtonComamand(),
                new DepartmentFirewallButtonComamand(),
                new VerificationFirewallButtonComamand(),
            ],
            dropdownCommands: [
                new AddRoleDropdownCommand(),
            ],
            modalCommands: [
                verificationModalCommand,
            ]
        })

    await bot.registerChatInputGuildCommands(Array.from(bot.chatInputCommands.values()))
    await bot.login()
})()
