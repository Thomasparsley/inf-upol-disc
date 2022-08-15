import { ButtonCommand } from "../../command";

export const departmentFirewallButtonComamand = new ButtonCommand(
    "bntDepartment",
    "cd.description",
    async ({ replySilent }) => {
        await replySilent("Děkujeme..., Kontaktujte...");
    },
);
