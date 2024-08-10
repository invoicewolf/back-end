import { Role } from '../../model/role.enum';

export interface IRequestUserDto {
  user_id: string;
  email: string;
  roles: Role[];
}

export class RequestUserDto {
  user_id: string;
  email: string;
  roles: Role[];

  constructor(user?: IRequestUserDto) {
    this.user_id = user.user_id;
    this.email = user.email;
    this.roles = user.roles;
  }
}
