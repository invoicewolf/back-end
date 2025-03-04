import { ApiProperty } from '@nestjs/swagger';
import { Currencies } from '@prisma/client';
import {
  IsDate,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsIBAN,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

const languages = ['en-US', 'en-GB', 'nl-NL'] as const;

enum languageEnum {
  nl_NL = 'nl-NL',
  en_US = 'en-US',
  en_GB = 'en-GB',
}

type languageType = typeof languages;

class AddressDetails {
  @ApiProperty({ default: 'Example Street' })
  @IsNotEmpty()
  @IsString()
  streetName: string;

  @ApiProperty({ default: '11' })
  @IsNotEmpty()
  @IsString()
  houseNumber: string;

  @ApiProperty({ default: 'E', nullable: true })
  @IsString()
  @ValidateIf((_, value) => value !== null)
  addition: string | null;

  @ApiProperty({ default: '1234AB' })
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @ApiProperty({ default: 'Amsterdam' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ default: 'The Netherlands' })
  @IsNotEmpty()
  @IsString()
  country: string;
}

class InvoiceCompanyDetailsDto extends AddressDetails {
  @ApiProperty({ default: 'admin@example.com' })
  @IsNotEmpty()
  @IsEmail()
  companyEmail: string;

  @ApiProperty({ default: 'example.com' })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ default: '93056589', nullable: true })
  @IsString()
  @ValidateIf((_, value) => value !== null)
  companyNumber: string | null;

  @ApiProperty({ default: 'NL123456789B01', nullable: true })
  @IsString()
  @ValidateIf((_, value) => value !== null)
  taxNumber: string | null;
}

class InvoiceAddresseeDetailsDto extends AddressDetails {
  @ApiProperty({ default: 'example.com' })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ default: null, nullable: true })
  @IsString()
  @ValidateIf((_, value) => value !== null)
  attention: string | null;

  @ApiProperty({ default: null, nullable: true })
  @IsString()
  @ValidateIf((_, value) => value !== null)
  subject: string | null;
}

class InvoiceProductDto {
  @ApiProperty({ default: 'Example Product' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @ApiProperty({ default: 19.95 })
  @IsNotEmpty()
  @IsDecimal()
  tariff: number;

  @ApiProperty({ default: 21 })
  @IsNotEmpty()
  @IsInt()
  taxRate: number;

  @ApiProperty({ default: 19.95 })
  @IsNotEmpty()
  @IsDecimal()
  cost: number;
}

class InvoicePriceDto {
  @ApiProperty({ default: 19.95 })
  @IsNotEmpty()
  @IsDecimal()
  subtotal: number;

  @ApiProperty({ default: 4.19 })
  @IsNotEmpty()
  @IsDecimal()
  taxAmount: number;

  @ApiProperty({ default: 24.14 })
  @IsNotEmpty()
  @IsDecimal()
  total: number;
}

class BasePaymentDetailsDto {
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

class InvoicePaymentDetailsDto extends BasePaymentDetailsDto {
  @ApiProperty({ default: new Date(), type: 'string', format: 'date-time' })
  @IsNotEmpty()
  @IsDate()
  invoiceDate: Date;

  @ApiProperty({ default: new Date(), type: 'string', format: 'date-time' })
  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @ApiProperty({ default: '00000' })
  @IsNotEmpty()
  @IsString()
  invoiceNumber: string;
}

export class InvoiceDto {
  @ApiProperty({ type: InvoiceCompanyDetailsDto })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  companyDetails: InvoiceCompanyDetailsDto;

  @ApiProperty({ type: InvoiceAddresseeDetailsDto })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  addresseeDetails: InvoiceAddresseeDetailsDto;

  @ApiProperty({ type: InvoiceProductDto, isArray: true })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  products: InvoiceProductDto[];

  @ApiProperty({ type: InvoicePriceDto })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  price: InvoicePriceDto;

  @ApiProperty({ type: InvoicePaymentDetailsDto })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  paymentDetails: InvoicePaymentDetailsDto;

  @ApiProperty({ default: 'en-GB', enum: languageEnum })
  @IsNotEmpty()
  @IsString()
  language: languageType;
}
