import { createTransport, Transporter } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { Message } from "./interfaces"

export class Mailer {
<<<<<<< HEAD
    private readonly ctx: Transporter<SMTPTransport.SentMessageInfo>
=======
    private ctx: Transporter<SMTPTransport.SentMessageInfo>;
>>>>>>> main

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
<<<<<<< HEAD
            secure,
=======
            secure: false,
>>>>>>> main
            auth: {
                user: username,
                pass: password,
            },
<<<<<<< HEAD
            authMethod: ",",
            tls: {
                rejectUnauthorized: false,
            },
=======
            tls: {
                rejectUnauthorized: false,
            },
        });

        this.ctx.verify((err, _) => {
            if (err)
                throw err
>>>>>>> main
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
