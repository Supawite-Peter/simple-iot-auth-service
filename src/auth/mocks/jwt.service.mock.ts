export class JWTServiceMock {
  stubSign: any;
  stubVerify: any;

  constructor(stubSign = {}, stubVerify = {}) {
    this.stubSign = stubSign;
    this.stubVerify = stubVerify;
  }

  build() {
    return {
      sign: jest.fn().mockReturnValue(this.stubSign),
      verify: jest.fn().mockReturnValue(this.stubVerify),
    };
  }
}
