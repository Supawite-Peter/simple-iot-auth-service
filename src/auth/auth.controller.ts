import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'auth.token.sign' })
  sign(@Payload() { userId, username }: { userId: number; username: string }) {
    return this.authService.signToken(userId, username);
  }

  @MessagePattern({ cmd: 'auth.token.verify' })
  verify(@Payload() { token }: { token: string }) {
    return this.authService.verifyToken(token);
  }
}
