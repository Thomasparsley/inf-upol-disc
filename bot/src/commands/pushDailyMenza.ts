import { SlashCommandBuilder } from "@discordjs/builders"

import { VOC_RequestSended } from "../vocabulary"
import { UnauthorizedError } from "../errors"
import { ChatInputCommand } from "../command"
import { pushDailyMenza } from "../crons"


export class PushDailyMenzaChatCommnad extends ChatInputCommand {
    name = "pushdailymenza"
    description = "Vynucené přidaní denního menu menza"
    builder = new SlashCommandBuilder()

    async executable(): Promise<void> {
        if (!this.hasOneOfRoles(["Root", "Moderátor"]))
            throw new UnauthorizedError()

        await pushDailyMenza(this.client)
        await this.replySilent(VOC_RequestSended)
    }
}
