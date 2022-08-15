import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMemberRoleManager } from "discord.js";

import { VOC_VerificationSuccessful } from "../vocabulary";
import { BadInputForChatCommandError, UnauthorizedError } from "../errors";
import { Validation } from "../models";
import { CD_Validation as cd } from "../cd";
import { ChatInputCommand } from "../command";
import { Role } from "../enums";

export const validationCommand = new ChatInputCommand(
    cd.name,
    cd.description,
    new SlashCommandBuilder()
        .addStringOption(option => {
            return option
                .setName(cd.options[0].name)
                .setDescription(cd.options[0].description)
                .setRequired(true);
        }),
    async ({ interaction, replySilent, permissionRolesCount }) => {
        if (!interaction.isChatInputCommand())
            throw new BadInputForChatCommandError();

        const hasPermission = permissionRolesCount((size: Number) => size === 1);
        if (!hasPermission) 
            throw new UnauthorizedError();

        const userInput = interaction.options.getString(cd.options[0].name) as string;

        const validationFinder = await Validation.findAndCountBy({
            key: userInput,
            user: interaction.user.id,
        })

        if (validationFinder[1] === 0) 
            throw "Nemáte validní klíč.".toError();

        const validation = validationFinder[0][0];
        if (validation.expiresAt.getTime() < Date.now()) throw "Validační klíč vypršel.".toError();

        const roles = (interaction.member?.roles as GuildMemberRoleManager);
        if (!roles)
            throw "validation#1".toError();

        await roles.add(Role.Student);
        await validation.remove();
        await replySilent(VOC_VerificationSuccessful);
    },
);
