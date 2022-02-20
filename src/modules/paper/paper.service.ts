import { PageParams } from '@/dto/page-params';
import { Role } from '@/enums/role.enum';
import { pagination } from '@/utils/transformer';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaperEenum, User, PaperLifeEenum } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { JwtDto } from '../auth/dto/jwt.dto';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';

@Injectable()
export class PaperService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaperDto: CreatePaperDto, user: JwtDto) {
    const paper = await this.prisma.paper.create({
      data: {
        ...createPaperDto,
        status: PaperEenum.WAITING,
        teacherId: user.id,
      },
    });
    await this.prisma.paperLife.create({
      data: {
        userId: user.id,
        content: createPaperDto.remark,
        paperId: paper.id,
        status: PaperLifeEenum.CREATE,
      },
    });
    return paper;
  }

  async findAllByCollege(
    user: User,
    page: PageParams = { current: 1, pageSize: 10 },
  ) {
    const skip = (page.current - 1) * page.pageSize;
    const query = {
      where: {
        college: user.college,
      },
    };
    const papers = await this.prisma.paper.findMany({
      skip,
      take: page.pageSize,
      where: query.where,
    });
    return pagination(papers, page, await this.prisma.paper.count(query));
  }

  async findAllByTeacher(
    user: JwtDto,
    page: PageParams = { current: 1, pageSize: 10 },
  ) {
    const skip = (page.current - 1) * page.pageSize;
    const query = {
      where: {
        teacherId: user.id,
      },
    };
    const papers = await this.prisma.paper.findMany({
      skip,
      take: page.pageSize,
      where: query.where,
    });
    return pagination(papers, page, await this.prisma.paper.count(query));
  }

  findPaperLife(paperId: string) {
    return this.prisma.paperLife.findMany({
      where: {
        paperId,
      },
    });
  }

  async findOne(id: string, user: User) {
    const paper = await this.prisma.paper.findUnique({
      where: { id },
    });
    if (!paper) {
      return null;
    }
    const roles = user.roles as Role[];
    const isDirector =
      roles.includes(Role.DIRECTOR) || roles.includes(Role.VICE_DIRECTOR);
    if (isDirector || paper.teacherId === user.id) {
      return paper;
    } else {
      throw new ForbiddenException('您没有权限查看该试卷');
    }
  }

  async update(id: string, updatePaperDto: UpdatePaperDto, user: JwtDto) {
    const paper = await this.prisma.paper.findUnique({ where: { id } });
    if (!paper) {
      throw new BadRequestException('试卷不存在');
    }
    if (paper.teacherId !== user.id) {
      throw new ForbiddenException('您没有权限修改该试卷');
    }

    try {
      await this.prisma.paperLife.create({
        data: {
          paperId: id,
          userId: user.id,
          status: PaperLifeEenum.UPDATE,
          content: updatePaperDto.content,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('更新试卷失败');
    }

    return await this.prisma.paper.update({
      where: { id },
      data: { status: PaperEenum.WAITING },
    });
  }
}
