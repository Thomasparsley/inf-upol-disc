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
            }
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
