import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyUserDto {
  @ApiProperty({ default: 'abcdefghijklmnopqrstuvwxyzaa' })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
