import { ModalBuilder } from "discord.js";
import { ButtonCommand } from "../../command";

export const hostComamand = new ButtonCommand(
    "",
    "cd.description",
    async ({ replySilent }) => {
        await replySilent("Děkujeme..., bude Vám přidělena role @host");
    },
);
