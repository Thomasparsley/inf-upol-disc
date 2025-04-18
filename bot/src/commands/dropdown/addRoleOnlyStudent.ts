import { RoleName } from "../../types";
import { AddRoleManagerDropdownCommand } from "./addRoleManager";

/**
 * Dropdown command that is only available to students
 */
export class AddRoleOnlyStudentDropdownCommand extends AddRoleManagerDropdownCommand {
    name = "dropdownAddRoleOnlyStudent"
    allowedRoles: RoleName[] = ["Student"]
}
