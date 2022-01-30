// 响应错误
export class ResponseException extends Error {
  private response: string | Record<string, any>;
  private status: number;
  private code: number;
  constructor(response: string | Record<string, any>, code = 1, status = 400) {
    super();
    this.response = response;
    this.status = status;
    this.code = code;
  }

  getResponse() {
    return this.response;
  }
  getStatus() {
    return this.status;
  }
  getCode() {
    return this.code;
  }
}
