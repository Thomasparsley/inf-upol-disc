import { OnGuildMemberAddAction } from "../bot";

const event: OnGuildMemberAddAction = async ({ member }) => {
    await member.send("Ahoj!");
}

export default event
