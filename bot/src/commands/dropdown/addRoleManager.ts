import { ActionRowBuilder, Role } from "discord.js"
import { DropdownCommand } from "../../command"
import { UnauthorizedError } from "../../errors"
import { RoleName } from "../../types"


export class AddRoleManagerDropdownCommand extends DropdownCommand {
    allowedRoles!: RoleName[]

    async executable(): Promise<void> {
        const addedRoles: Role[] = []
        const addedRolesID: string[] = []
        const removedRoles: Role[] = []
        const removedRolesID: string[] = []

        this.interaction.deferReply({ ephemeral: true })

        const roles = this.interaction.values
        for (const roleNameRaw of roles) {
            let roleName: string
            if (this.flag && ["predmety_0n", "predmety_oz", "predmety_prg"].includes(this.flag)) {
                roleName = roleNameRaw.split(" ")[0]
            } else {
                roleName = roleNameRaw
            }

            if (this.allowedRoles.length > 0) {
                if (!this.hasOneOfRoles(this.allowedRoles)) {
                    throw new UnauthorizedError;
                }
            }

            const role = this.guild().roles.cache.find(r => r.name === roleName)
            if (!role) {
                throw `${roleName} role neexistuje `.toError()
            }

            const roleID = role.id
            if (!this.hasRoleByID(roleID)) {
                addedRoles.push(role)
                addedRolesID.push(role.id)
            } else {
                removedRoles.push(role)
                removedRolesID.push(role.id)
            }
        }

        if (addedRoles.length > 0) {
            await this.addRolesByID(addedRolesID)
        }
        if (removedRolesID.length > 0) {
            await this.removeRolesByID(removedRolesID)
        }

        /* await this.interaction.update({
            components: [
                // @ts-ignore
                new ActionRowBuilder().addComponents(this.interaction.component)
            ]
        }) */

        if (addedRoles.length > 0 && removedRoles.length > 0) {
            await this.followUpSilent(`Role [${addedRoles}] Vám byly přiděleny. Role [${removedRoles}] Vám byly odebrány.`)
        } else if (addedRoles.length > 0) {
            await this.followUpSilent(`Role [${addedRoles}] Vám byly přiděleny.`)
        } else if (removedRoles.length > 0) {
            await this.followUpSilent(`Role [${removedRoles}] Vám byly odebrány`)
        } else {
            await this.followUpSilent(`K žádným změnám nedošlo`)
        }
    }
}
