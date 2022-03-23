import { PageParams } from '@/dto/page-params';
import { Role } from '@/enums/role.enum';
import { pagination } from '@/utils/transformer';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PaperEnum, User, PaperLifeEnum, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { JwtDto } from '../auth/dto/jwt.dto';
import { NoticeService } from '../notice/notice.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { excludePassword } from '@/utils/prisma';
import path = require('path');
import fs = require('fs');
import word2pdf from '@/utils/office';
import { paperDestination } from '~/upload/utils';

@Injectable()
export class PaperService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly noticeService: NoticeService,
  ) {}

  /**
   *
   * @param filename 原文件名（带 ext）
   * @param newname 现文件名（不带 ext）
   */
  private async renameFile(filename: string, newname: string) {
    try {
      const thatPath = `${paperDestination}/${filename}`;
      const ext = path.extname(filename);
      const filepath = `${paperDestination}/${newname}`;
      fs.renameSync(thatPath, `${filepath}${ext}`);
      if (ext !== '.pdf') {
        // 异步的进行，成功失败对后续操作不影响
        word2pdf(`${filepath}${ext}`, `${filepath}.pdf`).catch((err) => {
          Logger.log(err.message || err, 'PaperService');
        });
      }
      return `${newname}${ext}`;
    } catch (error) {
      throw new InternalServerErrorException(error?.message || '服务器错误');
    }
  }

  async create(createPaperDto: CreatePaperDto, user: User) {
    if (await this.hasCreatedPaper(createPaperDto, user)) {
      throw new BadRequestException('您已经创建过该试卷');
    }

    const paper = await this.prisma.paper.create({
      data: {
        ...createPaperDto,
        status: PaperEnum.WAITING,
        teacherId: user.id,
      },
    });
    const paperLife = await this.prisma.paperLife.create({
      data: {
        userId: user.id,
        content: createPaperDto.remark,
        paperId: paper.id,
        status: PaperLifeEnum.CREATE,
      },
    });

    await this.savaCreatePaper(paper.id, createPaperDto, paperLife.id);

    // 找到学院的主任/副主任
    this.notify(user, `${user.name}创建了试卷${paper.course}`);
    return paper;
  }

  private async hasCreatedPaper(createPaperDto: CreatePaperDto, user: User) {
    const paper = await this.prisma.paper.findMany({
      where: {
        teacherId: user.id,
        course: createPaperDto.course,
        // 判断 createdAt 是否在今年内
        createdAt: {
          gte: new Date(new Date().getFullYear(), 0, 1),
          lte: new Date(new Date().getFullYear(), 11, 31),
        },
      },
    });
    return paper.length > 0;
  }

  private async savaCreatePaper(
    paperId: string,
    createPaperDto: CreatePaperDto,
    paperLifeId: string,
  ) {
    const [aName, bName] = await Promise.all([
      this.renameFile(createPaperDto.aName, paperLifeId + 'a'),
      this.renameFile(createPaperDto.bName, paperLifeId + 'b'),
    ]);
    await this.prisma.paperLife.update({
      where: { id: paperLifeId },
      data: { aName, bName },
    });
    return await this.prisma.paper.update({
      where: { id: paperId },
      data: { aName, bName },
    });
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
    const roles = user.roles as Role[];
    const isDirector =
      roles.includes(Role.DIRECTOR) || roles.includes(Role.VICE_DIRECTOR);
    const query: Prisma.PaperFindUniqueArgs = { where: { id } };

    if (isDirector) {
      query.include = {
        teacher: {
          select: excludePassword,
        },
      };
    }

    const paper = await this.prisma.paper.findUnique(query);
    if (!paper) {
      return null;
    }

    if (isDirector || paper.teacherId === user.id) {
      return paper;
    } else {
      throw new ForbiddenException('您没有权限查看该试卷');
    }
  }

  async update(id: string, updatePaperDto: UpdatePaperDto, user: User) {
    const paper = await this.prisma.paper.findUnique({ where: { id } });
    if (!paper) {
      throw new BadRequestException('试卷不存在');
    }
    if (paper.teacherId !== user.id) {
      throw new ForbiddenException('您没有权限修改该试卷');
    }

    const paperNames = await this.updateCreatePaperLife(
      paper.id,
      updatePaperDto,
      user.id,
    );

    this.notify(user, `${user.name}更新了试卷${paper.course}`);
    return await this.prisma.paper.update({
      where: { id },
      data: { status: PaperEnum.WAITING, ...paperNames },
    });
  }

  private async updateCreatePaperLife(
    paperId: string,
    updatePaperDto: UpdatePaperDto,
    userId: number,
  ) {
    let paperNames = {};
    try {
      const paperLife = await this.prisma.paperLife.create({
        data: {
          paper: {
            connect: {
              id: paperId,
            },
          },
          userId,
          status: PaperLifeEnum.UPDATE,
          content: updatePaperDto.content,
        },
      });
      if (updatePaperDto.fields) {
        paperNames = await this.saveUpdatePaper(
          paperId,
          paperLife.id,
          updatePaperDto.fields,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException('更新试卷失败');
    }
    return paperNames;
  }

  private async saveUpdatePaper(
    paperId: string,
    paperLifeId: string,
    fields: UpdatePaperDto['fields'],
  ) {
    const paperNames = {};
    await Promise.all(
      Object.keys(fields).map(async (field) => {
        paperNames[field + 'Name'] = await this.renameFile(
          `${paperId}${field}${fields[field]}`,
          `${paperLifeId}${field}`,
        );
      }),
    );
    await this.prisma.paperLife.update({
      where: { id: paperLifeId },
      data: { ...paperNames },
    });
    return paperNames;
  }

  private async notify(user: User, title: string) {
    const users = await this.prisma.user.findMany({
      where: {
        college: user.college,
        // 数组中是否包含指定的值
        roles: {
          array_contains: [Role.DIRECTOR],
        },
      },
    });
    this.noticeService.create(users, {
      userId: user.id,
      title,
    });
  }
}
