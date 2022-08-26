import { CacheType, Interaction } from "discord.js"

import { OnInteractionCreateArgs } from "../interfaces"
import { UnknownCommandError } from "../errors"
import { DropdownCommand, InteractionCommand } from "../command"

async function event(args: OnInteractionCreateArgs) {
    const { client, interaction, mailer, commands, buttons, modals, dropdown } = args

    let command: InteractionCommand<Interaction<CacheType>> | undefined
    if (interaction.isButton()) {
        command = buttons.get(interaction.customId)
    } else if (interaction.isModalSubmit()) {
        command = modals.get(interaction.customId)
    } else if (interaction.isSelectMenu()) {
        const splited = interaction.customId.split("-")
        const customId = splited[0]
        const flag = splited[1]

        command = dropdown.get(customId);
        (command as DropdownCommand).flag = flag
    } else if (interaction.isChatInputCommand()) {
        command = commands.get(interaction.commandName)
    }


    if (!command)
        throw new UnknownCommandError()

    await command.execute(client, mailer, interaction)
}

export default event


