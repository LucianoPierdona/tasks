import { UserRole } from 'src/user/user.entity';

export class AuthRespDto {
  id: number;
  email: string;
  role: UserRole;
}
