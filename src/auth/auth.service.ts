import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signToken(userId: number, username: string): Promise<any> {
    const payload = { sub: userId, username: username };
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<any> {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    return payload;
  }
}
