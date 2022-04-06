import { Routes } from 'discord-api-types/v9';
import { Client, Intents } from "discord.js";
import { REST } from "@discordjs/rest";

import { buildSlashCommand, Command } from "./command";
import { Event, EventArgs } from "./event";

const REST_VERSION = '9';

interface BotConfig {
    token: string;
    applicationId: string;
    guildId: string;
    events?: Event[];
    commands?: Command[]
}

export default class Bot {
    client: Client;
    rest: REST;
    commands: Map<string, Command>;
    private applicationId: string;
    private guildId: string;
    private token: string;
    
    constructor(config: BotConfig) {
        this.commands = new Map<string, Command>();
        this.applicationId = config.applicationId;
        this.guildId = config.guildId;
        this.token = config.token;

        this.client = new Client({
            intents: [Intents.FLAGS.GUILDS],
        });

        this.rest = new REST({ version: REST_VERSION })
            .setToken(this.token);

        if (config.events) {
            this.initEvents(config.events);
        }

        if (config.commands) {
            this.initCommands(config.commands);
        }
    }

    private initEvents(events: Event[]) {
        events.forEach((event) => {
            this.client.on(event.getName(), async (interaction) => {
                const args: EventArgs = {
                    client: this.client,
                    interaction,
                    commands: this.commands,
                };

                await event.action(args);
            });
        });
    }

    private initCommands(commands: Command[]) {
        commands.forEach((command) => {
            this.commands.set(command.getName(), command);
        });
    }

    public async login() {
        await this.client.login(this.token);
    }

    public async registerSlashCommands() {
        const slashCommands = buildSlashCommand(Array.from(this.commands.values()))
            .map(command => command.toJSON());

        const path = Routes.applicationGuildCommands(this.applicationId, this.guildId);

        try {
            await this.rest.put(path, { body: slashCommands });
        } catch (err) {
            console.error(err);
        }
    }
}
