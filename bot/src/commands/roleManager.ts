import { ChatInputCommand } from "../command"
import { RoleName } from "../types"

/**
 * Base class used for commands that manipulate roles
 */
export class RoleManagerCommand extends ChatInputCommand {
    /**
     * Role which will be managed by this command
     */
    roleNameManage!: RoleName

    /**
     * Name of field that contains the username
     */
    getUserFieldName!: string

    /**
     * Users with at least one role in this list may use this command to add the role specified by {@link roleNameManage}
     */
    allowedRolesToAdd!: RoleName[]

    /**
     * Users with at least one role in this list may use this command to remove the role specified by {@link roleNameManage}
     */
    allowedRolesToRemove!: RoleName[]

    async executable(): Promise<void> {
        const target = this.interaction.options.getUser(this.getUserFieldName)
        if (!target)
            throw "RoleManagerCommand#1".toError()

        const targetAsMember = this.interaction.guild?.members.cache.get(target.id)
        if (!targetAsMember)
            throw "RoleManagerCommand#2".toError()

        if (!this.hasRole(this.roleNameManage, targetAsMember)) {
            await this.addRoleToTarget(
                target,
                this.roleNameManage,
                this.allowedRolesToAdd,
            )
        } else {
            await this.removeRoleFromTarget(
                target,
                this.roleNameManage,
                this.allowedRolesToRemove,
            )
        }
    }
}
