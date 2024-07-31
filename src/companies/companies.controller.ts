import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseService } from '@speakbox/nestjs-firebase-admin';
import { Roles } from '../auth/role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { Role } from '../model/role.enum';
import { CompaniesService } from './companies.service';
import { CompanyUserDto } from './dto/company-user.dto';
import { CompanyDto } from './dto/company.dto';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreatePaymentDetailsDto } from './dto/create-payment-details.dto';
import { PaymentDetailsDto } from './dto/payment-details.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdatePaymentDetailsDto } from './dto/update-payment-details.dto';

@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/')
  @ApiOkResponse({ type: CompanyDto })
  @ApiOperation({
    operationId: 'createCompany',
  })
  createCompany(
    @Req() request: Request,
    @Body(new ValidationPipe()) company: CreateCompanyDto,
  ) {
    this.firebaseService.auth
      .getUserByEmail(request['user'].email)
      .then((user) => {
        const currentCustomClaims = user.customClaims;

        if (currentCustomClaims['roles']) {
          currentCustomClaims['roles'].push('admin');
        }

        return this.firebaseService.auth.setCustomUserClaims(
          user.uid,
          currentCustomClaims,
        );
      })
      .catch((e) => {
        console.error(e);
      });

    return this.companiesService.createCompanyDetails(company, request['user']);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin, Role.User])
  @Get('/my')
  @ApiOkResponse({ type: CompanyDto })
  @ApiOperation({
    operationId: 'getCurrentCompany',
  })
  getCurrentCompany(@Req() request: Request) {
    const userId = request['user'].user_id;

    return this.companiesService.getCompanyDetails(userId);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Put('/my')
  @ApiOkResponse({ type: CompanyDto })
  @ApiOperation({
    operationId: 'updateCurrentCompany',
  })
  updateCurrentCompany(
    @Req() request: Request,
    @Body(new ValidationPipe()) companyDetails: UpdateCompanyDto,
  ) {
    const userId = request['user'].user_id;

    return this.companiesService.updateCompanyDetails(companyDetails, userId);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Get('/my/users')
  @ApiOkResponse({ type: [CompanyUserDto] })
  @ApiOperation({
    operationId: 'getCurrentCompanyUsers',
  })
  getCurrentCompanyUsers(@Req() request: Request) {
    const userId = request['user'].user_id;

    return this.companiesService.getCompanyUsers(userId);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Post('/my/users/')
  @ApiOkResponse({ type: CompanyUserDto })
  @ApiOperation({
    operationId: 'createCurrentCompanyUser',
  })
  createCurrentCompanyUser(
    @Req() request: Request,
    @Body() user: CreateCompanyUserDto,
  ) {
    const requestUserId = request['user'].user_id;

    return this.companiesService.createCompanyUser(user, requestUserId);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Delete('/my/users/:userId')
  @ApiOkResponse({ type: CompanyUserDto })
  @ApiOperation({
    operationId: 'deleteCurrentCompanyUser',
  })
  deleteCurrentCompanyUser(
    @Req() request: Request,
    @Param('userId') userId: string,
  ) {
    const requestUserId = request['user'].user_id;

    return this.companiesService.deleteCompanyUser(userId, requestUserId);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin, Role.User])
  @Get('/my/payment-details')
  @ApiOkResponse({ type: PaymentDetailsDto })
  @ApiOperation({
    operationId: 'getCurrentCompanyPaymentDetails',
  })
  getCurrentPaymentDetails(@Req() request: Request) {
    const userId = request['user'].user_id;

    return this.companiesService.findPaymentDetails(userId);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Post('/my/payment-details')
  @ApiOkResponse({ type: PaymentDetailsDto })
  @ApiOperation({
    operationId: 'createCurrentCompanyPaymentDetails',
  })
  createCurrentPaymentDetails(
    @Req() request: Request,
    @Body(new ValidationPipe()) paymentDetails: CreatePaymentDetailsDto,
  ) {
    const userId = request['user'].user_id;

    return this.companiesService.createPaymentDetails(paymentDetails, userId);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Put('/my/payment-details')
  @ApiOkResponse({ type: PaymentDetailsDto })
  @ApiOperation({
    operationId: 'updateCurrentCompanyPaymentDetails',
  })
  updateCurrentCompanyPaymentDetails(
    @Req() request: Request,
    @Body(new ValidationPipe()) paymentDetails: UpdatePaymentDetailsDto,
  ) {
    const userId = request['user'].user_id;

    return this.companiesService.updatePaymentDetails(paymentDetails, userId);
  }
}
