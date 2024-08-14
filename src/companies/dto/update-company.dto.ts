import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({ default: 'admin@example.com' })
  @IsNotEmpty()
  @IsEmail()
  companyEmail: string;

  @ApiProperty({ default: 'example.com' })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiPropertyOptional({ default: '93056589', nullable: true })
  @IsOptional()
  @IsString()
  companyNumber: string | null;

  @ApiPropertyOptional({ default: 'NL123456789B01', nullable: true })
  @IsOptional()
  @IsString()
  taxNumber: string | null;

  @ApiProperty({ default: 'Example Street' })
  @IsNotEmpty()
  @IsString()
  streetName: string;

  @ApiProperty({ default: '11' })
  @IsNotEmpty()
  @IsString()
  houseNumber: string;

  @ApiPropertyOptional({ default: 'E', nullable: true })
  @IsOptional()
  @IsString()
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
