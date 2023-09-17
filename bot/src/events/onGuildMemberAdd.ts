import { OnGuildMemberAddAction } from "../types"

/**
 * Function that runs when a new user joins a guild (server) the bot has access to
 * @param args Argument representing the event of a user joining a guild
 */
export const onGuildMemberAdd: OnGuildMemberAddAction = async ({ member }) => {}
