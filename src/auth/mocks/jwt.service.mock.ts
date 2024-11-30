import { TokenExpiredError } from '@nestjs/jwt';

export class JWTServiceMock {
  stubSign: any;
  stubVerify: any;
  accessSecret: string;
  refreshSecret: string;

  constructor(secert, stubVerify = {}) {
    this.accessSecret = secert?.accessSecret;
    this.refreshSecret = secert?.refreshSecret;
    this.stubVerify = stubVerify;
  }

  build() {
    return {
      sign: jest
        .fn()
        .mockImplementation((payload, options) => this.sign(options)),
      verify: jest
        .fn()
        .mockImplementation((token, options) => this.verify(token, options)),
    };
  }

  private sign(options: { secret: string }) {
    switch (options.secret) {
      case this.accessSecret:
        return 'accessToken';
      case this.refreshSecret:
        return 'refreshToken';
      default:
        return 'invalidToken';
    }
  }

  private verify(token: string, options: { secret: string }) {
    switch (options.secret) {
      case this.accessSecret:
        return token === 'accessToken'
          ? { sub: 1, username: 'username' }
          : null;
      case this.refreshSecret:
        return token === 'refreshToken'
          ? { sub: 2, username: 'username2' }
          : null;
      default:
        throw new TokenExpiredError('token is invalid', null);
    }
  }
}
