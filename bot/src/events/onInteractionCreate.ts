import { CacheType, CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { OnInteractionCreateAction, OnInteractionCreateArgs } from "../bot";
import { CommandArgs } from "../command";
import { Result } from "../result";
import { VOC_HasNotPermission } from "../vocabulary";

function reply(interaction: CommandInteraction<CacheType>) {
    return async function (content: string): Promise<void> {
        return await interaction.reply({
            content,
        });
    }
}

function replySilent(interaction: CommandInteraction<CacheType>) {
    return async function (content: string): Promise<void> {
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
        permissionRolesCount: async (predicate: Function): Promise<Result<boolean, Error>> => {
            const roles = (interaction.member?.roles as GuildMemberRoleManager)
            if (!roles) {
                return Result.err(new Error("Error: permissionRolesCount#1"));
            }

            return Result.ok(predicate(roles.cache.size));
        },
        permissionRole: async (roleID: string): Promise<Result<boolean, Error>> => {
            const roles = (interaction.member?.roles as GuildMemberRoleManager)
            if (!roles) {
                return Result.err(new Error("Error: permissionRole#1"));
            }

            return Result.ok(roles.cache.has(roleID));
        },
    }

    return commandArgs;
}

async function event(args: OnInteractionCreateArgs) {
    const { interaction, commands } = args;

    if (!interaction.isCommand()) {
        return Result.err("Zadaný požadavek není příkaz!".toError());
    }
    
    const commandArgs = makeCommandArgs(args)

    try {
        const command = commands.get(interaction.commandName);
        if (!command) {
            return Result.err("Neznámý příkaz!".toError());
        }

        return await command.execute(commandArgs);
    } catch (err) {
        console.error(err);
    }

    return Result.err("Nastala chyba při vykonávání příkazu!".toError());
}

export default event


