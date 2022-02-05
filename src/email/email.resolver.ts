import { Resolver, Args, Query } from '@nestjs/graphql';
import { EmailService } from './email.service';
import { Email } from './models/email.model';
import { SendEmailCodeArgs } from './dto/send-code.args';
import { Throttle } from '@nestjs/throttler';

@Resolver(() => Email)
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  @Query(() => Email)
  @Throttle(30)
  emailCode(@Args() { email, name }: SendEmailCodeArgs) {
    return this.emailService.sendEmailCode(email, name);
  }
}
