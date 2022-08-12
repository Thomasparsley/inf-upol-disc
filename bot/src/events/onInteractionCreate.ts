import { GuildMemberRoleManager } from "discord.js";

import { CommandArgs, OnInteractionCreateArgs } from "../interfaces";
import { reply, replySilent } from "../utils";
import { UnknownCommandError } from "../errors";
import { Command } from "../command";

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
    const { interaction, commands, buttons, modals } = args;

    let command: Command | undefined;
    if(interaction.isButton())
        command = buttons.get(interaction.customId);

    else if(interaction.isModalSubmit())
        command = modals.get(interaction.customId);
    
    else if (interaction.isChatInputCommand())
        command = commands.get(interaction.commandName);
    
    if (!command)
        throw new UnknownCommandError();

    const commandArgs = makeCommandArgs(args)
    await command.execute(commandArgs);
}

export default event


