import { SlashCommandBuilder } from "@discordjs/builders";

import { Command } from "../command";

const RequiredOptionMessageID = "message";
const RequiredOptionText = "text";
const SubCommandAdd = "add";
const SubCommandEdit = "edit";

export const botMessage = new Command(
    "botmessage",
    "Pošle nebo upraví zprávu pomocí bota.",
    new SlashCommandBuilder()
        .addSubcommand(subcommand => {
            return subcommand
                .setName(SubCommandAdd)
                .setDescription('Pošle zprávu pomocí bota.')
                .addStringOption(option => {
                    return option
                        .setName(RequiredOptionText)
                        .setDescription("Text zprávy.")
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName(SubCommandEdit)
                .setDescription('Upraví zprávu pomocí bota.')
                .addStringOption(option => {
                    return option
                        .setName(RequiredOptionMessageID)
                        .setDescription("ID zprávy, kterou chceš smazat.")
                        .setRequired(true);
                })
                .addStringOption(option => {
                    return option
                        .setName(RequiredOptionText)
                        .setDescription("Nový text zprávy.")
                        .setRequired(true);
                })
            }),
    async ({ client, interaction, replySilent }) => { 

        if (interaction.options.getSubcommand() === SubCommandAdd) {
            const channel = interaction.channel
            const text = interaction.options.getString(RequiredOptionText)

            if (channel && text) {
                channel.send(text);
            } else {
                replySilent("Error botmessage#1")
            }

        } else if (interaction.options.getSubcommand() === SubCommandEdit) { 
            const channel = interaction.channel
            const messageID = interaction.options.getString(RequiredOptionMessageID)?.trim()
            const text = interaction.options.getString(RequiredOptionText)
            
            if (channel && messageID && text) {
                const message = await channel.messages.fetch(messageID)
                
                if (message) {
                    message.edit(text)
                } else {
                    replySilent("Error botmessage#2")
                }

            } else {
                replySilent("Error botmessage#3")
            }
        }
        
        replySilent("Akce byla provedena.")
    },
);
