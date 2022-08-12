require('dotenv').config({ path: "../.env" });

import "./string.ext";

import { CronJob } from "cron";

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
import axios from "axios";
import { MenzaDataResponse } from "./interfaces/menza";
import { EmbedBuilder } from "@discordjs/builders";

const {
    TOKEN,
    APPLICATION_ID,
    GUILD_ID,
    MAILER_PASS,
    MENZA_API,
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

    if (!MENZA_API)
        throw "URL for MENZA_API was not provided".toError();
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
            commands: [
                validationCommand,
                roleCommand,
                everyRequest,
                commandRegister,
                commandHost,
                botMessage,
            ],
        });

    const menzaJob = new CronJob(
        "0 0 5 * * MON",
        async function () {
            let dataResponse: MenzaDataResponse | null = null;
            try {
                const { data } = await axios.get(MENZA_API);
                dataResponse = {
                    fromDay: data.from_day,
                    toDay: data.to_day,
                    items: data.items,
                    menu: data.menu,
                }
            } catch (err) {
                console.error(err)
            }

            if (!dataResponse)
                return;

            for (const meal of dataResponse.menu) {
                const specials = meal.special.join(", ")

                // TODO:
                // - Chybí datum ze kterého dne jídlo je staženo.

                // https://discordjs.guide/popular-topics/embeds.html#embed-preview
                const embededMeal = new EmbedBuilder()
                    .setTitle(meal.name)
                    .setAuthor({ name: "Menza 17. Listopadu" })
                    .addFields(
                        { name: "Kategorie", value: meal.category },
                        { name: "Počet", value: `${meal.count}ks`, inline: true },
                        { name: "Cena", value: `${meal.price}kč`, inline: true },
                        { name: "", value: specials, inline: true },
                    )
            }
        },
        null,
        true,
        "Europe/Prague"
    )
    menzaJob.start()

    await bot.registerSlashGuildCommands(Array.from(bot.commands.values()));
    await bot.login();
})();
