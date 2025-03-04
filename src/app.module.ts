import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  FirebaseModule,
  FirebaseService,
} from '@speakbox/nestjs-firebase-admin';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthStrategy } from './auth/auth.strategy';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    FirebaseModule,
    UsersModule,
    CompaniesModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthStrategy, FirebaseService, PrismaService],
})
export class AppModule {}
