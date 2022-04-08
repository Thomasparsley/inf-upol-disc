import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { OnInteractionCreateAction } from "../bot";
import { CommandArgs } from "../command";

const event: OnInteractionCreateAction = async (args) => {
    const { client, interaction, commands } = args;
    
    if (!interaction.isCommand()) {
        return;
    }

    const command = commands.get(interaction.commandName);

    if (!command) {
        try {
            await interaction.reply({
                content: 'Neznámý příkaz!',
                ephemeral: true,
            });
        } catch (err) {
            console.error(err);
        }

        return
    }

    try {
        const commandArgs: CommandArgs = {
            client,
            interaction,
            commands,
            reply: async (content: string): Promise<void> => {
                return await interaction.reply({
                    content,
                });
            },
            replySilent: async (content: string): Promise<void> => {
                return await interaction.reply({
                    content,
                    ephemeral: true,
                });
            },
            permissionRolesCount: async (interaction: CommandInteraction, predicate: Function): Promise<Boolean> => {
                const roles = (interaction.member?.roles as GuildMemberRoleManager)
                if (!roles) {
                    await interaction.reply({
                        content: "Error: permissionRolesCount#1",
                        ephemeral: true,
                    });
        
                    return false;
                } else if (predicate(roles.cache.size)) {
                    await interaction.reply({
                        content: "Nemáš oprávnění pro tento příkaz!",
                        ephemeral: true,
                    });
                    
                    return false;
                }

                return true
            },
        }

        await command.execute(commandArgs);
    } catch (err) {
        console.error(err);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
}

export default event
