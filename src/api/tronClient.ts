import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError, ErrorType } from '../types/errors';

export class TronClient {
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;

  constructor() {
    this.baseUrl = config.tronNodeUrl;
    this.timeout = config.requestTimeout;
    this.maxRetries = config.maxRetries;
  }

  /**
   * 获取最新区块信息
   * @returns 区块数据
   */
  async getLatestBlock(): Promise<any> {
    try {
      return await this.request('POST', '/wallet/getnowblock', {});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`获取最新区块失败: ${errorMessage}`);
      throw new AppError('获取最新区块信息失败', ErrorType.NETWORK_ERROR);
    }
  }

  /**
   * 带重试机制的HTTP请求
   * @param method HTTP方法
   * @param path 请求路径
   * @param data 请求数据
   * @returns 响应数据
   */
  private async request(method: string, path: string, data: any): Promise<any> {
    const options: AxiosRequestConfig = {
      method,
      url: `${this.baseUrl}${path}`,
      data,
      timeout: this.timeout,
      headers: { 'Content-Type': 'application/json' }
    };

    let retries = 0;
    while (retries <= this.maxRetries) {
      try {
        const response: AxiosResponse = await axios(options);
        return response.data;
      } catch (error) {
        retries++;
        if (retries > this.maxRetries) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`请求失败，已重试${this.maxRetries}次: ${errorMessage}`);
          throw error;
        }
        logger.warn(`请求失败，正在重试(${retries}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
  }
}