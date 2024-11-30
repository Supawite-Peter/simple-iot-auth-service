import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signToken(
    userId: number,
    username: string,
    type: string,
  ): Promise<any> {
    const payload = { sub: userId, username: username };
    switch (type) {
      case 'access':
        return {
          user: payload,
          token: this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRATION,
          }),
        };
      case 'refresh':
        return {
          user: payload,
          token: this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRATION,
          }),
        };
      default:
        throw new RpcException(
          new InternalServerErrorException(
            `Invalid token type. Expected 'access' or 'refresh' (Got ${type})`,
          ),
        );
    }
  }

  async verifyToken(token: string, type: string): Promise<any> {
    switch (type) {
      case 'access':
        return this.jwtService.verify(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
      case 'refresh':
        return this.jwtService.verify(token, {
          secret: process.env.JWT_REFRESH_SECRET,
        });
      default:
        throw new RpcException(
          new InternalServerErrorException(
            `Invalid token type. Expected 'access' or 'refresh' (Got ${type})`,
          ),
        );
    }
  }
}
