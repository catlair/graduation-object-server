import { SetMetadata } from '@nestjs/common';

export const IS_ALLOW_UNLOGIN_KEY = 'isPublic';
export const AllowUnlogin = () => SetMetadata(IS_ALLOW_UNLOGIN_KEY, true);
