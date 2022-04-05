import { Client } from 'discord.js';

import { Command } from "./command";


const onReady = new Command(
    'ready',
    (client: Client) => {
        console.log(`Logged in as ${client.user.tag}!`);
    },
);