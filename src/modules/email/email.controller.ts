import { EmailService } from './email.service';
import { SendEmailCodeDto } from './dto/send-code.dto';
import { Throttle } from '@nestjs/throttler';
import { Body, Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/decorators';

@Controller('email')
@ApiTags('邮箱')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Auth()
  @Get('send')
  @Throttle(30)
  @ApiOperation({ summary: '发送邮箱验证码' })
  emailCode(@Body() { email, name }: SendEmailCodeDto) {
    return this.emailService.sendEmailCode(email, name);
  }
}
