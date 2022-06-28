import { CacheType, CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { OnInteractionCreateAction } from "../bot";
import { CommandArgs } from "../command";
import { VOC_HasNotPermission } from "../vocabulary";

function reply(interaction: CommandInteraction<CacheType>) {
    return async function (content: string): Promise<void> {
        return await interaction.reply({
            content,
        });
    }
}

function replySilent(interaction: CommandInteraction<CacheType>) {
    return async function (content: string): Promise<void> {
        return await interaction.reply({
            content,
            ephemeral: true,
        });
    }
}

const event: OnInteractionCreateAction = async (args) => {
    const { client, interaction, commands, db, commandRegistration } = args;

    if (!interaction.isCommand()) {
        return;
    }

    const command = commands.get(interaction.commandName);

    try {
        if (!command) {
            await replySilent("Neznámý příkaz!"); // TODO: Move to error
            return;
        }

        const commandArgs: CommandArgs = {
            client,
            interaction,
            commands,
            db,
            commandRegistration,
            reply: reply(interaction),
            replySilent: replySilent(interaction),
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

                return roles.cache.has(roleID);
            },
        }

        await command.execute(commandArgs);

    } catch (err) {
        console.error(err);
        await replySilent("Nastala chyba při vykonávání příkazu!"); // TODO: Move to error
    }
}

export default event
