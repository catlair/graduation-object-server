import { base64 } from '@/utils';

export function getPaperName(course: string, userId: number) {
  // const prefix = course + dayjs().format('YYYYMMDD');
  return {
    aName: base64(course + 'a' + userId),
    bName: base64(course + 'b' + userId),
  };
}
