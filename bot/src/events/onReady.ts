import { OnReadyAction } from "../types";

import slugify from "slugify";
import { SelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ModalBuilder } from "@discordjs/builders";

const event: OnReadyAction = async ({ client }) => {
    if (!client.user) {
        return;
    }

    console.log(`Logged in as ${client.user.tag}!`);

    // Dropdown
    {
        const channel = client.channels.cache.get("960452395312234545");
        if (!channel)
            return;

        if (!channel.isTextBased())
            return;

        const msg = await channel.messages.fetch("964816519647342632");
        if (!msg)
            return;

        const Roles = [
            "@Bc. Informatika",
            "@Bc. IT",
            "@Bc. Informatika pro vzdělávání",
            "@Bc. Programování a vývoj sw",
            "@Bc. Obecná informatika",
            "@Bc. IT KOMBI",
            "@Mgr. Obecná informatika",
            "@Mgr. Počítačové systémy a technologie",
            "@Mgr. Vývoj software",
            "@Mgr. Umělá inteligence",
            "@Mgr. Učitelství informatiky pro střední školy",
        ];

        let RolesOBJ: any[] = [];
        for (const role of Roles) {
            RolesOBJ.push({
                label: role,
                value: slugify(role),
            });
        }

        const menu = new SelectMenuBuilder()
            .setCustomId("selectRole")
            .setPlaceholder("Vyber si obory")
            .setMinValues(1)
            .setMaxValues(Roles.length)
            .addOptions(RolesOBJ);

        const row = new ActionRowBuilder()
            .addComponents(menu);

        // @ts-ignore
        await msg.edit({ components: [row] });
    }

    // Modal
    {
        const channel = client.channels.cache.get("962442923868315669");
        if (!channel)
            return;

        if (!channel.isTextBased())
            return;

        const msg = await channel.messages.fetch("963455922036957294");
        if (!msg)
            return;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('host')
                    .setLabel('Jsem návštěva')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('student')
                    .setLabel('Jsem student')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('teacher')
                    .setLabel('Jsem katedra')
                    .setStyle(ButtonStyle.Danger),
            );

        // @ts-ignore
        await msg.edit({ components: [row] });
    }   
}

export default event
