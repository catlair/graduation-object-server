import { BadRequestException } from '@nestjs/common';
import { validateSync } from 'class-validator';

// export function validateErrThrow(dto: any) {
//   const errors = validateSync(dto);
//   const err = errors[0];
//   if (err) {
//     throw new BadRequestException(
//       err.constraints[Object.keys(err.constraints)[0]],
//     );
//   }
// }

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
