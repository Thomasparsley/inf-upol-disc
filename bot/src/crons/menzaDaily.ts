import axios from "axios"
import { CronJob } from "cron"
import { Client } from "discord.js";

import { MenzaDataResponse } from "../interfaces"

const {
    MENZA_API,
} = process.env;

export function menzaDailyMaker(client: Client) {
    return new CronJob(
        "0 0 5 * * MON-FRI",
        async function () {
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

            let message = "**Menza 17. Listopadu**\n"
            for (const meal of dataResponse.menu) {
                message += ` - ${meal.name}\n`
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
        },
        null,
        true,
        "Europe/Prague"
    )
}
