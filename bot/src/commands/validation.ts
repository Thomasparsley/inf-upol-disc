import { SlashCommandBuilder } from "@discordjs/builders";

import { VOC_HasNotPermission } from "../vocabulary";
import { Validation } from "../models";
import { Command } from "../command";
import { GuildMemberRoleManager } from "discord.js";
import { Result } from "../result";

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
            return Result.err(VOC_HasNotPermission.toError());
        }

        const userInput = interaction.options.getString(RequiredKeyOptionName) as string;

        const validationFinder = await Validation.findAndCountBy({
            key: userInput,
            user: interaction.user.id,
        })

        if (validationFinder[1] === 0) {
            return Result.err("Nemáte validní klíč.".toError());
        }

        const validation = validationFinder[0][0];

        if (validation.expiresAt.getTime() < Date.now()) {
            return Result.err("Validační klíč vypršel.".toError());
        }

        const roles = (interaction.member?.roles as GuildMemberRoleManager);

        if (!roles) {
            return Result.err("Error: validation#1".toError());
        }

        return Result.ok([
            roles.add(StudentID),
            validation.remove(),
            replySilent("Úspěšně jste se ověřil/a."),
        ]);
    },
);
