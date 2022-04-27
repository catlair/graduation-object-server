export enum Role {
  // 管理员
  ADMIN = 'ADMIN',
  // 教研室主任
  DIRECTOR = 'DIRECTOR',
  // 教研室副主任
  VICE_DIRECTOR = 'VICE_DIRECTOR',
  // 教师
  TEACHER = 'TEACHER',
  // 教师秘书
  SECRETARY = 'SECRETARY',
}

/**
 * 权限组合
 */
export const Roles = {
  // 教研室
  DIRECTOR: [Role.DIRECTOR, Role.VICE_DIRECTOR],
};
