import { menzaDailyMaker } from "../crons"
import { OnReadyAction } from "../types"

/**
 * Function that runs when the Discord client is in the ready state
 * @param args Argument representing the event invocation for {@link OnReadyAction}
 */
export const onReady: OnReadyAction = async ({ client }) => {
    if (!client.user) {
        return
    }

    console.log(`Logged in as ${client.user.tag}!`)

    /* const menzaDaily = menzaDailyMaker(client)
    menzaDaily.start() */
}
