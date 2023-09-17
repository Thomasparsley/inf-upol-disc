import {
    CacheType,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    Interaction,
    GuildMemberRoleManager,
    GuildMember,
    User,
    Client,
    Guild,
    ButtonBuilder,
    ActionRowBuilder,
    GuildBasedChannel,
    StringSelectMenuInteraction,
    RESTPostAPIApplicationCommandsJSONBody, // TODO: Update to latest discord.js
} from "discord.js"
import {
    Bot
} from "./bot"
import {
    InvalidChannel,
    InvalidGuild,
    UnauthorizedError,
    UnrepliableInteractionError,
} from "./errors"
import {
    VOC_RoleAdded,
    VOC_RoleRemoved,
} from "./vocabulary"
import { RoleName } from "./types"
import { RoleIds } from "./enums"
import { Mailer } from "./mailer"

/**
 * Represents a generic command maker which allows for creation of its command
 */
export interface ICommand<T> {
    /**
     * Return a new instance of its inner command T
     */
    new(): T;
}

/**
 * Represents a generic command maker which allows for creation of its command
 * 
 * Specifically used for dropdowns
 */
export interface IDropdownCommand<T> {
    /**
     * Returns a new instance of its inner command T given a flag
     */
    new(flag?: string): T;
}

/**
 * Represents a reply to a command
 */
interface IReply {
    /**
     * Content of the reply
     */
    content: string
    /**
     * Specified whether the reply be displayed to everyone or just the user who invoked the command
     */
    silent: boolean
    /**
     * Components of the reply such as buttons or modals
     */
    component?: any
}

/**
 * Base class of all command in the application
 */
class Command {
    /**
     * Name of this command
     */
    name!: string
    /**
     * Description of this command
     */
    description!: string
    /**
     * Discord client that should be used for this command
     */
    client!: Client
    /**
     * Mailer that should be used for this command
     */
    mailer!: Mailer
    /**
     * Bot instance that should be used for this command
     */
    bot!: Bot

    /**
     * Executes the command
     * @param client Discord client which should be used when processing this command
     * @param mailer Mailer instance which should be used when processing this command
     * @param bot Bot instance which should be used when processing this command
     */
    async execute(client: Client, mailer: Mailer, bot: Bot): Promise<void> {
        this.client = client
        this.mailer = mailer
        this.bot = bot

        await this.executable()
    }

    /**
     * Internal method which should be ran when the command is executing
     * 
     * Children classes should override this to implement the command functionality
     */
    protected async executable(): Promise<void> {
        throw "Unimplemented executable".toError()
    }
}

/**
 * Base class representing a command that is related to an interaction
 */
export class InteractionCommand<T extends Interaction> extends Command {
    /**
     * Instance of interaction that invoked this command
     */
    interaction!: T

    /**
     * Executes the interaction command
     * @param client Discord client which should be used when processing this command
     * @param mailer Mailer instance which should be used when processing this command
     * @param interaction Interaction which invoked this command
     */
    // @ts-ignore
    async execute(client: Client, mailer: Mailer, bot: Bot, interaction: T): Promise<void> {
        this.client = client
        this.mailer = mailer
        this.interaction = interaction
        this.bot = bot

        try {
            await this.executable()
        } catch (err) {
            console.error(err)
            await this.replySilent((err as Error).toString())
        }
    }

