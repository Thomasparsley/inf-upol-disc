import { SlashCommandBuilder } from "@discordjs/builders"
import { TextChannel } from "discord.js"

import { VOC_EveryRequest, VOC_RequestSended } from "../vocabulary"
import { UnauthorizedError } from "../errors"
import { CD_EveryRequest as cd } from "../cd"
import { ChatInputCommand } from "../command"

const RequestChannelID = "961981948740386826"

export class EveryoneRequestCommand extends ChatInputCommand {
    name = cd.name
    description = cd.description
    builder = new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(cd.options[0].name)
                .setDescription(cd.options[0].description)
                .setRequired(true)
        }).toJSON()

    async executable(): Promise<void> {
        if (!this.hasAtleastOneRole())
            throw new UnauthorizedError()

        const sender = this.interaction.member
        const senderRoom = this.interaction.channel
        const requestText = this.interaction.options.getString(cd.options[0].name)

        if (!requestText)
            throw "Popisek žádosti nemůže být prázdný.".toError()

        const channel = (this.client.channels.cache.get(RequestChannelID) as TextChannel)
        if (!channel)
            throw "everyoneRequest#1".toError()

        await channel.send(VOC_EveryRequest(sender, senderRoom, requestText))
        await this.replySilent(VOC_RequestSended)
    }
}
