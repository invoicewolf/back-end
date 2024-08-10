import { Injectable, NotFoundException } from '@nestjs/common';
import { ZipCodeDto } from './dto/zip-code.dto';

@Injectable()
export class AppService {
  async getZipCode(zipCode: string, houseNumber: string) {
    const res = await fetch(
      `https://json.api-postcode.nl?postcode=${zipCode}&number=${houseNumber}`,
      {
        headers: { token: '07045011-d59a-41e8-b99b-ca4e9f25711a' },
      },
    );

    if (res.ok) {
      const data = await res.json();

      return new ZipCodeDto({ ...data, country: 'Nederland' });
    }

    throw new NotFoundException();
  }

  async getBoldFont() {
    const regularUrl =
      'https://github.com/openmaptiles/fonts/blob/0bcd6431ec82fbb74b3a5b697ce315ebf795ad8e/open-sans/OpenSans-Regular.ttf';
    return await fetch(regularUrl);
  }
}
