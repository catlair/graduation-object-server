export interface JwtDto {
  id: string;
  roles: string[]; // 放这里面的方便使用，后面就不用再查数据库了
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
}
