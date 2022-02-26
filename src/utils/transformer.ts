import { PageParams, Pagination } from '@/dto/page-params';

/**
 * 返回分页数据
 */
export function pagination<D = any>(
  data: D,
  page: PageParams,
  total: number,
  success = true,
): Pagination<D> {
  return {
    data,
    success,
    current: page.current,
    pageSize: page.pageSize,
    total,
  };
}

export function fuzzyEmail(email: string) {
  const arr = email.split('@');
  const star = '***';
  const name = arr[0];
  let str = '';
  if (name.length <= 3) {
    str = name + star;
  } else if (name.length <= 6) {
    str = name.substring(0, 2) + star + name.at(-1);
  } else {
    str = name.substring(0, 3) + star + name.substring(name.length - 2);
  }
  return str + '@' + arr[1];
}
