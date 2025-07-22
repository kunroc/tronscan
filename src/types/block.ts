/**
 * 交易详情接口定义
 */
export interface TransactionDetail {
  /** 交易ID */
  txID: string;
  /** 发送方地址 */
  fromAddress: string;
  /** 接收方地址 */
  toAddress: string;
  /** 交易金额（SUN单位） */
  amount: number;
  /** 交易时间戳 */
  timestamp: number;
  /** 合约类型 */
  contractType: string;
}

/**
 * 区块详情接口定义
 */
export interface BlockDetail {
  /** 区块号 */
  blockNumber: number;
  /** 区块哈希 */
  blockHash: string;
  /** 区块时间戳 */
  timestamp: number;
  /** 区块生产者地址 */
  producerAddress: string;
  /** 交易数量 */
  transactionCount: number;
  /** 交易列表 */
  transactions: TransactionDetail[];
  /** 区块大小 */
  blockSize: number;
  /** 确认数 */
  confirmations: number;
  /** 区块版本 */
  version: number;
}