import { CacheType, GuildMemberRoleManager, Interaction } from "discord.js";

import { CommandArgs, OnInteractionCreateArgs } from "../interfaces";
import { fetchChannelFromGuild, getGuild, reply, replySilent } from "../utils";
import { UnknownCommandError } from "../errors";
import { Command } from "../command";

function makeCommandArgs(args: OnInteractionCreateArgs) {
    const { client, interaction, commands, db, mailer, commandRegistration } = args;

    const commandArgs: CommandArgs<Interaction<CacheType>> = {
        client,
        interaction,
        commands,
        db,
        mailer,
        commandRegistration,
        getGuild: getGuild(interaction),
        fetchChannelFromGuild: fetchChannelFromGuild(interaction),
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
    const { interaction, commands, buttons, modals, dropdown } = args;
    const commandArgs = makeCommandArgs(args)

    let command: Command<any> | undefined;
    if (interaction.isButton())
        command = buttons.get(interaction.customId);

    else if (interaction.isModalSubmit())
        command = modals.get(interaction.customId);

    else if (interaction.isSelectMenu()) {
        const splited = interaction.customId.split("-");
        const customId = splited[0];
        const flag = splited[1];

        command = dropdown.get(customId);
        commandArgs.flag = flag;
    }
    
    else if (interaction.isChatInputCommand())
        command = commands.get(interaction.commandName);
    
    if (!command)
        throw new UnknownCommandError();

    await command.execute(commandArgs);
}

export default event


