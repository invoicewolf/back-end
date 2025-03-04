import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { RequestUserDto } from '../users/dto/request-user.dto';
import { User } from '../users/user.decorator';
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
    @User() requestUser: RequestUserDto,
    @Body(new ValidationPipe()) company: CreateCompanyDto,
  ) {
    this.firebaseService.auth
      .getUserByEmail(requestUser.email)
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

    return this.companiesService.createCompanyDetails(
      company,
      requestUser.user_id,
    );
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin, Role.User])
  @Get('/my')
  @ApiOkResponse({ type: CompanyDto })
  @ApiOperation({
    operationId: 'getCurrentCompany',
  })
  getCurrentCompany(@User() requestUser: RequestUserDto) {
    return this.companiesService.getCompanyDetails(requestUser.user_id);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Put('/my')
  @ApiOkResponse({ type: CompanyDto })
  @ApiOperation({
    operationId: 'updateCurrentCompany',
  })
  updateCurrentCompany(
    @User() requestUser: RequestUserDto,
    @Body(new ValidationPipe()) companyDetails: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompanyDetails(
      companyDetails,
      requestUser.user_id,
    );
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Get('/my/users')
  @ApiOkResponse({ type: [CompanyUserDto] })
  @ApiOperation({
    operationId: 'getCurrentCompanyUsers',
  })
  getCurrentCompanyUsers(@User() requestUser: RequestUserDto) {
    return this.companiesService.getCompanyUsers(requestUser.user_id);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Post('/my/users/')
  @ApiOkResponse({ type: CompanyUserDto })
  @ApiOperation({
    operationId: 'createCurrentCompanyUser',
  })
  createCurrentCompanyUser(
    @User() requestUser: RequestUserDto,
    @Body() user: CreateCompanyUserDto,
  ) {
    return this.companiesService.createCompanyUser(user, requestUser.user_id);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Delete('/my/users/:userId')
  @ApiOkResponse({ type: CompanyUserDto })
  @ApiOperation({
    operationId: 'deleteCurrentCompanyUser',
  })
  deleteCurrentCompanyUser(
    @User() requestUser: RequestUserDto,
    @Param('userId') userId: string,
  ) {
    return this.companiesService.deleteCompanyUser(userId, requestUser.user_id);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin, Role.User])
  @Get('/my/payment-details')
  @ApiOkResponse({ type: PaymentDetailsDto })
  @ApiOperation({
    operationId: 'getCurrentCompanyPaymentDetails',
  })
  getCurrentPaymentDetails(@User() requestUser: RequestUserDto) {
    return this.companiesService.findPaymentDetails(requestUser.user_id);
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Post('/my/payment-details')
  @ApiOkResponse({ type: PaymentDetailsDto })
  @ApiOperation({
    operationId: 'createCurrentCompanyPaymentDetails',
  })
  createCurrentPaymentDetails(
    @User() requestUser: RequestUserDto,
    @Body(new ValidationPipe()) paymentDetails: CreatePaymentDetailsDto,
  ) {
    return this.companiesService.createPaymentDetails(
      paymentDetails,
      requestUser.user_id,
    );
  }

  @UseGuards(RoleGuard)
  @Roles([Role.Admin])
  @Put('/my/payment-details')
  @ApiOkResponse({ type: PaymentDetailsDto })
  @ApiOperation({
    operationId: 'updateCurrentCompanyPaymentDetails',
  })
  updateCurrentCompanyPaymentDetails(
    @User() requestUser: RequestUserDto,
    @Body(new ValidationPipe()) paymentDetails: UpdatePaymentDetailsDto,
  ) {
    return this.companiesService.updatePaymentDetails(
      paymentDetails,
      requestUser.user_id,
    );
  }
}
