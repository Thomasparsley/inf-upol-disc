import { CacheType, Client, Interaction, InteractionResponse } from "discord.js";
import { DataSource } from "typeorm";
import { Command } from "../command";
import { Mailer } from "../mailer";

export interface CommandArgs {
    client: Client;
    interaction: Interaction<CacheType>;
    commands: Map<string, Command>;
    db: DataSource;
    mailer: Mailer;
    commandRegistration: (commands: Command[]) => Promise<void>;
    reply: (content: string) => Promise<void | InteractionResponse<boolean>>;
    replySilent: (content: string) => Promise<void | InteractionResponse<boolean>>;
    permissionRolesCount: (predicate: Function) => boolean;
    permissionRole: (roleID: string) => boolean;
}