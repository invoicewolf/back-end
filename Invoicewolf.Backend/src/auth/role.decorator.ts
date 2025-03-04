import { Reflector } from '@nestjs/core';
import { Role } from '../model/role.enum';

export const Roles = Reflector.createDecorator<Role[]>();
