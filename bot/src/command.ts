import {
    CacheType,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    SelectMenuInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    Interaction,
    GuildMemberRoleManager,
    GuildMember,
    User,
    Client,
    Guild,
    NonThreadGuildBasedChannel,
} from "discord.js";

import { InvalidChannel, InvalidGuild, UnauthorizedError, UnrepliableInteractionError } from "./errors";
import { VOC_RoleAdded, VOC_RoleRemoved } from "./vocabulary";
import { RoleName } from "./types";
import { RoleIds } from "./enums";


class Command {
    name!: string;
    description!: string;
    client!: Client

    async execute(client: Client): Promise<void> {
        this.client = client;

        await this.executable();
    }

    protected async executable(): Promise<void> {
        throw "Unimplementet executable".toError();
    }
}

export class InteractionCommand<T extends Interaction> extends Command {
    interaction!: T

    // @ts-ignore
    async execute(client: Client, interaction: T): Promise<void> {
        this.interaction = interaction;
        
        try {
            await this.executable();
        } catch (err) {
            console.error(err);
            await this.replySilent((err as Error).toString());
        }
    }

    protected async sendReply(content: string, silent: boolean) {
        if (this.interaction.isRepliable())
            return await this.interaction.reply({
                content,
                ephemeral: silent,
            });

        throw new UnrepliableInteractionError();
    }

    protected async reply(content: string) {
        return await this.sendReply(content, false);
    }

    protected async replySilent(content: string) {
        return await this.sendReply(content, true);
    }

    protected getRoleID(roleName: RoleName): string {
        return RoleIds[roleName];
    }

    protected getMemberRoleManager(): GuildMemberRoleManager {
        return this.interaction.member?.roles as GuildMemberRoleManager
    }

    protected hasRole(roleName: RoleName, user: GuildMember | null = null): boolean {
        if (user)
            return user.roles.cache.has(this.getRoleID(roleName));

        const memberRoleManager = (this.interaction.member?.roles as GuildMemberRoleManager)
        if (memberRoleManager)
            return memberRoleManager.cache.has(this.getRoleID(roleName));

        return false;
    }

    protected hasRoleByID(id: string): boolean {
        return this.getMemberRoleManager().cache.has(id);
    }

    protected hasOneOfRoles(allowedRoles: RoleName[]) {
        return allowedRoles.some((roleName) => this.hasRole(roleName));
    }

    protected async addRoleByID(roleID: string): Promise<void> {
        await this.getMemberRoleManager().add(roleID);
    }

    protected async addRole(roleName: RoleName): Promise<void> {
        await this.addRoleByID(this.getRoleID(roleName));
    }

    protected async removeRoleByID(roleID: string): Promise<void> {
        await this.getMemberRoleManager().remove(roleID);
    }

    protected async removeRole(roleName: RoleName): Promise<void> {
        await this.removeRoleByID(this.getRoleID(roleName));
    }

    protected permissionRolesCount(predicate: Function): boolean {
        const roles = (this.interaction.member?.roles as GuildMemberRoleManager)
        if (!roles) {
            return false;
        }

        return predicate(roles.cache.size);
    }

    protected guild(): Guild {
        const guild = this.interaction.guild;
        if (!guild)
            throw new InvalidGuild();

        return guild;
    }

    async fetchChannelFromGuild(id: string): Promise<NonThreadGuildBasedChannel> {
        const channel = await this.guild().channels.fetch(id);
        if (!channel)
            throw new InvalidChannel();

        return channel
    }
}

type BuilderType = SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder

export class ChatInputCommand extends InteractionCommand<ChatInputCommandInteraction<CacheType>> {
    builder!: BuilderType;

    protected async addRoleToTarget(
        target: User,
        nameOfRoleToAdd: RoleName,
        allowedRoles: RoleName[],
    ): Promise<void> {
        if (!this.hasOneOfRoles(allowedRoles))
            throw new UnauthorizedError();

        const targetAsMember = this.guild().members.cache.get(target.id);
        if (!targetAsMember)
            throw "addRoleToTarget#1".toError();

        const roleToAdd = this.guild().roles.cache.get(RoleIds[nameOfRoleToAdd]);
        if (!roleToAdd)
            throw "addRoleToTarget#2".toError();

        if (this.hasRole(roleToAdd.name as RoleName, targetAsMember)) {
            await this.replySilent(`Uživatel ${targetAsMember} roli ${roleToAdd} již má.`);
            return;
        }

        await targetAsMember.roles.add(roleToAdd);
        await this.replySilent(VOC_RoleAdded(roleToAdd));
    }

    protected async removeRoleFromTarget(
        target: User,
        nameOfRoleToRemove: RoleName,
        allowedRoles: RoleName[],
    ): Promise<void> {
        if (!this.hasOneOfRoles(allowedRoles))
            throw new UnauthorizedError();

        const targetAsMember = this.guild().members.cache.get(target.id);
        if (!targetAsMember)
            throw "addRoleToTarget#1".toError();

        const roleToAdd = this.guild().roles.cache.get(RoleIds[nameOfRoleToRemove]);
        if (!roleToAdd)
            throw "addRoleToTarget#2".toError();

        if (!this.hasRole(roleToAdd.name as RoleName, targetAsMember)) {
            await this.replySilent(`Uživatel ${targetAsMember} roli ${roleToAdd} nemá.`);
            return;
        }

        await targetAsMember.roles.remove(roleToAdd);
        await this.replySilent(VOC_RoleRemoved(roleToAdd));
    }
}

export class ButtonCommand extends InteractionCommand<ButtonInteraction<CacheType>> { }

export class ModalCommand extends InteractionCommand<ModalSubmitInteraction<CacheType>> { }

export class DropdownCommand extends InteractionCommand<SelectMenuInteraction<CacheType>> {
    description: string = "";

    flag?: string;
}