    private async sendReply(options: IReply) {
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

    /**
     * Replies to the interaction which invoked this command
     * @param content Content which should be used to respond
     * @returns Promise representing completion of the reply
     */
    protected async reply(content: string) {
        return await this.sendReply({
            content,
            silent: false,
        })
    }

    /**
     * Silently replies to the interaction which invoked this command
     * @param content Content which should be used to respond
     * @returns Promise representing completion of the reply
     */
    protected async replySilent(content: string) {
        return await this.sendReply({
            content,
            silent: true,
        })
    }

    /**
     * Silently replies to the interaction which invoked this command with a button as a component
     * @param content Content which should be used to respond
     * @param btn Button which should be included in the interaction reply
     * @returns Promise representing completion of the reply
     */
    protected async replySilentWithButton(content: string, btn: ButtonBuilder) {
        return await this.sendReply({
            content,
            silent: true,
            component: btn,
        })
    }

    private async sendFollowUp(content: string, silent: boolean) {
        if (this.interaction.isRepliable()) {
            return await this.interaction.followUp({
                content,
                ephemeral: silent,
            })
        }
    }

    /**
     * Sends a follow-up response to the interaction
     * 
     * Should only be used after {@link reply}
     * @param content Content which should be sent as the follow-up
     * @returns Promise representing completion of the follow-up action
     */
    protected async followUp(content: string) {
        return await this.sendFollowUp(content, false)
    }

    /**
     * Sends a silent follow-up response to the interaction
     * 
     * Should only be used after {@link replySilent}
     * @param content The content which should be send as the follow-up
     * @returns Promise representing completion of the follow-up action
     */
    protected async followUpSilent(content: string) {
        return await this.sendFollowUp(content, true)
    }

    /**
     * Gets the role ID for the given role name
     * @param roleName Name of the role for which the ID should be retrieved
     * @returns ID of the specified role
     */
    protected getRoleID(roleName: RoleName): string {
        return RoleIds[roleName]
    }

    /**
     * Gets the member role manager which can be used to manage roles of guild members
     * @returns Instance of {@link GuildMemberRoleManager}
     */
    protected getMemberRoleManager(): GuildMemberRoleManager {
        return this.interaction.member?.roles as GuildMemberRoleManager
    }

    /**
     * Checks whether the member that invoked this command has a specific role
     * @param roleName Name of the role which the user should have
     * @param user User who should have the role
     * @returns True, if the member that invoked this command has the role, else false
     */
    protected hasRole(roleName: RoleName, user: GuildMember | null = null): boolean {
        if (user)
            return user.roles.cache.has(this.getRoleID(roleName))

        const memberRoleManager = (this.interaction.member?.roles as GuildMemberRoleManager)
        if (memberRoleManager)
            return memberRoleManager.cache.has(this.getRoleID(roleName))

        return false
    }

    /**
     * Checks if the member that invoked the command has the specified role ID in it's cache
     * @param id ID which should be checked
     * @returns True, if the membe has the specified ID in cache, else false
     */
    protected hasRoleByID(id: string): boolean {
        return this.getMemberRoleManager().cache.has(id)
    }

    /**
     * Checks if the member that invoked this command has at least one of the specified roles in it's cache
     * @param allowedRoles List of roles which should be checked
     * @returns True, if the member has one of the specified roles, otherwise false
     */
    protected hasOneOfRoles(allowedRoles: RoleName[]) {
        return allowedRoles.some((roleName) => this.hasRole(roleName))
    }

    /**
     * Adds the specified roles to the guild member that invoked this command
     * @param rolesID IDs of the roles which should be added
     */
    protected async addRolesByID(rolesID: string[]): Promise<void> {
        await this.getMemberRoleManager().add(rolesID)
    }

    /**
     * Adds a single role to the guild member that invoked this command
     * @param roleID ID of the role which should be added
     */
    protected async addRoleByID(roleID: string): Promise<void> {
        await this.addRolesByID([roleID])
    }

    /**
     * Adds the specified roles to the guild member that invoked this command
     * @param roleNames Names of the roles that should be added
     */
    protected async addRoles(roleNames: RoleName[]): Promise<void> {
        const ids: string[] = []

        for (const roleName of roleNames)
            ids.push(this.getRoleID(roleName))

        await this.addRolesByID(ids)
    }

    /**
     * Adds a single role to the guild member that invoked this command
     * @param roleName Name of the role that should be added
     */
    protected async addRole(roleName: RoleName): Promise<void> {
        await this.addRoles([roleName])
    }

    /**
     * Removes the specified roles from the guild member that invoked this command
     * @param rolesID ID of the role which should be removed
     */
    protected async removeRolesByID(rolesID: string[]): Promise<void> {
        await this.getMemberRoleManager().remove(rolesID)
    }

    /**
     * Removes a single role from the guild member that invoked this command
     * @param roleID ID of the role that should be removed
     */
    protected async removeRoleByID(roleID: string): Promise<void> {
        await this.removeRolesByID([roleID])
    }

    /**
     * Removes the specified roles from the guild member that invoked this command
     * @param roleNames Names of the roles that should be removed
     */
    protected async removeRoles(roleNames: RoleName[]): Promise<void> {
        const ids: string[] = []

        for (const roleName of roleNames)
            ids.push(this.getRoleID(roleName))

        await this.removeRolesByID(ids)
    }

    /**
     * Removes a single role from the guild member that invoked this command
     * @param roleName Name of the role that should be removed
     */
    protected async removeRole(roleName: RoleName): Promise<void> {
        await this.removeRoles([roleName])
    }

    /**
     * Counts the number of roles the user has and then applies the specified predicate on the count
     * @param predicate Predicate which should be applied
     * @returns Result of the predicate
     */
    protected permissionRolesCount(predicate: Function): boolean {
        const roles = (this.interaction.member?.roles as GuildMemberRoleManager)
        if (!roles) {
            return false
        }

        return predicate(roles.cache.size)
    }

    /**
     * Checks, whether the user has at least one role
     * @returns True, if the user has at least one role, false otherwise
     */
    protected hasAtleastOneRole(): boolean {
        return this.permissionRolesCount((size: number) => size > 0)
    }

    /**
     * Attempts to get the guild in which the interaction of this command was created
     * @throws When this interaction has no guild associated with it
     * @returns Instance of the guild in which the interaction of this command was created
     */
    protected guild(): Guild {
        const guild = this.interaction.guild
        if (!guild)
            throw new InvalidGuild()

        return guild
    }

    /**
     * Attempts to get the specified channel
     * 
     * The channel must be in the guild where this command is invoked
     * @param id ID of the channel which should be fetched
     * @throws When an invalid channel is specified
     * @returns Instance of the guild channel
     */
    async fetchChannelFromGuild(id: string): Promise<GuildBasedChannel> {
        const channel = await this.guild().channels.fetch(id)
        if (!channel)
            throw new InvalidChannel()

        return channel
    }
}

/**
 * Represents the type of the builder that is sent to Discord when registering commands
 */
type BuilderType = {
    toJSON(): RESTPostAPIApplicationCommandsJSONBody
    setName(name: string): BuilderType
    setDescription(description: string): BuilderType
}

/**
 * Base class for all commands that are invoked by using chat
 */
export class ChatInputCommand extends InteractionCommand<ChatInputCommandInteraction<CacheType>> {
    /**
     * Builder, which is sent to Discord when this command should be created
     */
    protected builder!: BuilderType

