import { SlashCommandBuilder } from "@discordjs/builders"

import { CD_Katedra as cd } from "../cd"
import { RoleName } from "../types"
import { RoleManagerCommand } from "./roleManager"

export class DepartmentRoleManagerCommand extends RoleManagerCommand {
    name = cd.name
    description = cd.description
    builder = new SlashCommandBuilder()
        .addUserOption(option => {
            return option
                .setName(cd.options[0].name)
                .setDescription(cd.options[0].description)
                .setRequired(true)
        })

    roleNameManage: RoleName = "Katedra"
    getUserFieldName: string = cd.options[0].name
    allowedRolesToAdd: RoleName[] = ["Katedra", "Root"]
    allowedRolesToRemove: RoleName[] = ["Katedra"]
}
