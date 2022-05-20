import { Role } from '@/enums/role.enum';
import { Injectable } from '@nestjs/common';
import { Paper, PaperEnum, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { JwtDto } from '../auth/dto/jwt.dto';
import { NoticeService } from '../notice/notice.service';
import { CreateCheckDto } from './dto/create-check.dto';

@Injectable()
export class CheckService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly noticeService: NoticeService,
  ) {}

  async create(createCheckDto: CreateCheckDto, user: JwtDto) {
    const { status } = createCheckDto;
    const paper = await this.prisma.paper.update({
      where: { id: createCheckDto.paperId },
      data: { status } as { status: PaperEnum },
      include: { teacher: true },
    });

    const life = await this.prisma.paperLife.create({
      data: {
        ...createCheckDto,
        userId: user.id,
      },
    });

    switch (paper.status) {
      case 'REJECTED':
        this.notifyReupload(user, paper, `${paper.college} 初审未通过`);
        break;
      case 'PASSED':
        this.notifyPass(user, paper, `${paper.college} 初审通过`);
        break;
      case 'REVIEW_PASSED':
        this.notifyPass(user, paper, `${paper.college} 复审通过`);
        break;
      case 'REVIEW_REJECTED':
        this.notifyReupload(user, paper, `${paper.college} 复审未通过`);
        break;
      default:
        break;
    }

    return life;
  }

  private async notifyReupload(
    user: JwtDto,
    { teacher }: Paper & { teacher: User },
    title: string,
  ) {
    if (teacher.id === user.id) {
      return;
    }
    return this.noticeService.create([teacher], {
      userId: user.id,
      title,
    });
  }

  private async notifyPass(
    user: JwtDto,
    { teacher, college }: Paper & { teacher: User },
    title: string,
  ) {
    // 查询教秘
    const secretary = await this.prisma.user.findMany({
      where: {
        roles: {
          array_contains: Role.SECRETARY,
        },
        college,
        id: {
          not: user.id,
        },
      },
    });

    return this.noticeService.create([...secretary, teacher], {
      userId: user.id,
      title,
    });
  }
}
