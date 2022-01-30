import { format, LoggerOptions, transports } from 'winston';
import { utilities, WinstonModule } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

const options: LoggerOptions = {
  format: format.simple(),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.ms(),
        utilities.format.nestLike('Nest', {
          prettyPrint: true,
        }),
      ),
    }),
    new transports.File({
      format: format.combine(
        format.timestamp(),
        format.printf((info) => {
          return `${new Date(info.timestamp).toLocaleString()} ${
            info.level
          }: [${info.context}] ${info.message}`;
        }),
      ),
      filename: 'logs/all-logs.log',
      maxsize: 1048576, // 1MB
    }),
  ],
};

export default options;

export function prismaLogger(): LoggerService {
  const logger = WinstonModule.createLogger({
    format: format.simple(),
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.ms(),
          utilities.format.nestLike('Prisma', {
            prettyPrint: true,
          }),
        ),
      }),
      new transports.File({
        format: format.combine(
          format.timestamp(),
          format.printf((info) => {
            return `${new Date(info.timestamp).toLocaleString()} ${
              info.level
            }: [${info.context}] ${info.message}`;
          }),
        ),
        filename: 'logs/prisma.log',
        maxsize: 1048576, // 1MB
      }),
    ],
  });
  return logger;
}
