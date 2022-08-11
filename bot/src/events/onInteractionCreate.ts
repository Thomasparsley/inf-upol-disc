import { GuildMemberRoleManager } from "discord.js";

import { CommandArgs, OnInteractionCreateArgs } from "../interfaces";
import { reply, replySilent } from "../functions";
import { UnknownCommandError } from "../errors";

function makeCommandArgs(args: OnInteractionCreateArgs) {
    const { client, interaction, commands, db, mailer, commandRegistration } = args;

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


