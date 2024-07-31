import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async createUser(user: CreateUserDto) {
    return this.prisma.user.create({
      data: user,
    });
  }

  async deleteUser(userId: string) {
    const companyUser = await this.prisma.companyUser.findUnique({
      where: { userId: userId },
    });

    if (!companyUser) {
      return this.prisma.user.delete({
        where: { id: userId },
      });
    }

    const companyUsersCount = await this.prisma.companyUser.count({
      where: {
        companyId: companyUser.companyId,
      },
    });

    if (companyUsersCount <= 1) {
      await this.prisma.companyUser.deleteMany({
        where: { companyId: companyUser.companyId },
      });

      await this.prisma.company.delete({
        where: {
          id: companyUser.companyId,
        },
      });
    } else {
      await this.prisma.companyUser.delete({
        where: { userId: userId },
      });
    }

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async updateUser(userId: string, user: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: user,
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const companyUser = await this.prisma.companyUser.findUnique({
      where: {
        userId: userId,
      },
      include: {
        company: true,
      },
    });

    return { user: user, company: companyUser?.company ?? {} };
  }
}
