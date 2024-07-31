import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({ default: 'admin@example.com' })
  @IsNotEmpty()
  @IsEmail()
  companyEmail: string;

  @ApiProperty({ default: 'example.com' })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiPropertyOptional({ default: '93056589' })
  @IsString()
  companyNumber?: string;

  @ApiPropertyOptional({ default: 'NL123456789B01' })
  @IsString()
  taxNumber?: string;

  @ApiProperty({ default: 'Example Street' })
  @IsNotEmpty()
  @IsString()
  streetName: string;

  @ApiProperty({ default: '11' })
  @IsNotEmpty()
  @IsString()
  houseNumber: string;

  @ApiPropertyOptional({ default: 'E' })
  addition?: string;

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
