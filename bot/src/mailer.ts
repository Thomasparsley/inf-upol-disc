import { createTransport, Transporter } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { Message } from "./interfaces"

export class Mailer {
    private readonly ctx: Transporter<SMTPTransport.SentMessageInfo>

    constructor(
        private readonly host: string,
        private readonly port: number,
        private readonly from: string,
        username: string,
        password: string,
    ) {
        this.ctx = createTransport({
            host: this.host,
            port: this.port,
            secure: false,
            auth: {
                user: username,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        this.ctx.verify((err, _) => {
            if (err)
                throw err
            else
                console.log("Email connected")
        })
    }

    async send(message: Message): Promise<SMTPTransport.SentMessageInfo> {
        return await this.ctx.sendMail({
            from: this.from,
            to: message.to,
            subject: message.subject,
            text: message.text,
            html: message.html,
        })
    }
}
