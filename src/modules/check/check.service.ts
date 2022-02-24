import { Injectable } from '@nestjs/common';
import { PaperEnum } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { JwtDto } from '../auth/dto/jwt.dto';
import { CreateCheckDto } from './dto/create-check.dto';

@Injectable()
export class CheckService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCheckDto: CreateCheckDto, user: JwtDto) {
    const { status } = createCheckDto;
    await this.prisma.paper.update({
      where: { id: createCheckDto.paperId },
      data: { status } as { status: PaperEnum },
    });

    return this.prisma.paperLife.create({
      data: {
        ...createCheckDto,
        userId: user.id,
      },
    });
  }
}
