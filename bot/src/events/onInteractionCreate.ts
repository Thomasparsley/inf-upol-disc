import { CacheType, CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { OnInteractionCreateAction, OnInteractionCreateArgs } from "../bot";
import { CommandArgs } from "../command";
import { UnknownCommandError } from "../errors";

function reply(interaction: CommandInteraction<CacheType>) {
    return async function (content: string) {
        return await interaction.reply({
            content,
        });
    }
}

function replySilent(interaction: CommandInteraction<CacheType>) {
    return async function (content: string) {
        return await interaction.reply({
            content,
            ephemeral: true,
        });
    }
}

// @ts-ignore
function makeCommandArgs({ client, interaction, commands, db, commandRegistration }) {
    const commandArgs: CommandArgs = {
        client,
        interaction,
        commands,
        db,
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


