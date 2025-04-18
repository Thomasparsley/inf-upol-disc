import { OnReactionAddAction } from "../types"

/**
 * Function that runs when a new reaction is added to a message
 * @param args Argument representing the event of reaction being added
 */
export const onReactionAdd: OnReactionAddAction = async ({ reactionMessages, reaction, user }) => {
    if(user.bot){
        return;
    }
    
    const messageId = reaction.message.id
    if(!reactionMessages.has(messageId)){
        return;
    }

    const removeAction = reaction.users.remove(user.id)

    const reactionBinds = reactionMessages.get(messageId)!
    const guild = reaction.message.guild!
    const roleName = reactionBinds.get(reaction.emoji.toString())
    
    if(roleName !== undefined){
        const role = await guild.roles.cache.find(role => role.name === roleName)!.id
        const gulidMember = await guild.members.fetch(user.id)

        if(gulidMember.roles.cache.has(role)){
            await gulidMember.roles.remove(role)
        }
        else {
            await gulidMember.roles.add(role)
        }
    }

    await removeAction;
}
