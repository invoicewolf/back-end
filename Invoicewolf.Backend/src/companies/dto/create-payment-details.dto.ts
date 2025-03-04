import { ApiProperty } from '@nestjs/swagger';
import { Currencies } from '@prisma/client';
import { IsEnum, IsIBAN, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDetailsDto {
  @ApiProperty({ default: 'GB82WEST12345698765432' })
  @IsNotEmpty()
  @IsString()
  @IsIBAN()
  iban: string;

  @ApiProperty({ default: 'EUR', enum: Currencies })
  @IsNotEmpty()
  @IsEnum(Currencies)
  currency: Currencies;
}
