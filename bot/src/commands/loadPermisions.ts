import { SlashCommandBuilder } from "@discordjs/builders"
import { PermissionsBitField } from "discord.js"
import axios from "axios"

import { ChatInputCommand } from "../command"
import { isHttpUrlWithFileExt } from "../utils"
import { InvalidURLError, UnauthorizedError } from "../errors"

const AdminAllowPermissionsBitField = [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.ManageChannels,
    PermissionsBitField.Flags.ManageRoles,
    PermissionsBitField.Flags.ManageWebhooks,

    PermissionsBitField.Flags.CreateInstantInvite,

    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.SendMessagesInThreads,
    PermissionsBitField.Flags.CreatePublicThreads,
    PermissionsBitField.Flags.CreatePrivateThreads,
    PermissionsBitField.Flags.EmbedLinks,
    PermissionsBitField.Flags.AttachFiles,
    PermissionsBitField.Flags.AddReactions,
    PermissionsBitField.Flags.ManageMessages,
    PermissionsBitField.Flags.ManageThreads,
    PermissionsBitField.Flags.ReadMessageHistory,
    PermissionsBitField.Flags.SendTTSMessages,
    PermissionsBitField.Flags.UseApplicationCommands,
]

const ModeratorAllowPermissionsBitField = [
    PermissionsBitField.Flags.ViewChannel,

    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.SendMessagesInThreads,
    PermissionsBitField.Flags.CreatePublicThreads,
    PermissionsBitField.Flags.CreatePrivateThreads,
    PermissionsBitField.Flags.EmbedLinks,
    PermissionsBitField.Flags.AttachFiles,
    PermissionsBitField.Flags.AddReactions,
    PermissionsBitField.Flags.ManageMessages,
    PermissionsBitField.Flags.ManageThreads,
    PermissionsBitField.Flags.ReadMessageHistory,
    PermissionsBitField.Flags.SendTTSMessages,
    PermissionsBitField.Flags.UseApplicationCommands,
]

const BasicAllowPermissionsBitField = [
    PermissionsBitField.Flags.ViewChannel,

    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.SendMessagesInThreads,
    PermissionsBitField.Flags.CreatePublicThreads,
    PermissionsBitField.Flags.EmbedLinks,
    PermissionsBitField.Flags.AttachFiles,
    PermissionsBitField.Flags.AddReactions,
    PermissionsBitField.Flags.ReadMessageHistory,
    PermissionsBitField.Flags.SendTTSMessages,
    PermissionsBitField.Flags.UseApplicationCommands,
]


export class LoadPermisionsChatCommnad extends ChatInputCommand {
    name = "cd.name"
    description = "cd.description"
    builder = new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName("url")
                .setDescription("Odkaz k načtení práv")
                .setRequired(true)
        })

    async executable(): Promise<void> {
        if (!this.hasRole("Root"))
            throw new UnauthorizedError()

        const urlForFile = this.interaction.options
            .getString("url")

        if (!urlForFile || !isHttpUrlWithFileExt(urlForFile, ["json"]))
            throw new InvalidURLError()


        let data: any | undefined
        try {
            const response = await axios.get(urlForFile)
            data = response.data
        } catch (err) {
            throw `Error: LoadPermisionsChatCommnad#1: ${err}`.toError()
        }
        if (!data) {
            throw `Error: LoadPermisionsChatCommnad#2`.toError()
        }

        await this.replySilent("Práva úspěšně načtena, začínají se zpracovávat.")
        await this.proccesPermisions(data.roles)
    }

    async proccesPermisions(permissions: any): Promise<void> {
        const guild = await this.client.guilds.fetch("960452395312234536")
        const channels = await guild.channels.fetch()
        const roles = await guild.roles.fetch()


        console.log(roles)

        for (const permission of permissions) {
            const role = roles.get(permission.id)
            if (!role) {
                continue
            }

            let allowPermissions: bigint[] = []
            if (permission.isAdmin) {
                allowPermissions = AdminAllowPermissionsBitField
            } else if (permission.isModerator) {
                allowPermissions = ModeratorAllowPermissionsBitField
            } else {
                allowPermissions = BasicAllowPermissionsBitField
            }


            const channelsIdToExclude = (permission.exclude as any[]).map(value => value.id)
            const channelsIdToInclude = (permission.include as any[]).map(value => value.id)
            const channelsToEdit = channels.filter(channel => {
                let add = true

                if (channelsIdToExclude.includes(channel.id)) {
                    add = false
                }
                if (channelsIdToInclude.includes(channel.id)) {
                    add = true
                }

                return add
            })

            for (const channelToEdit of channelsToEdit.values()) {
                channelToEdit.permissionOverwrites.set([
                    {
                        id: role.id,
                        allow: allowPermissions,
                    }
                ])
            }
        }
    }
}
