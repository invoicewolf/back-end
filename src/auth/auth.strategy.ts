import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RequestUserDto } from '../users/dto/request-user.dto';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: async function secretOrKeyProvider(
        _,
        rawJwtToken: string,
        done: (err: null, secret: string) => void,
      ) {
        const keys = await (
          await fetch(
            'https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com',
          )
        ).json();

        const decodedToken = JSON.parse(
          Buffer.from(rawJwtToken.split('.')[0], 'base64').toString(),
        );
        const kid = decodedToken.kid;

        const secretOrKey = keys[kid];
        if (!secretOrKey) {
          throw new Error('Key not found for kid: ' + kid);
        }

        done(null, secretOrKey);
      },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(payload: any) {
    return new RequestUserDto(payload);
  }
}
