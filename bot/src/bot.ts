import { Client, Intents } from 'discord.js';

import { Command } from "./command";

export default class Bot {
  token: string;
  client: Client;

  constructor(token: string, commands: Command[]) {
    this.client = new Client({
      intents: []
    });

    this.token = token;

    commands.forEach(command => {
      this.client.on(command.event, command.listener);
    });

  }

  public async login() {
    await this.client.login(this.token);
  }
}
