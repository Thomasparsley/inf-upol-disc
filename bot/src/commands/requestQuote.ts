import { SlashCommandBuilder } from "@discordjs/builders"
import { TextChannel } from "discord.js"

import { VOC_QuoteRequest, VOC_RequestSended } from "../vocabulary"
import { UnauthorizedError } from "../errors"
import { CD_QuoteRequest as cd } from "../cd"
import { ChatInputCommand } from "../command"

const RequestChannelID = "1009076301019238540"

export class QuoteRequestChatCommnad extends ChatInputCommand {
    name = cd.name
    description = cd.description
    builder = new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(cd.options[0].name)
                .setDescription(cd.options[0].description)
                .setRequired(true)
                .setMaxLength(256)
        })

    async executable(): Promise<void> {
        if (!this.hasAtleastOneRole())
            throw new UnauthorizedError()

        const sender = this.interaction.member
        // const senderRoom = interaction.channel;
        const requestText = this.interaction.options.getString(cd.options[0].name)

        if (!requestText)
            throw "Popisek žádosti nemůže být prázdný.".toError()

        const channel = (this.client.channels.cache.get(RequestChannelID) as TextChannel)
        if (!channel)
            throw "quoteRequest#1".toError()

        await channel.send(VOC_QuoteRequest(sender, requestText))
        await this.replySilent(VOC_RequestSended)
    }
}
