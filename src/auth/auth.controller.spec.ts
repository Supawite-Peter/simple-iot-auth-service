import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceMock } from './mocks/auth.service.mock';

describe('AuthController', () => {
  let serviceMock: AuthServiceMock;
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    serviceMock = new AuthServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        switch (token) {
          case AuthService:
            return serviceMock.build();
        }
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be define', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('auth.token.sign', () => {
    it('should pass data to service.signToken', async () => {
      // Arrange
      const input = {
        userId: 1,
        username: 'abc',
      };
      serviceMock.stubSignToken = 'token';

      // Act
      const result = await controller.sign(input);

      // Assert
      expect(result).toEqual('token');
      expect(service.signToken).toHaveBeenCalled();
    });

    it('should throw error if sign token failed', async () => {
      // Arrange
      const input = {
        userId: 1,
        username: 'abc',
      };
      jest
        .spyOn(service, 'signToken')
        .mockRejectedValueOnce(new Error('sign token failed'));

      // Act & Assert
      await expect(controller.sign(input)).rejects.toThrow(
        new Error('sign token failed'),
      );
    });
  });

  describe('auth.token.verify', () => {
    it('should pass data to service.verifyToken', async () => {
      // Arrange
      const input = {
        token: 'token',
      };
      serviceMock.stubVerifyToken = { sub: 1, username: 'abc' };

      // Act
      const result = await controller.verify(input);

      // Assert
      expect(result).toEqual({ sub: 1, username: 'abc' });
      expect(service.verifyToken).toHaveBeenCalled();
    });

    it('should throw error if token is invalid', async () => {
      // Arrange
      const input = {
        token: 'token',
      };
      jest
        .spyOn(service, 'verifyToken')
        .mockRejectedValueOnce(new Error('token is invalid'));

      // Act & Assert
      await expect(controller.verify(input)).rejects.toThrow(
        new Error('token is invalid'),
      );
    });
  });
});
