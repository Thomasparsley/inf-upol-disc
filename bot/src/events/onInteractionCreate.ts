import { CacheType, GuildMemberRoleManager, Interaction } from "discord.js";

import { OnInteractionCreateArgs } from "../bot";
import { UnknownCommandError, UnrepliableInteractionError } from "../errors";
import { CommandArgs } from "../command";


export function reply(interaction: Interaction<CacheType>) {
    return async function (content: string) {
        if (interaction.isRepliable())
            return await interaction.reply({
                content,
            });

        throw new UnrepliableInteractionError();
    }
}

export function replySilent(interaction: Interaction<CacheType>) {
    return async function (content: string) {
        if (interaction.isRepliable())
            return await interaction.reply({
                content,
                ephemeral: true,
            });

        throw new UnrepliableInteractionError();
    }
}

// @ts-ignore
function makeCommandArgs({ client, interaction, commands, db, mailer, commandRegistration }) {
    const commandArgs: CommandArgs = {
        client,
        interaction,
        commands,
        db,
        mailer,
        commandRegistration,
        reply: reply(interaction),
        replySilent: replySilent(interaction),
        permissionRolesCount: (predicate: Function): boolean => {
            const roles = (interaction.member?.roles as GuildMemberRoleManager)
            if (!roles) {
                return false;
            }

            return predicate(roles.cache.size);
        },
        permissionRole: (roleID: string): boolean => {
            const roles = (interaction.member?.roles as GuildMemberRoleManager)
            if (!roles) {
                return false;
            }

            return roles.cache.has(roleID);
        },
    }

    return commandArgs;
}

async function event(args: OnInteractionCreateArgs) {
    const { interaction, commands } = args;

    if (!interaction.isCommand())
        throw "Zadaný požadavek není příkaz!".toError();
    
    const commandArgs = makeCommandArgs(args)

    const command = commands.get(interaction.commandName);
    if (!command)
        throw new UnknownCommandError();

    await command.execute(commandArgs);

    throw "Nastala chyba při vykonávání příkazu!".toError();
}

export default event


