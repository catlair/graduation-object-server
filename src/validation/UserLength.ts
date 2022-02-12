import { registerDecorator, ValidationOptions, isEmail } from 'class-validator';

type LengthType = [number, number];

export function UserLength(
  { email, username }: { email: LengthType; username: LengthType },
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'userLength',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (isEmail(value)) {
            return value.length >= email[0] && value.length <= email[1];
          }
          return value.length >= username[0] && value.length <= username[1];
        },
      },
    });
  };
}
