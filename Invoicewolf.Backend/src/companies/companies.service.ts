import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CipherService } from '../cipher/cipher.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreatePaymentDetailsDto } from './dto/create-payment-details.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private cipher: CipherService,
  ) {}

  async getCompanyDetails(userId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!companyUser) {
      throw new UnauthorizedException();
    }

    return this.prisma.company.findUnique({
      where: {
        id: companyUser.companyId,
      },
    });
  }

  async updateCompanyDetails(companyDetails: UpdateCompanyDto, userId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!companyUser) {
      throw new UnauthorizedException();
    }

    return this.prisma.company.update({
      where: {
        id: companyUser.companyId,
      },
      data: companyDetails,
    });
  }

  async createCompanyDetails(company: CreateCompanyDto, userId: string) {
    const newCompany = await this.prisma.company.create({
      data: {
        companyName: company.companyName,
        companyNumber: company.companyNumber,
        companyEmail: company.companyEmail,
        taxNumber: company.taxNumber,
        zipCode: company.zipCode,
        houseNumber: company.houseNumber,
        addition: company.addition,
        streetName: company.streetName,
        city: company.city,
        country: company.country,
      },
    });

    const companyUser = await this.prisma.companyUser.create({
      data: {
        userId: userId,
        companyId: newCompany.id,
      },
    });

    return { company: newCompany, companyUser: companyUser };
  }

  async createPaymentDetails(company: CreatePaymentDetailsDto, userId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!companyUser) {
      throw new UnauthorizedException();
    }

    return this.prisma.paymentDetails.create({
      data: {
        companyId: companyUser.companyId,
        iban: this.cipher.encrypt(company.iban),
        currency: company.currency,
      },
    });
  }

  async updatePaymentDetails(company: CreatePaymentDetailsDto, userId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!companyUser) {
      throw new UnauthorizedException();
    }

    return this.prisma.paymentDetails.update({
      where: { id: companyUser.companyId },
      data: {
        iban: this.cipher.encrypt(company.iban),
        currency: company.currency,
      },
    });
  }

  async findPaymentDetails(userId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!companyUser) {
      throw new UnauthorizedException();
    }

    const paymentDetails = await this.prisma.paymentDetails.findUnique({
      where: {
        companyId: companyUser.companyId,
      },
    });

    paymentDetails.iban = this.cipher.decrypt(paymentDetails.iban);

    return paymentDetails;
  }

  async getCompanyUsers(userId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!companyUser) {
      throw new UnauthorizedException();
    }

    return this.prisma.companyUser.findMany({
      where: {
        companyId: companyUser.companyId,
      },
      include: {
        user: {},
      },
    });
  }

  async createCompanyUser(user: CreateCompanyUserDto, requestUserId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId: requestUserId,
      },
    });

    if (!companyUser) {
      throw new UnauthorizedException();
    }

    const userToAdd = await this.prisma.user.findUnique({
      where: {
        id: user.userId,
      },
    });

    if (!userToAdd) {
      throw new NotFoundException();
    }

    const companyUserExists = await this.prisma.companyUser.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (companyUserExists) {
      throw new ConflictException();
    }

    return this.prisma.companyUser.create({
      data: {
        companyId: companyUser.companyId,
        userId: userToAdd.id,
      },
    });
  }

  async deleteCompanyUser(userId: string, requestUserId: string) {
    if (userId === requestUserId) {
      throw new ConflictException();
    }

    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId: requestUserId,
      },
    });

    if (!companyUser) {
      throw new UnauthorizedException();
    }

    const userToDelete = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userToDelete) {
      throw new NotFoundException();
    }

    const companyUserExists = await this.prisma.companyUser.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!companyUserExists) {
      throw new NotFoundException();
    }

    return this.prisma.companyUser.delete({
      where: {
        companyId: companyUser.companyId,
        userId: userId,
      },
    });
  }
}
