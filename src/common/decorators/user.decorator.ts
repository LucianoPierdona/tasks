import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../user/user.entity';
import { AuthRespDto } from '../../auth/dto/auth-resp.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      const id: number = request.user.id;
      const email: string = request.user.email;
      const role: UserRole = request.user.role;

      return {
        id,
        email,
        role,
      } as AuthRespDto;
    }

    return request.user;
  },
);
