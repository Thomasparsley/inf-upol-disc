import { CacheType, Client, Interaction } from "discord.js";
import { DataSource } from "typeorm";
import { Command } from "../command";
import { Mailer } from "../mailer";

export interface OnInteractionCreateArgs {
    client: Client;
    interaction: Interaction<CacheType>;
    commands: Map<string, Command>;
    buttons: Map<string, Command>;
    modals: Map<string, Command>;
    db: DataSource;
    mailer: Mailer;
    commandRegistration: (commands: Command[]) => Promise<void>;
}
