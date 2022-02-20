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
