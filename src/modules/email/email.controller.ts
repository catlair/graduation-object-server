import { EmailService } from './email.service';
import { SendEmailCodeDto } from './dto/send-code.dto';
import { Throttle } from '@nestjs/throttler';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('email')
@ApiTags('邮箱')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('captcha')
  @Throttle(4)
  @ApiOperation({ summary: '发送邮箱验证码' })
  emailCode(@Body() { email, name }: SendEmailCodeDto) {
    return this.emailService.sendEmailCode(email, name);
  }
}
