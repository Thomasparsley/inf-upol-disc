import { EventArgs } from '../event';
import { Command } from '../command';

export default new Command(
    'ping',
    'Na každý `ping` odpoví `pong.',
    async ({ interaction }) => {
        await interaction.reply('pong');
    },
) 
