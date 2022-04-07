import onInteractionCreate from "./events/onInteractionCreate";
import onReady from "./events/onReady";
import { Bot } from "./bot";

import {
    validationCommand,
    pingCommand,
    helpCommand,
    roleCommand,
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
    ],
});

(async () => {

    // await bot.registerSlashCommands(Array.from(bot.commands.values()))
    await bot.login()

})()

// TypeError: Method Map.prototype.has called on incompatible receiver undefined
//     at has (<anonymous>)
//     at /Users/hradzpisku/Documents/GitHub/inf-upol-disc/bot/src/commands/role.ts:31:14
//     at Generator.next (<anonymous>)
//     at /Users/hradzpisku/Documents/GitHub/inf-upol-disc/bot/src/commands/role.ts:8:71
//     at new Promise (<anonymous>)
//     at __awaiter (/Users/hradzpisku/Documents/GitHub/inf-upol-disc/bot/src/commands/role.ts:4:12)
//     at Command.execute (/Users/hradzpisku/Documents/GitHub/inf-upol-disc/bot/src/commands/role.ts:19:31)
//     at /Users/hradzpisku/Documents/GitHub/inf-upol-disc/bot/src/events/onInteractionCreate.ts:33:23
//     at Generator.next (<anonymous>)
//     at /Users/hradzpisku/Documents/GitHub/inf-upol-disc/bot/src/events/onInteractionCreate.ts:8:71