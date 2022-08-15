import { 
    Client,
    Guild,
    InteractionResponse,
    NonThreadGuildBasedChannel
} from "discord.js";
import { DataSource } from "typeorm";
import { Command } from "../command";
import { Mailer } from "../mailer";

export interface CommandArgs<T> {
    client: Client;
    interaction: T;
    commands: Map<string, Command<T>>;
    db: DataSource;
    mailer: Mailer;
    commandRegistration: (commands: Command<T>[]) => Promise<void>;
    getGuild: () => Guild;
    fetchChannelFromGuild: (id: string) => Promise<NonThreadGuildBasedChannel>;
    reply: (content: string) => Promise<void | InteractionResponse<boolean>>;
    replySilent: (content: string) => Promise<void | InteractionResponse<boolean>>;
    permissionRolesCount: (predicate: Function) => boolean;
    permissionRole: (roleID: string) => boolean;
    flag?: string;
}
