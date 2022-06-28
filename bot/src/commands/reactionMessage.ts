import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Emoji, Guild, Message, Role } from "discord.js";

import { Command } from "../command";

const RequiredOptionMessageID = "message";
const RequiredOptionBinds = "binds";

const SubCommandAdd = "add";
const SubCommandRemove = "remove";
const SubCommandEdit = "edit";

function getBinds (input: string, guild: Guild):Map<String, Role> | null {
    const binds = input.split(",")
    const mapBinds = new Map<String, Role>()

    binds.forEach(bind => {
        const arr = bind.slice(1, -1).split(" ")
        const inputEmote:string = arr[0].trim()
        const inputRole:string = arr[1].trim().replace("@", "")

        const role = guild.roles.cache.find(r => r.name === inputRole);

        if (!role) return null

        mapBinds.set(inputEmote, role)
    })

    return mapBinds
}

export const reactionMessage = new Command(
    "rm",
    "Správa přidělování reakcí na zprávu.",
    new SlashCommandBuilder()
        .addSubcommand(subcommand => {
            return subcommand
                .setName(SubCommandAdd)
                .setDescription("Navaž přidělování reakcí na zprávu.")
                .addStringOption(option => {
                    return option
                        .setName(RequiredOptionMessageID)
                        .setDescription("ID zprávy, kterou chceš smazat.")
                        .setRequired(true);
                })
                .addStringOption(option => {
                    return option
                        .setName(RequiredOptionBinds)
                        .setDescription("Formát: (emote role),(emote role)")
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName(SubCommandRemove)
                .setDescription("Smaž přiřazování reakcí navázané na zprávu.")
                .addStringOption(option => {
                    return option
                        .setName(RequiredOptionMessageID)
                        .setDescription("ID zprávy, kterou chceš smazat.")
                        .setRequired(true);
                })
            }),
    async ({ client, interaction, replySilent }) => { 

        if (interaction.options.getSubcommand() === SubCommandAdd) {
            const guild = interaction.guild
            const channel = interaction.channel;
            const messageID = interaction.options.getString(RequiredOptionMessageID)?.trim();
            const stringMap = interaction.options.getString(RequiredOptionBinds);

            if (channel && messageID && stringMap && guild) {
                  const binds = getBinds(stringMap, guild)

                  if (!binds) {
                      replySilent("Byl zadán špatný formát vazeb.") // TODO: Move to error

                    return
                  } 

                  const message = await channel.messages.fetch(messageID)

                  if (!message) {
                      replySilent("Musíš být ve stejném kanále jako je zpráva, kterou upravuješ.") // TODO: Move to error
  
                      return
                  }

                  // Přidat message a vazby do reactionMessages
                  
            } else {
                replySilent("Error reactionMessage#1") // TODO: Move to error

                return
            }

        } else if (interaction.options.getSubcommand() === SubCommandRemove) { 
            const channel = interaction.channel;
            const messageID = interaction.options.getString(RequiredOptionMessageID)?.trim();

            if (channel && messageID) {
                
                // Odebrat message z reactionMessages

            } else {
                replySilent("Error reactionMessage#2") // TODO: Move to error

                return
            }
        }
        
        replySilent("Akce byla provedena.")
    },
);
