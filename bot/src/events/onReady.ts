import { OnReadyAction } from "../types";

import slugify from "slugify";
import { SelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ModalBuilder } from "@discordjs/builders";

const event: OnReadyAction = async ({ client }) => {
    if (!client.user) {
        return;
    }

    console.log(`Logged in as ${client.user.tag}!`);
}

export default event
