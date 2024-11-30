import { Test, TestingModule } from '@nestjs/testing';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JWTServiceMock } from './mocks/jwt.service.mock';

describe('AuthService', () => {
  let jwtServiceMock: JWTServiceMock;
  let service: AuthService;
  let jwtService: JwtService;
  const jwtAccessSecert = 'accessSecret';
  const jwtRefreshSecert = 'refreshSecret';

  beforeEach(async () => {
    jwtServiceMock = new JWTServiceMock({
      accessSecret: jwtAccessSecert,
      refreshSecret: jwtRefreshSecert,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        switch (token) {
          case JwtService:
            return jwtServiceMock.build();
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    process.env.JWT_ACCESS_SECRET = jwtAccessSecert;
    process.env.JWT_REFRESH_SECRET = jwtRefreshSecert;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signToken', () => {
    it('should return access token', async () => {
      // Arrange
      const userId = 1;
      const username = 'username';
      const type = 'access';

      // Act
      const token = await service.signToken(userId, username, type);

      // Assert
      expect(token).toEqual({
        user: { sub: userId, username: username },
        token: 'accessToken',
      });
    });

    it('should return refresh token', async () => {
      // Arrange
      const userId = 1;
      const username = 'username';
      const type = 'refresh';

      // Act
      const token = await service.signToken(userId, username, type);

      // Assert
      expect(token).toEqual({
        user: { sub: userId, username: username },
        token: 'refreshToken',
      });
    });

    it('should throw error if type is invalid', async () => {
      // Arrange
      const userId = 1;
      const username = 'username';
      const type = 'normal';

      // Act & Assert
      await expect(service.signToken(userId, username, type)).rejects.toThrow(
        new RpcException(
          new InternalServerErrorException(
            `Invalid token type. Expected 'access' or 'refresh' (Got ${type})`,
          ),
        ),
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify access token and return payload', async () => {
      // Arrange
      const token = 'accessToken';
      const output = { sub: 1, username: 'username' };
      const type = 'access';

      // Act
      const payload = await service.verifyToken(token, type);

      // Assert
      expect(payload).toEqual(output);
    });

    it('should verify refresh token and return payload', async () => {
      // Arrange
      const token = 'refreshToken';
      const output = { sub: 2, username: 'username2' };
      const type = 'refresh';

      // Act
      const payload = await service.verifyToken(token, type);

      // Assert
      expect(payload).toEqual(output);
    });

    it('should throw internal server error if type is invalid', async () => {
      // Arrange
      const token = 'accessToken';
      const type = 'normal';

      // Act & Assert
      await expect(service.verifyToken(token, type)).rejects.toThrow(
        new RpcException(
          new InternalServerErrorException(
            `Invalid token type. Expected 'access' or 'refresh' (Got ${type})`,
          ),
        ),
      );
    });

    it('should throw error if token is invalid', async () => {
      // Arrange
      const token = 'token';
      jest.spyOn(jwtService, 'verify').mockImplementationOnce(() => {
        throw new TokenExpiredError('token is invalid', null);
      });

      // Act & Assert
      await expect(service.verifyToken(token, 'access')).rejects.toThrow(
        new TokenExpiredError('token is invalid', null),
      );
    });
  });
});
