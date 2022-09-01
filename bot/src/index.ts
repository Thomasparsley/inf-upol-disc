require("dotenv").config({ path: "../.env" })

import "./string.ext"

import {
    onInteractionCreate,
    onGuildMemberAdd,
    onReactionRemove,
    onReactionAdd,
    onReady,
} from "./events";
import {
    HostFirewallButtonComamand,
    DepartmentFirewallButtonComamand,
    VerificationButtonComamand,
    PhdRoleManagerCommand,
    DepartmentRoleManagerCommand,
    AddRoleDropdownCommand,
    MessageManagerCommand,
    EveryoneRequestCommand,
    QuoteRequestChatCommnad,
    AddRoleOnlyStudentDropdownCommand,
    VerificationModalCommand,
    VerificationCodeButtonComamand,
    VerificationCodeModalCommand,
} from "./commands"

import { DatabaseSource } from "./databaseSource"
import { Mailer } from "./mailer"
import { Bot } from "./bot"


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
        "discord",
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
                PhdRoleManagerCommand,
                DepartmentRoleManagerCommand,
                MessageManagerCommand,
                EveryoneRequestCommand,
                QuoteRequestChatCommnad,
            ],
            buttonCommands: [
                HostFirewallButtonComamand,
                DepartmentFirewallButtonComamand,
                VerificationButtonComamand,
                VerificationCodeButtonComamand,
            ],
            dropdownCommands: [
                AddRoleDropdownCommand,
                AddRoleOnlyStudentDropdownCommand,
            ],
            modalCommands: [
                VerificationModalCommand,
                VerificationCodeModalCommand,
            ]
        })

    await bot.registerChatInputGuildCommands(Array.from(bot.chatInputCommands.values()))
    await bot.login()
})()
