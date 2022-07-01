import { SlashCommandBuilder } from "@discordjs/builders";

import { VOC_HasNotPermission } from "../vocabulary";
import { Validation } from "../models";
import { Command } from "../command";
import { GuildMemberRoleManager } from "discord.js";
import { Err, Ok } from "../result";

const StudentID = "960478701684936734";
const RequiredKeyOptionName = "key";

export const validationCommand = new Command(
    "validace",
    "Tento příkaz slouží k validaci účtu.",
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(RequiredKeyOptionName)
                .setDescription("Zadejte validační klíč. Pokud nemáš klíč tak použí příkaz register.")
                .setRequired(true);
        }),
    async ({ interaction, replySilent, permissionRolesCount }) => {

        const hasPermission = await permissionRolesCount((size: Number) => size === 1);
        if (!hasPermission) {
            return Err(VOC_HasNotPermission);
        }

        const userInput = interaction.options.getString(RequiredKeyOptionName) as string;

        const validationFinder = await Validation.findAndCountBy({
            key: userInput,
            user: interaction.user.id,
        })

        if (validationFinder[1] === 0) {
            return Err("Nemáte validní klíč.");
        }

        const validation = validationFinder[0][0];

        if (validation.expiresAt.getTime() < Date.now()) {
            return Err("Validační klíč vypršel.");
        }

        const roles = (interaction.member?.roles as GuildMemberRoleManager);

        if (!roles) {
            return Err("Error: validation#1");
        }

        return Ok([
            roles.add(StudentID),
            validation.remove(),
            replySilent("Úspěšně jste se ověřil/a."),
        ]);
    },
);
