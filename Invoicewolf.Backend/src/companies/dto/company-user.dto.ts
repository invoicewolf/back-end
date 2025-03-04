import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

export class CompanyUserDto {
  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty({ default: 'abcdefghijklmnopqrstuvwxyzaa' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ default: UserDto })
  @IsNotEmpty()
  @IsObject()
  user: UserDto;
}
