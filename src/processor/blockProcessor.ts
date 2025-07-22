import { logger } from '../utils/logger';
import { RawBlockData } from '../types/rawBlockData';

export interface BlockData {
  blockNumber: number;
  timestamp: number;
  transactions: number;
  producer: string;
  hash: string;
}

export class BlockProcessor {
  /**
   * 格式化原始区块数据
   * @param rawBlockData 原始区块数据
   * @returns 格式化后的区块数据
   */
  formatBlockData(rawBlockData: RawBlockData): BlockData {
    if (!rawBlockData || !rawBlockData.block_header) {
      throw new Error('无效的区块数据结构');
    }

    return {
      blockNumber: rawBlockData.block_header.raw_data.number,
      timestamp: rawBlockData.block_header.raw_data.timestamp,
      transactions: rawBlockData.transactions?.length || 0,
      producer: rawBlockData.block_header.raw_data.witness_address,
      hash: rawBlockData.blockID
    };
  }

  /**
   * 验证区块数据完整性
   * @param blockData 区块数据
   * @returns 是否验证通过
   */
  validateBlockData(blockData: BlockData): boolean {
    const requiredFields: (keyof BlockData)[] = ['blockNumber', 'timestamp', 'hash'];
    const isValid = requiredFields.every(field => blockData[field] !== undefined);

    if (!isValid) {
      logger.error('区块数据验证失败: 缺少必要字段');
    }
    return isValid;
  }
}