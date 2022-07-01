import { CacheType, CommandInteraction, GuildMemberRoleManager } from "discord.js";
import { OnInteractionCreateAction, OnInteractionCreateArgs } from "../bot";
import { CommandArgs } from "../command";
import { Err, Ok, Result } from "../result";
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
        permissionRolesCount: async (predicate: Function): Promise<Result<boolean | Error>> => {
            const roles = (interaction.member?.roles as GuildMemberRoleManager)
            if (!roles) {
                return Err("Error: permissionRolesCount#1");
            }

            return Ok(predicate(roles.cache.size));
        },
        permissionRole: async (roleID: string): Promise<Result<boolean | Error>> => {
            const roles = (interaction.member?.roles as GuildMemberRoleManager)
            if (!roles) {
                return Err("Error: permissionRole#1");
            }

            return Ok(roles.cache.has(roleID));
        },
    }

    return commandArgs;
}

async function event(args: OnInteractionCreateArgs) {
    const { interaction, commands } = args;

    if (!interaction.isCommand()) {
        return Err("Zadaný požadavek není příkaz!");
    }
    
    const commandArgs = makeCommandArgs(args)

    try {
        const command = commands.get(interaction.commandName);
        if (!command) {
            return Err("Neznámý příkaz!");
        }

        return Ok(await command.execute(commandArgs));
    } catch (err) {
        console.error(err);
    }

    return Err("Nastala chyba při vykonávání příkazu!");
}

export default event


