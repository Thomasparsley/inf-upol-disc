import { ButtonCommand } from "../../command";

export const hostFirewallButtonComamand = new ButtonCommand(
    "btnHost",
    "Přidělí roli @host",
    async ({ replySilent }) => {
        await replySilent("Děkujeme..., bude Vám přidělena role @host");
    },
);
