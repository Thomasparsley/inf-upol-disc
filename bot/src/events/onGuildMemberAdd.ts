import { OnGuildMemberAddAction } from "../types";

const event: OnGuildMemberAddAction = async ({ member }) => {
    await member.send("Ahoj!");
}

export default event
