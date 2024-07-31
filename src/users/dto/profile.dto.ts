import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';
import { CompanyDto } from '../../companies/dto/company.dto';
import { UserDto } from './user.dto';

export class ProfileDto {
  @ApiProperty({ default: UserDto })
  @IsNotEmpty()
  @IsObject()
  user: UserDto;

  @ApiProperty({ default: CompanyDto })
  @IsNotEmpty()
  @IsObject()
  company: CompanyDto;
}
