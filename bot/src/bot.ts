import { Client, Intents } from 'discord.js';

import { Event, EventArgs } from "./event";
import { Command } from "./command";

export default class Bot {
  token: string;
  client: Client;
  commands: Map<string, Command>;

  constructor(token: string, events: Events[], commands: Command[]) {
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS]
    });

    this.commands = new Map<string, Command>();

    this.token = token;
    this.initEvenst(events);
    this.initCommands(commands);
  }

  private initEvents(events: Events[]) {
    events.forEach((event) => {
      this.client.on(event.name, async (interaction) => {
        const args: EventArgs = {
          client: this.client,
          interaction: interaction,
          commands: this.commands,
        }

        await event.action(args)
      });
    });
  }

  private initCommands(commands: Command[]) {
    commands.forEach((command) => {
      this.commands.set(command.name, command);
    });
  }

  public async login() {
    await this.client.login(this.token);
  }
}
