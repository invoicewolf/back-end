import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

interface IZipCode {
  street: string;
  city: string;
  country: string;
}

export class ZipCodeDto {
  @ApiProperty({ default: 'Example Street' })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ default: 'Amsterdam' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ default: 'Nederland' })
  @IsNotEmpty()
  @IsString()
  country: string;

  constructor(zipCode: IZipCode) {
    this.street = zipCode.street;
    this.city = zipCode.city;
    this.country = zipCode.country;
  }
}
