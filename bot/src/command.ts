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
    MessagePayload,
    InteractionReplyOptions,
    ButtonBuilder,
    ActionRowBuilder,
} from "discord.js"

import { InvalidChannel, InvalidGuild, UnauthorizedError, UnrepliableInteractionError } from "./errors"
import { VOC_RoleAdded, VOC_RoleRemoved } from "./vocabulary"
import { RoleName } from "./types"
import { RoleIds } from "./enums"
import { Mailer } from "./mailer"


export interface ICommand<T> {
    new(): T;
}

export interface IDropdownCommand<T> {
    new(flag?: string): T;
}

interface IReply {
    content: string
    silent: boolean
    component?: any
}

class Command {
    name!: string
    description!: string
    client!: Client
    mailer!: Mailer

    async execute(client: Client, mailer: Mailer): Promise<void> {
        this.client = client
        this.mailer = mailer

        await this.executable()
    }

    protected async executable(): Promise<void> {
        throw "Unimplemented executable".toError()
    }
}

export class InteractionCommand<T extends Interaction> extends Command {
    interaction!: T

    // @ts-ignore
    async execute(client: Client, mailer: Mailer, interaction: T): Promise<void> {
        this.client = client
        this.mailer = mailer
        this.interaction = interaction

        try {
            await this.executable()
        } catch (err) {
            console.error(err)
            await this.replySilent((err as Error).toString())
        }
    }

    protected async sendReply(options: IReply) {
        if (this.interaction.isRepliable()) {
            const rows: any[] = []

            if (options.component)
                rows.push(new ActionRowBuilder().addComponents(options.component))

            return await this.interaction.reply({
                content: options.content,
                ephemeral: options.silent,
                components: rows,
            })
        }

        throw new UnrepliableInteractionError()
    }

    protected async reply(content: string) {
        return await this.sendReply({
            content,
            silent: false,
        })
    }

    protected async replySilent(content: string) {
        return await this.sendReply({
            content,
            silent: true,
        })
    }

    protected async replySilentWithButton(content: string, btn: ButtonBuilder) {
        return await this.sendReply({
            content,
            silent: true,
            component: btn,
        })
    }

    protected getRoleID(roleName: RoleName): string {
        return RoleIds[roleName]
    }

    protected getMemberRoleManager(): GuildMemberRoleManager {
        return this.interaction.member?.roles as GuildMemberRoleManager
    }

    protected hasRole(roleName: RoleName, user: GuildMember | null = null): boolean {
        if (user)
            return user.roles.cache.has(this.getRoleID(roleName))

        const memberRoleManager = (this.interaction.member?.roles as GuildMemberRoleManager)
        if (memberRoleManager)
            return memberRoleManager.cache.has(this.getRoleID(roleName))

        return false
    }

    protected hasRoleByID(id: string): boolean {
        return this.getMemberRoleManager().cache.has(id)
    }

    protected hasOneOfRoles(allowedRoles: RoleName[]) {
        return allowedRoles.some((roleName) => this.hasRole(roleName))
    }

    protected async addRolesByID(rolesID: string[]): Promise<void> {
        await this.getMemberRoleManager().add(rolesID)
    }

    protected async addRoleByID(roleID: string): Promise<void> {
        await this.addRolesByID([roleID])
    }

    protected async addRoles(roleNames: RoleName[]): Promise<void> {
        const ids: string[] = []

        for (const roleName of roleNames)
            ids.push(this.getRoleID(roleName))

        await this.addRolesByID(ids)
    }

    protected async addRole(roleName: RoleName): Promise<void> {
        await this.addRoles([roleName])
    }

    protected async removeRolesByID(rolesID: string[]): Promise<void> {
        await this.getMemberRoleManager().remove(rolesID)
    }

    protected async removeRoleByID(roleID: string): Promise<void> {
        await this.removeRolesByID([roleID])
    }

    protected async removeRoles(roleNames: RoleName[]): Promise<void> {
        const ids: string[] = []

        for (const roleName of roleNames)
            ids.push(this.getRoleID(roleName))

        await this.removeRolesByID(ids)
    }

    protected async removeRole(roleName: RoleName): Promise<void> {
        await this.removeRoles([roleName])
    }

    protected permissionRolesCount(predicate: Function): boolean {
        const roles = (this.interaction.member?.roles as GuildMemberRoleManager)
        if (!roles) {
            return false
        }

        return predicate(roles.cache.size)
    }

    protected hasAtleastOneRole(): boolean {
        return this.permissionRolesCount((size: Number) => size > 0)
    }

    protected guild(): Guild {
        const guild = this.interaction.guild
        if (!guild)
            throw new InvalidGuild()

        return guild
    }

    async fetchChannelFromGuild(id: string): Promise<NonThreadGuildBasedChannel> {
        const channel = await this.guild().channels.fetch(id)
        if (!channel)
            throw new InvalidChannel()

        return channel
    }
}

type BuilderType = SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder

export class ChatInputCommand extends InteractionCommand<ChatInputCommandInteraction<CacheType>> {
    protected builder!: BuilderType

    getBuilder(): BuilderType {
        // @ts-ignore
        this.builder.name = this.name
        // @ts-ignore
        this.builder.description = this.description

        return this.builder
    }

    protected async addRoleToTarget(
        target: User,
        nameOfRoleToAdd: RoleName,
        allowedRoles: RoleName[],
    ): Promise<void> {
        if (!this.hasOneOfRoles(allowedRoles))
            throw new UnauthorizedError()

        const targetAsMember = this.guild().members.cache.get(target.id)
        if (!targetAsMember)
            throw "addRoleToTarget#1".toError()

        const roleToAdd = this.guild().roles.cache.get(RoleIds[nameOfRoleToAdd])
        if (!roleToAdd)
            throw "addRoleToTarget#2".toError()

        await targetAsMember.roles.add(roleToAdd)
        await this.replySilent(VOC_RoleAdded(roleToAdd))
    }

    protected async removeRoleFromTarget(
        target: User,
        nameOfRoleToRemove: RoleName,
        allowedRoles: RoleName[],
    ): Promise<void> {
        if (!this.hasOneOfRoles(allowedRoles))
            throw new UnauthorizedError()

        const targetAsMember = this.guild().members.cache.get(target.id)
        if (!targetAsMember)
            throw "addRoleToTarget#1".toError()

        const roleToAdd = this.guild().roles.cache.get(RoleIds[nameOfRoleToRemove])
        if (!roleToAdd)
            throw "addRoleToTarget#2".toError()

        await targetAsMember.roles.remove(roleToAdd)
        await this.replySilent(VOC_RoleRemoved(roleToAdd))
    }
}

export class ButtonCommand extends InteractionCommand<ButtonInteraction<CacheType>> { }

export class ModalCommand extends InteractionCommand<ModalSubmitInteraction<CacheType>> { }

export class DropdownCommand extends InteractionCommand<SelectMenuInteraction<CacheType>> {
    constructor(public flag?: string) { super() }

    description: string = ""
}
