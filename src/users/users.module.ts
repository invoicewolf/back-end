import { Module } from '@nestjs/common';
import {
  FirebaseModule,
  FirebaseService,
} from '@speakbox/nestjs-firebase-admin';
import { AuthStrategy } from '../auth/auth.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [FirebaseModule],
  controllers: [UsersController],
  providers: [UsersService, AuthStrategy, FirebaseService, PrismaService],
})
export class UsersModule {}
