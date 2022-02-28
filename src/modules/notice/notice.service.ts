import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { JwtDto } from '../auth/dto/jwt.dto';
import { EmailService } from '../email/email.service';
import { CreateNoticeDto } from './dto/create-notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  read(id: string, user: JwtDto) {
    return this.prisma.userNotice.updateMany({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  readAll(user: JwtDto) {
    return this.prisma.userNotice.updateMany({
      where: {
        userId: user.id,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  deleteAll(user: JwtDto) {
    return this.prisma.userNotice.deleteMany({
      where: {
        userId: user.id,
      },
    });
  }

  deleteAllRead(user: JwtDto) {
    return this.prisma.userNotice.deleteMany({
      where: {
        userId: user.id,
        read: true,
      },
    });
  }

  findAll() {
    return this.prisma.managerNotice.findMany();
  }

  async create(users: User[], createNoticeDto: CreateNoticeDto) {
    const notice = await this.prisma.managerNotice.create({
      data: {
        ...createNoticeDto,
      },
    });
    await this.prisma.userNotice.createMany({
      data: users.map((user) => ({
        userId: user.id,
        noticeId: notice.id,
      })),
    });
    Promise.all(
      users.map((user) =>
        this.emailService.sendNotice(
          user.email,
          createNoticeDto.title,
          createNoticeDto.content,
        ),
      ),
    );
    return notice;
  }
}
