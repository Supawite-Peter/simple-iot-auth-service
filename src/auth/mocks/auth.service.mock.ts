export class AuthServiceMock {
  stubSignToken: any;
  stubVerifyToken: any;

  constructor(stubSignToken: any = {}, stubVerifyToken: any = {}) {
    this.stubSignToken = stubSignToken;
    this.stubVerifyToken = stubVerifyToken;
  }

  build() {
    return {
      signToken: jest
        .fn()
        .mockImplementation(() => Promise.resolve(this.stubSignToken)),
      verifyToken: jest
        .fn()
        .mockImplementation(() => Promise.resolve(this.stubVerifyToken)),
    };
  }
}
