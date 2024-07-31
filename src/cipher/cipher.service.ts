import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

@Injectable()
export class CipherService {
  #key = Buffer.from(process.env.DATABASE_AES_256_KEY, 'hex');

  encrypt(val: string) {
    const vector = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', this.#key, vector);
    let encrypted = cipher.update(val, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${vector.toString('hex')}:${encrypted}`;
  }

  decrypt(val: string) {
    const textParts = val.split(':');
    const vector = Buffer.from(textParts[0], 'hex');
    const encrypted = textParts[1];

    const decipher = crypto.createDecipheriv('aes-256-cbc', this.#key, vector);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
