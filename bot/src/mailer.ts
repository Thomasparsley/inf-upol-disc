import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Message } from "./interfaces";

export class Mailer {
    private ctx: Transporter<SMTPTransport.SentMessageInfo>;
    
    constructor(
        private readonly host: string,
        private readonly port: number,
        private readonly from: string,
        secure: boolean,
        username: string,
        password: string,
    ) {

        this.ctx = createTransport({
            host: this.host,
            port: this.port,
            secure: secure,
            auth: {
                user: username,
                pass: password,
            },
            authMethod: ",",
            tls: {
                rejectUnauthorized: false,

            },
        });
    }

    async send(message: Message): Promise<SMTPTransport.SentMessageInfo> {
        return await this.ctx.sendMail({
            from: this.from,
            to: message.to,
            subject: message.subject,
            text: message.text,
            html: message.html
        });
    }
}
