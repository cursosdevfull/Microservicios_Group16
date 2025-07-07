import { SentEmailByOffice365 } from "./modules/utils/email/adapters/sent-email-offcie365.adapter";
import type { ISentEmail } from "./modules/utils/email/ports/sent-email.interface";
import { SentEmail } from "./modules/utils/email/sent-email";

const service: ISentEmail = new SentEmailByOffice365()
const sentEmail = new SentEmail(service)
sentEmail.sent("sergio@correo.com", "Bienvenido", "Bienvenido a nuestra comunidad", true, "new@email.com")