import { Module } from '@nestjs/common';
import {
  FirebaseModule,
  FirebaseService,
} from '@speakbox/nestjs-firebase-admin';
import { AuthStrategy } from '../auth/auth.strategy';
import { CipherService } from '../cipher/cipher.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  imports: [FirebaseModule],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    AuthStrategy,
    FirebaseService,
    PrismaService,
    CipherService,
  ],
})
export class CompaniesModule {}
