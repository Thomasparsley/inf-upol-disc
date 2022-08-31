import { readFileSync } from "fs";

import { compile } from "handlebars";

const content = readFileSync("../templates/verification-email.html");
const template = compile(content.toString());

export function makeRegisterHTML(code: string[]) {
    return template({ code: code });
}
