import { Event } from "./event";

export default Event(
    'interactionCreate',
    async (args) => {
        const { interaction, commands } = args;

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
                console.error(err)                
            }

            return
        }

        try {
            await command.action(args);
        } catch (err) {
            console.error(err)                
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    },
);
