import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ default: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ default: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ default: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
