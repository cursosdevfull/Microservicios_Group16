import type { ISentEmail } from "./ports/sent-email.interface";

export class SentEmail {
    constructor(private readonly service: ISentEmail) { }

    sent(sender: string, subject: string, body: string, isHtml: boolean, receiver: string) {
        this.service.send(sender, subject, body, isHtml, receiver)
    }
}