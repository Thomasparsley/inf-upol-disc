import { RoleName } from "../../types";
import { AddRoleManagerDropdownCommand } from "./addRoleManager";

/**
 * Dropdown command available to all roles
 */
export class AddRoleDropdownCommand extends AddRoleManagerDropdownCommand {
    name = "dropdownAddRole"
    allowedRoles: RoleName[] = [] // All roles are allowed
}
