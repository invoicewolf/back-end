import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateCompanyDto {
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
