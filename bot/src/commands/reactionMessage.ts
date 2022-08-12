import { SlashCommandBuilder } from "@discordjs/builders";

import { BadInputForChatCommandError } from "../errors";
import { VOC_ActionSuccessful } from "../vocabulary";
import { getBinds } from "../utils";
import { Command } from "../command";
import { CD_RM as cd} from "../cd";

const RequiredOptionMessageID = "message";
const RequiredOptionBinds = "binds";

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
