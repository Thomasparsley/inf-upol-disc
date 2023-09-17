import { readFileSync } from "fs";

import { compile } from "handlebars";

const content = readFileSync("../templates/verification-email.txt");
const template = compile(content.toString());

/**
 * Creates text for the given verification code using a template
 * @param code String array representing the code
 * @returns Text generated using the template
 */
export function makeRegisterText(code: string[]) {
    return template({ code: code });
}
