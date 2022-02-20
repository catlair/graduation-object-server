import { Mimetype } from '@/enums/mimetype';
import { BadRequestException } from '@nestjs/common';
import { validateSync } from 'class-validator';
import path = require('node:path');

export function validateErrThrow(Dto: any, data: Record<string, any>) {
  const dto = new Dto();

  Object.keys(data).forEach((key) => {
    dto[key] = data[key];
  });

  const errors = validateSync(dto);
  const err = errors[0];
  if (err) {
    throw new BadRequestException(
      err.constraints[Object.keys(err.constraints)[0]],
    );
  }
}

export function encodeRFC5987ValueChars(str: string) {
  return (
    encodeURIComponent(str)
      // 注意，尽管 RFC3986 保留 "!"，但 RFC5987 并没有，
      // 所以我们并不需要过滤它。
      .replace(
        /['()*]/g,
        (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase(),
      ) // i.e., %27 %28 %29 %2a (请注意，"*" 的有效编码是 %2A
      // 这需要调用 toUpperCase() 方法来正确编码)
      // 对于 RFC5987 以下是不需要 percent-encoding 编码的,
      // 这样我们就可以在网络上获取更好的可读性: |`^
      .replace(/%(7C|60|5E)/g, (str, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      )
  );
}

export function downloadFileHeader(filename: string) {
  const extname = path.extname(filename);
  const mimetype = Mimetype[extname.slice(1)];
  return {
    'Content-Type': mimetype,
    'Content-Disposition': `attachment; filename*=UTF-8''${encodeRFC5987ValueChars(
      filename,
    )}`,
  };
}

export function base64(str: string) {
  return Buffer.from(str).toString('base64');
}
