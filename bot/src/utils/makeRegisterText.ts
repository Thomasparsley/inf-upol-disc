import { readFileSync } from "fs";

import { compile } from "handlebars";

const content = readFileSync("../templates/verification-email.txt");
const template = compile(content.toString());

export function makeRegisterText(code: string[]) {
    return template({ code: code });
}
