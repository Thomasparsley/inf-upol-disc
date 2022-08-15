import { ButtonCommand } from "../../command";

export const hostComamand = new ButtonCommand(
    "",
    "cd.description",
    async ({ replySilent }) => {
        await replySilent("Děkujeme..., Kontaktujte...");
    },
);
