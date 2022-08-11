import { SlashCommandBuilder } from "@discordjs/builders";
import { Guild, Role } from "discord.js";

import { VOC_ActionSuccessful } from "../vocabulary";
import { Command } from "../command";
import { CD_RM } from "../cd";
import { BadInputForChatCommandError } from "../errors";

const RequiredOptionMessageID = "message";
const RequiredOptionBinds = "binds";

const cd = CD_RM;
const subAdd = cd.sub.add;
const subRemove = cd.sub.remove;

export const reactionMessage = new Command(
    cd.name,
    cd.description,
    new SlashCommandBuilder()
        .addSubcommand(subcommand => {
            return subcommand
                .setName(subAdd.name)
                .setDescription(subAdd.description)
                .addStringOption(option => {
                    return option
                        .setName(subAdd.options[0].name)
                        .setDescription(subAdd.options[0].description)
                        .setRequired(true);
                })
                .addStringOption(option => {
                    return option
                        .setName(subAdd.options[1].name)
                        .setDescription(subAdd.options[1].description)
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName(subRemove.name)
                .setDescription(subRemove.description)
                .addStringOption(option => {
                    return option
                        .setName(subRemove.options[0].name)
                        .setDescription(subRemove.options[0].name)
                        .setRequired(true);
                })
        }),
    async ({ interaction, replySilent }) => {
        if (!interaction.isChatInputCommand())
            throw new BadInputForChatCommandError();

        if (interaction.options.getSubcommand() === subAdd.name) {
            const guild = interaction.guild
            const channel = interaction.channel;
            const messageID = interaction.options.getString(RequiredOptionMessageID)?.trim();
            const stringMap = interaction.options.getString(RequiredOptionBinds);

            if (channel && messageID && stringMap && guild) {
                const binds = getBinds(stringMap, guild)

                if (!binds) 
                    throw "Byl zadán špatný formát vazeb.".toError();

                const message = await channel.messages.fetch(messageID)
                if (!message) 
                    throw "Musíš být ve stejném kanále jako je zpráva, kterou upravuješ.".toError();

                // Přidat message a vazby do reactionMessages

            } else {
                throw "Error reactionMessage#1".toError();
            }

        } else if (interaction.options.getSubcommand() === subRemove.name) {
            const channel = interaction.channel;
            const messageID = interaction.options.getString(RequiredOptionMessageID)?.trim();

            if (channel && messageID) {

                // Odebrat message z reactionMessages

            } else {
                throw "reactionMessage#2".toError();
            }
        }

        await replySilent(VOC_ActionSuccessful);
    },
);

// TODO: Move outside?
function getBinds(input: string, guild: Guild): Map<String, Role> | null {
    const binds = input.split(",")
    const mapBinds = new Map<String, Role>()

    binds.forEach(bind => {
        const arr = bind.slice(1, -1).split(" ")
        const inputEmote: string = arr[0].trim()
        const inputRole: string = arr[1].trim().replace("@", "")

        const role = guild.roles.cache.find((r: Role) => r.name === inputRole);

        if (!role) 
            return null

        mapBinds.set(inputEmote, role)
    })

    return mapBinds
}
