import * as bcrypt from 'bcrypt';
import { PasswordServiceInterface } from './PasswordServiceInterface';
import { injectable } from 'inversify';

// For node's bcrypt implementation this is (2^ROUNDS) of hashes calculated.
const ROUNDS = 10;

@injectable()
export class PasswordService implements PasswordServiceInterface {
    
    getHash(password: string): Promise<string> {
        return  bcrypt.hash(password || '', ROUNDS);
    }

    passwordMatches(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password || '', hash);
    }
    
}
