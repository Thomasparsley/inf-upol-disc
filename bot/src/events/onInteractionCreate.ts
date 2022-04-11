import { GuildMemberRoleManager } from "discord.js";
import { OnInteractionCreateAction } from "../bot";
import { CommandArgs } from "../command";

const event: OnInteractionCreateAction = async (args) => {
    const { client, interaction, commands, commandRegistration } = args;

    if (!interaction.isCommand()) {
        return;
    }

    const command = commands.get(interaction.commandName);

    const reply = async (content: string): Promise<void> => {
        return await interaction.reply({
            content,
        });
    }

    const replySilent = async (content: string): Promise<void> => {
        return await interaction.reply({
            content,
            ephemeral: true,
        });
    }

    try {
        if (!command) {
            await replySilent("Neznámý příkaz!");
            return;
        }

        const commandArgs: CommandArgs = {
            client,
            interaction,
            commands,
            commandRegistration,
            reply,
            replySilent,
            permissionRolesCount: async (predicate: Function): Promise<Boolean> => {
                const roles = (interaction.member?.roles as GuildMemberRoleManager)
                if (!roles) {
                    await interaction.reply({
                        content: "Error: permissionRolesCount#1",
                        ephemeral: true,
                    });

                    return false;
                }

                return predicate(roles.cache.size);
            },
            permissionRole: async (roleID: string): Promise<Boolean> => {
                const roles = (interaction.member?.roles as GuildMemberRoleManager)
                if (!roles) {
                    await interaction.reply({
                        content: "Error: permissionRole#1",
                        ephemeral: true,
                    });

                    return false;
                }

                if (!roles.cache.has(roleID)) {
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
        await replySilent("There was an error while executing this command!");
    }
}

export default event
