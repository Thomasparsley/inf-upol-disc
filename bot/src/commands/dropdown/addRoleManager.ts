import { Role } from "discord.js"
import { DropdownCommand } from "../../command"
import { UnauthorizedError } from "../../errors"
import { RoleName } from "../../types"


export class AddRoleManagerDropdownCommand extends DropdownCommand {

    allowedRoles!: RoleName[]

    async executable(): Promise<void> {
        const addedRoles: Role[] = []
        const removedRoles: Role[] = []

        const roles = this.interaction.values
        for (const roleNameRaw of roles) {
            let roleName: string
            if (this.flag && ["predmety_0n", "predmety_pz"].includes(this.flag)) {
                roleName = roleNameRaw.split(" ")[0]
            } else {
                roleName = roleNameRaw
            }

            if (this.allowedRoles.length > 0)
                if (!this.hasOneOfRoles(this.allowedRoles))
                    throw new UnauthorizedError;

            const role = this.guild().roles.cache.find(r => r.name === roleName)
            if (!role)
                throw `${roleName} role neexistuje `.toError()

            const roleID = role.id
            if (!this.hasRoleByID(roleID)) {
                await this.addRoleByID(roleID)
                addedRoles.push(role)
            } else {
                await this.removeRoleByID(roleID)
                removedRoles.push(role)
            }
        }

        await this.replySilent(`Role ${addedRoles} Vám byli přideleny`)
        await this.replySilent(`Role ${removedRoles} Vám byli odebrány`)
    }
}