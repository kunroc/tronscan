import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  tronNodeUrl: string;
  requestTimeout: number;
  maxRetries: number;
  logLevel: string;
  port: number;
}

export const config: Config = {
  tronNodeUrl: process.env.TRON_NODE_URL || 'https://api.trongrid.io',
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '5000'),
  maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
  logLevel: process.env.LOG_LEVEL || 'info',
  port: parseInt(process.env.PORT || '3000')
};