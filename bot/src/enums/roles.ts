import { RoleName } from "../types";

type RoleIdMap = {
    [role in RoleName]: string;
}

export const RoleIds: RoleIdMap = {
    "Root": "960452395312234537",
    "Moderátor": "960478652494118952",
    "Student": "960478701684936734",
    "Katedra": "960478879686991872",
    "Návštěva": "960478789161320448",
    "PhD.": "962390039168442419",
};
