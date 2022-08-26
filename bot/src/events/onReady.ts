import axios from "axios";
import { OnReadyAction } from "../types";
import { MenzaDataResponse, MenzaMeal } from "../interfaces";
import { CronJob } from "cron";

const event: OnReadyAction = async ({ client }) => {
    if (!client.user) {
        return;
    }

    console.log(`Logged in as ${client.user.tag}!`);

    const menzaJob = new CronJob(
        "0 0 5 * * MON-FRI",
        async function () {
            let dataResponse: MenzaDataResponse | null = null;
            try {
                const { data } = await axios.get("http://localhost:8000/");
                dataResponse = {
                    menu: data.menu,
                }
            } catch (err) {
                console.error(err)
            }
            if (!dataResponse)
                return;

            let message = `**Menza 17. Listopadu**\n`;
            for (const meal of dataResponse.menu) {
                message += ` - ${meal.name}\n`;
            }

            const menzaChannelID = "1008760191594016829";
            const guild = client.guilds.cache.get("960452395312234536");
            const menzaChannel = await guild?.channels.fetch(menzaChannelID);
            if (menzaChannel)
                if (menzaChannel.isTextBased())
                    await menzaChannel.send(message);
                else
                    console.log("Error while fetching menza data.");
        },
        null,
        true,
        "Europe/Prague"
    )
    menzaJob.start()
}

export default event
