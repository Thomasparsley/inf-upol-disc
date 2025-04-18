import axios from "axios"
import { CronJob } from "cron"
import { Client } from "discord.js";

import { MenzaDataResponse, MenzaMeal } from "../interfaces"

const {
    MENZA_API,
} = process.env;

const categoriesTitles: { [key: string]: string } = {
    "Polévky, saláty": "**Polévky**  :ramen:",
    "Hotovky": "**Hotovky**  :curry:",
    "Minutky": "**Minutky**  :hamburger:",
    "Pizza": "**Pizza**  :pizza:",
}

/**
 * Function which pushes daily menza to the menza Discord channel
 * @param client Discord client that shuold be used to send the daily menza message
 * @returns Promise representing completion of the function
 */
export async function pushDailyMenza(client: Client) {
    let dataResponse: MenzaDataResponse | undefined = undefined
    try {
        const { data } = await axios.get(MENZA_API as string)
        dataResponse = {
            menu: data.menu,
        }
    } catch (err) {
        console.error(err)
    }
    if (!dataResponse) {
        return
    }

    const mealsByCategories: { [key: string]: MenzaMeal[] } = {}
    for (const meal of dataResponse.menu) {
        if (!(meal.category in mealsByCategories)) {
            mealsByCategories[meal.category] = []
        }

        mealsByCategories[meal.category].push(meal)
    }

    let message = ""
    for (const category in mealsByCategories) {
        message += `${categoriesTitles[category]}\n`

        for (const meal of mealsByCategories[category]) {
            let mealName: string = meal.name.replace("PIZZA ", "")
            message += `> • ${mealName}\n`
        }

        message += '\n'
    }

    const menzaChannelID = "1008760191594016829"
    const guild = client.guilds.cache.get("960452395312234536")
    const menzaChannel = await guild?.channels.fetch(menzaChannelID)
    if (menzaChannel) {
        if (menzaChannel.isTextBased()) {
            await menzaChannel.send(message)
        } else {
            console.log("Error while fetching menza data.")
        }
    }
}

/**
 * Creates a new CronJob that will automatically push daily menza
 * @param client Discord client used in the {@link pushDailyMenza} function
 * @returns CronJob instance that runs the daily menza function
 */
export function menzaDailyMaker(client: Client) {
    return new CronJob(
        "0 0 5 * * MON-FRI",
        async function () {
            await pushDailyMenza(client)
        },
        null,
        true,
        "Europe/Prague"
    )
}
