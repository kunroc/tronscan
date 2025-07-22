import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError, ErrorType } from '../types/errors';
import { BlockDetail } from '../types/block';

interface RawBlockData {
  blockID: string;
  block_header: {
    raw_data: {
      number: number;
      timestamp: number;
      witness_address: string;
      size: number;
      version: number;
    };
  };
  transactions?: Array<{
    txID: string;
    raw_data: {
      contract: Array<{
        type: string;
        parameter: {
          value: {
            owner_address: string;
            to_address: string;
            amount: number;
          };
        };
      }>;
      timestamp: number;
    };
  }>;
  confirmed: number;
}

interface TronClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  maxRetries?: number;
}

/**
 * TRON网络客户端，用于与TRON节点API交互
 */
export class TronClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly headers: Record<string, string>;
  private readonly maxRetries: number;

  /**
   * 创建TronClient实例
   * @param config 客户端配置
   */
  constructor(config: TronClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // 移除URL末尾的斜杠
    this.timeout = config.timeout || 5000;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    };
    this.maxRetries = config.maxRetries || 3;
  }

  /**
   * 获取最新区块号及基本信息
   */
async getLatestBlock(): Promise<{ blockNumber: number; hash: string; timestamp: number }> {
  const response = await this.request<RawBlockData>('wallet/getnowblock');
  return {
    blockNumber: response.block_header.raw_data.number,
    hash: response.blockID,
    timestamp: response.block_header.raw_data.timestamp
  };
}

  /**
   * 获取最新区块的原始数据
   */
  async getRawLatestBlock(): Promise<RawBlockData> {
    return this.request<RawBlockData>('wallet/getnowblock');
  }

  /**
   * 获取最新区块的详细信息，包括完整交易列表
   */
async getLatestBlockDetails(): Promise<BlockDetail> {
  const block: RawBlockData = await this.request<RawBlockData>('wallet/getnowblock');
  return this.formatBlockDetail(block);
}

  /**
   * 格式化区块详情数据
   * @param block 原始区块数据
   * @returns 格式化后的区块详情
   */
  private formatBlockDetail(block: RawBlockData): BlockDetail {
    return {
      blockNumber: block.block_header.raw_data.number,
      blockHash: block.blockID,
      timestamp: block.block_header.raw_data.timestamp,
      producerAddress: block.block_header.raw_data.witness_address,
      transactionCount: block.transactions?.length || 0,
      transactions: block.transactions?.map(tx => ({
        txID: tx.txID,
        fromAddress: tx.raw_data.contract[0].parameter.value.owner_address,
        toAddress: tx.raw_data.contract[0].parameter.value.to_address,
        amount: tx.raw_data.contract[0].parameter.value.amount,
        timestamp: tx.raw_data.timestamp,
        contractType: tx.raw_data.contract[0].type
      })) || [],
      blockSize: block.block_header.raw_data.size,
      confirmations: block.confirmed,
      version: block.block_header.raw_data.version
    };
  }

  /**
   * 发送API请求到TRON节点
   * @param endpoint API端点
   * @returns API响应数据
   */
  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    let retries = 0;

    while (retries <= this.maxRetries) {
      try {
        const response = await axios.post<T>(url, {}, {
          headers: this.headers,
          timeout: this.timeout
        });
        return response.data;
      } catch (error) {
        retries++;
        if (retries > this.maxRetries) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`TRON API请求失败 [${endpoint}]: ${errorMessage}`);
          throw new AppError(`TRON节点通信失败`, ErrorType.NETWORK_ERROR);
        }
        logger.warn(`请求失败，正在重试(${retries}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    throw new AppError('请求重试次数耗尽', ErrorType.NETWORK_ERROR);
  }
}