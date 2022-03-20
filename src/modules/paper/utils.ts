import { base64 } from '@/utils';
import dayjs from '@/utils/dayjs';

export function getPaperName(course: string, userId: number) {
  const prefix = course + dayjs().format('YYYYMMDD');
  return {
    aName: base64(prefix + 'a' + userId),
    bName: base64(prefix + 'b' + userId),
  };
}
