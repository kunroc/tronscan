import winston from 'winston';
import { config } from '../config';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level}]: ${message}`;
  })
);

export const logger = winston.createLogger({
  level: config.logLevel,
  levels: winston.config.npm.levels,
  format: logFormat,
  transports: [
    new winston.transports.Console()
  ]
});