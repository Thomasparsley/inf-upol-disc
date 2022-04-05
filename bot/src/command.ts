import { EventAction } from "./event";

export class Command {
    name: string
    description: string
    action: EventAction

    constructor(
        name: string,
        description: string,
        action: EventAction,
    ) {
        this.name = name;
        this.description = description;
        this.action = action;
    }
}
