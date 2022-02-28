import { Role } from '@/enums/role.enum';
import { Injectable } from '@nestjs/common';
import { Paper, PaperEnum, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { NoticeService } from '../notice/notice.service';
import { CreateCheckDto } from './dto/create-check.dto';

@Injectable()
export class CheckService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly noticeService: NoticeService,
  ) {}

  async create(createCheckDto: CreateCheckDto, user: User) {
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

    if (paper.status === 'REJECT') {
      this.notifyReupload(paper.teacher, user, paper.course);
    } else if (paper.status === 'PASS') {
      this.notifyPass(user, paper);
    }

    return life;
  }

  private async notifyReupload(teacher: User, user: User, name: string) {
    return this.noticeService.create([teacher], {
      userId: user.id,
      title: `${name} 审核不通过`,
    });
  }

  private async notifyPass(
    user: User,
    { teacher, college, course }: Paper & { teacher: User },
  ) {
    // 查询教秘
    const secretary = await this.prisma.user.findMany({
      where: {
        roles: {
          array_contains: Role.SECRETARY,
        },
        college: college,
      },
    });

    return this.noticeService.create([...secretary, teacher], {
      userId: user.id,
      title: `${course} 审核通过`,
    });
  }
}
