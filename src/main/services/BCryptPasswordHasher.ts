import { IPasswordHasher } from "./IPasswordHasher";
import bcrypt from 'bcrypt'

export class BCryptPasswordHasher implements IPasswordHasher {
    hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }
    
    check(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }
}