    /**
     * Gets the builder for this command
     * @returns The builder instance
     */
    getBuilder(): BuilderType {
        this.builder.setName(this.name)
        this.builder.setDescription(this.description)

        return this.builder
    }

    /**
     * Adds the specified role to the target if the invoking user has a required role
     * @param target User that should get the role
     * @param nameOfRoleToAdd Name of the role that should be added
     * @param allowedRoles Roles required by the user that invoked this command
     */
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

    /**
     * Removes the specified role from the target if the invoking user has a required role
     * @param target User that should loose the role
     * @param nameOfRoleToRemove Name of the role that should be removed
     * @param allowedRoles Roles required by the user that invoked this command
     */
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

/**
 * Represents a command that is invoked by a button
 */
export class ButtonCommand extends InteractionCommand<ButtonInteraction<CacheType>> { }

/**
 * Represents a command that is invoked by a modal
 */
export class ModalCommand extends InteractionCommand<ModalSubmitInteraction<CacheType>> { }

/**
 * Represents a command that is invoked by a dropdown
 */
export class DropdownCommand extends InteractionCommand<StringSelectMenuInteraction<CacheType>> {
    /**
     * Creates a new instance of the dropdown command
     * @param flag Flag that the command should use
     */
    constructor(public flag?: string) { super() }

    description: string = ""
}
