import { RoleName } from "../../types";
import { AddRoleManagerDropdownCommand } from "./addRoleManager";


export class AddRoleDropdownCommand extends AddRoleManagerDropdownCommand {
    name = "dropdownAddRole"
    allowedRoles: RoleName[] = [] // All roles are allowed
}
