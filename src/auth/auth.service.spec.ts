import { Test, TestingModule } from '@nestjs/testing';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JWTServiceMock } from './mocks/jwt.service.mock';

describe('AuthService', () => {
  let jwtServiceMock: JWTServiceMock;
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jwtServiceMock = new JWTServiceMock();

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signToken', () => {
    it('should return token', async () => {
      // Arrange
      const userId = 1;
      const username = 'username';
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwttoken');

      // Act
      const token = await service.signToken(userId, username);

      // Assert
      expect(token).toBe('jwttoken');
    });
  });

  describe('verifyToken', () => {
    it('should return payload', async () => {
      // Arrange
      const token = 'token';
      const output = { sub: 1, username: 'username' };
      jest.spyOn(jwtService, 'verify').mockReturnValue(output);

      // Act
      const payload = await service.verifyToken(token);

      // Assert
      expect(payload).toBe(output);
    });

    it('should throw error if token is invalid', async () => {
      // Arrange
      const token = 'token';
      jest.spyOn(jwtService, 'verify').mockImplementationOnce(() => {
        throw new TokenExpiredError('token is invalid', null);
      });

      // Act & Assert
      await expect(service.verifyToken(token)).rejects.toThrow(
        new TokenExpiredError('token is invalid', null),
      );
    });
  });
});
