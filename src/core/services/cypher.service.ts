import * as bcrypt from 'bcryptjs';

export class CypherService {
    static hash(text: string): Promise<string> {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hash(text, salt);
    }

    static compare(text: string, hash: string): Promise<boolean> {
        return bcrypt.compare(text, hash);
    }
}