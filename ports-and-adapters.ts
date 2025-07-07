type ISentEmail = {
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean
}

abstract class AbstractSentEmail {
    abstract send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean
}

//class SentEmailByGMail implements ISentEmail {
class SentEmailByGMail extends AbstractSentEmail {
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean {
        const domain = this.getDomain()
        console.log("Email sent by GMail")
        return true
    }

    private getDomain() {
        return "smtp.mydomain.com"
    }
}

//class SentEmailByOffice365 implements ISentEmail {
class SentEmailByOffice365 extends AbstractSentEmail {
    send(sender: string, subject: string, body: string, isHtml: boolean, receiver: string): boolean {
        const bodySanatize = this.sanatize(body)
        console.log("Email sent by Office365")
        return true
    }

    private getProtocol() {
        return "imap"
    }

    private sanatize(body: string) {
        return body.replace(/"/, "'")
    }
}

class SentEmail {
    constructor(private readonly service: ISentEmail) { }

    sent(sender: string, subject: string, body: string, isHtml: boolean, receiver: string) {
        this.service.send(sender, subject, body, isHtml, receiver)
    }
}

const service: ISentEmail = new SentEmailByOffice365()
const sentEmail = new SentEmail(service)
sentEmail.sent("sergio@correo.com", "Bienvenido", "Bienvenido a nuestra comunidad", true, "new@email.com")

