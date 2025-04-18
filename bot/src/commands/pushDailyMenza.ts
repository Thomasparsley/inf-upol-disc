import { SlashCommandBuilder } from "@discordjs/builders"

import { VOC_RequestSended } from "../vocabulary"
import { UnauthorizedError } from "../errors"
import { ChatInputCommand } from "../command"
import { pushDailyMenza } from "../crons"

/**
 * Chat command used for manually pushing the daily menu of menza
 */
export class PushDailyMenzaChatCommnad extends ChatInputCommand {
    name = "pushdailymenza"
    description = "Vynucené přidaní denního menu menza"
    builder = new SlashCommandBuilder()

    async executable(): Promise<void> {
        if (!this.hasOneOfRoles(["Root", "Moderátor"]))
            throw new UnauthorizedError()

        await this.interaction.deferReply({ ephemeral: true })

        await pushDailyMenza(this.client)

        await this.followUpSilent(VOC_RequestSended)
    }
}
