import { ChatInputCommand } from "../command";
import { RoleName } from "../types";

export class RoleManagerCommand extends ChatInputCommand {
    roleNameManage!: RoleName;
    getUserFieldName!: string;
    allowedRolesToAdd!: RoleName[];
    allowedRolesToRemove!: RoleName[];

    async executable(): Promise<void> {
        const target = this.interaction.options.getUser(this.getUserFieldName);
        if (!target)
            throw "RoleManagerCommand#1".toError();

        const targetAsMember = this.interaction.guild?.members.cache.get(target.id);
        if (!targetAsMember)
            throw "RoleManagerCommand#2".toError();

        if (!this.hasRole(this.roleNameManage, targetAsMember)) {
            await this.addRoleToTarget(
                target,
                this.roleNameManage,
                this.allowedRolesToAdd,
            );
        } else {
            await this.removeRoleFromTarget(
                target,
                this.roleNameManage,
                this.allowedRolesToRemove,
            );
        }
    }
}
