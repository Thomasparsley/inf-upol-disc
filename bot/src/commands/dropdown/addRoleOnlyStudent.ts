import { RoleName } from "../../types";
import { AddRoleManagerDropdownCommand } from "./addRoleManager";


export class AddRoleOnlyStudentDropdownCommand extends AddRoleManagerDropdownCommand {
    name = "dropdownAddRoleOnlyStudent"
    allowedRoles: RoleName[] = ["Student"]
}
