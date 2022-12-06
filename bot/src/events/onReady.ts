import { menzaDailyMaker } from "../crons"
import { OnReadyAction } from "../types"


export const onReady: OnReadyAction = async ({ client }) => {
    if (!client.user) {
        return
    }

    console.log(`Logged in as ${client.user.tag}!`)

    /* const menzaDaily = menzaDailyMaker(client)
    menzaDaily.start() */
}
