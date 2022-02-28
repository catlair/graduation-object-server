import dayjs = require('dayjs');

/** 返回当前时间 */
export function getNowTime() {
  const createdAt = new Date(),
    date = dayjs.unix(createdAt.getTime() / 1000).format('YYYY-MM-DD HH:mm:ss');
  return {
    date,
    createdAt,
  };
}
