import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";


export class Message {
    private host: string;
    private port: number;
    private from: string;
    private ctx: Transporter<SMTPTransport.SentMessageInfo>;
    
    constructor(config: Config) {
        this.host = config.host;
        this.port = config.port;
        this.from = config.from;

        this.ctx = createTransport({
            host: this.host,
            port: this.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.pass
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

export interface Config {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
}

export interface Message {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}