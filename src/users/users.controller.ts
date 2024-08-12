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
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileDto } from './dto/profile.dto';
import { RequestUserDto } from './dto/request-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.decorator';
import { UsersService } from './users.service';

@ApiBearerAuth('jwt')
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({
    operationId: 'createUser',
  })
  createUser(
    @User() requestUser: RequestUserDto,
    @Body(new ValidationPipe()) user: CreateUserDto,
  ) {
    this.firebaseService.auth
      .getUserByEmail(requestUser.email)
      .then((user) => {
        return this.firebaseService.auth.setCustomUserClaims(user.uid, {
          roles: ['user'],
        });
      })
      .catch((e) => {
        console.error(e);
      });

    return this.usersService.createUser(user);
  }

  @Delete('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({
    operationId: 'deleteCurrentUser',
  })
  deleteCurrentUser(@User() requestUser: RequestUserDto) {
    this.firebaseService.auth.deleteUser(requestUser.user_id);

    return this.usersService.deleteUser(requestUser.user_id);
  }

  @Put('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({
    operationId: 'updateCurrentUser',
  })
  updateCurrentUser(
    @User() requestUser: RequestUserDto,
    @Body(new ValidationPipe()) user: UpdateUserDto,
  ) {
    return this.usersService.updateUser(requestUser.user_id, user);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({
    operationId: 'getCurrentUser',
  })
  getCurrentUser(@User() requestUser: RequestUserDto) {
    return this.usersService.findUser(requestUser.user_id);
  }

  @Get('/me/profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: ProfileDto })
  @ApiOperation({
    operationId: 'getCurrentUserProfile',
  })
  getProfile(@User() requestUser: RequestUserDto) {
    return this.usersService.getProfile(requestUser.user_id);
  }

  @Get(':email/exists')
  @ApiOkResponse({ type: Boolean })
  @ApiOperation({
    operationId: 'getUserExistsByEmail',
  })
  async getUserExistsByEmail(@Param('email') email: string) {
    return (await this.usersService.emailExists(email)) >= 1;
  }
}
