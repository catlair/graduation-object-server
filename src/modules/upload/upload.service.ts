import word2pdf from '@/utils/office';
import { Injectable, Logger } from '@nestjs/common';
import { isEmpty } from 'lodash';
import path = require('path');
import fs = require('fs');
import { PaperUploadQueries } from './dto/paper-upload.dto';
import { JwtDto } from '../auth/dto/jwt.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  private renameFile(
    files: Express.Multer.File,
    fieldname: string,
    query: PaperUploadQueries,
    user: JwtDto,
  ) {
    const name = `${user.id}$${query.course}$${fieldname}`;
    const ext = path.extname(files.filename);
    const thatPath = `${files.destination}/${name}`;
    const filename = `${thatPath}${ext}`;
    // 异步的进行，成功失败对后续操作不影响
    if (ext !== '.pdf') {
      word2pdf(filename, `${thatPath}.pdf`).catch((err) => {
        Logger.log(err.message || err, 'UploadController');
      });
    }
    fs.renameSync(files.path, filename);
    return `${name}${ext}`;
  }

  uploadPaperFile(
    files: {
      a: Express.Multer.File[];
      b: Express.Multer.File[];
    },
    query: PaperUploadQueries,
    user: JwtDto,
  ) {
    if (isEmpty(files)) {
      return null;
    }
    const {
      a: [a],
      b: [b],
    } = files;

    return {
      a: this.renameFile(a, 'a', query, user),
      b: this.renameFile(b, 'b', query, user),
    };
  }

  async updatePaperFile(
    files: Express.Multer.File[],
    id: string,
    user: JwtDto,
  ) {
    const { fieldname, destination, filename } = files[0];
    if (fieldname !== 'a' && fieldname !== 'b') {
      return null;
    }

    const paper = await this.prisma.paper.findUnique({
      where: { id },
      select: { course: true, aName: true, bName: true },
    });

    const ext = path.extname(filename),
      paperName = fieldname === 'a' ? paper.aName : paper.bName,
      paperExt = path.extname(paperName);

    const re = {
      [fieldname]: this.renameFile(files[0], fieldname, paper, user),
    };

    try {
      // 如果文档类型被改变，则删除原文档，并更新路径
      if (ext !== paperExt) {
        fs.unlinkSync(`${destination}/${paperName}`);

        await this.prisma.paper.update({
          where: { id },
          data: {
            [`${fieldname}Name`]: re[fieldname],
          },
        });
      }
    } catch (error) {
      Logger.error(error.message || error, 'UploadUpdate');
      return re;
    }

    return re;
  }

  deletePicture(imgPath: string) {
    try {
      fs.unlinkSync(path.resolve(process.cwd(), './uploads/img', imgPath));
      return {
        path: imgPath,
      };
    } catch (error) {
      Logger.error(error.message || error, 'Upload');
      return null;
    }
  }
}
