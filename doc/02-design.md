# 02-波场链节点数据获取程序设计文档

## 1. 系统架构

### 1.1 整体架构
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   配置模块      │     │   API客户端     │     │   数据处理模块  │
│  (config)       │────▶│  (api-client)   │────▶│  (data-processor)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  环境配置       │     │ 波场节点通信    │     │ 数据格式化      │
│  常量定义       │     │ 请求重试机制    │     │ 结果验证        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 1.2 模块划分
- **配置模块**：管理环境变量、节点地址和超时设置
- **API客户端**：处理与波场节点的网络通信
- **数据处理模块**：解析和格式化区块数据
- **主程序**：协调各模块执行流程

## 2. 核心模块设计

### 2.1 配置模块
```typescript
// src/config/index.ts
export interface Config {
  tronNodeUrl: string;       // 波场公网节点URL
  requestTimeout: number;    // 请求超时时间(ms)
  maxRetries: number;        // 最大重试次数
  logLevel: string;          // 日志级别
}

export const config: Config = {
  tronNodeUrl: process.env.TRON_NODE_URL || 'https://api.trongrid.io',
  requestTimeout: 5000,
  maxRetries: 3,
  logLevel: 'info'
};
```

### 2.2 API客户端模块
```typescript
// src/api/tronClient.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

export class TronClient {
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;

  constructor() {
    this.baseUrl = config.tronNodeUrl;
    this.timeout = config.requestTimeout;
    this.maxRetries = config.maxRetries;
  }

  // 获取最新区块信息
  async getLatestBlock(): Promise<any> {
    return this.request('POST', '/wallet/getnowblock', {});
  }

  // 带重试机制的请求方法
  private async request(method: string, path: string, data: any): Promise<any> {
    const options: AxiosRequestConfig = {
      method,
      url: `${this.baseUrl}${path}`,
      data,
      timeout: this.timeout,
      headers: {'Content-Type': 'application/json'}
    };

    let retries = 0;
    while (retries <= this.maxRetries) {
      try {
        const response: AxiosResponse = await axios(options);
        return response.data;
      } catch (error) {
        retries++;
        if (retries > this.maxRetries) {
          logger.error(`Request failed after ${this.maxRetries} retries: ${error.message}`);
          throw error;
        }
        logger.warn(`Request failed, retrying (${retries}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
  }
}
```

### 2.3 数据处理模块
```typescript
// src/processor/blockProcessor.ts
import { logger } from '../utils/logger';

export interface BlockData {
  blockNumber: number;
  timestamp: number;
  transactions: number;
  producer: string;
  hash: string;
}

export class BlockProcessor {
  // 格式化区块数据
  formatBlockData(rawBlockData: any): BlockData {
    if (!rawBlockData || !rawBlockData.block_header) {
      throw new Error('Invalid block data structure');
    }

    return {
      blockNumber: rawBlockData.block_header.raw_data.number,
      timestamp: rawBlockData.block_header.raw_data.timestamp,
      transactions: rawBlockData.transactions?.length || 0,
      producer: rawBlockData.block_header.raw_data.witness_address,
      hash: rawBlockData.blockID
    };
  }

  // 验证区块数据完整性
  validateBlockData(blockData: BlockData): boolean {
    const requiredFields = ['blockNumber', 'timestamp', 'hash'];
    const isValid = requiredFields.every(field => blockData[field] !== undefined);

    if (!isValid) {
      logger.error('Block data validation failed: missing required fields');
    }
    return isValid;
  }
}
```

## 3. 数据流程设计

### 3.1 核心流程图
```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│  初始化    │───▶│  请求区块  │───▶│  处理数据  │───▶│  输出结果  │
│  配置      │    │  数据      │    │            │    │            │
└────────────┘    └────────────┘    └────────────┘    └────────────┘
       │               │               │               │
       ▼               ▼               ▼               ▼
    加载配置       网络请求        格式化验证        返回/日志
```

### 3.2 详细流程说明
1. **初始化阶段**：加载配置文件，初始化API客户端
2. **请求阶段**：调用波场节点API获取最新区块原始数据
3. **处理阶段**：
   - 验证原始数据结构
   - 提取关键字段并格式化
   - 验证格式化后的数据完整性
4. **输出阶段**：返回格式化数据或记录日志

## 4. 技术选型

| 模块用途       | 技术选型          | 版本要求  | 说明                     |
|----------------|-------------------|-----------|--------------------------|
| 核心语言       | Node.js           | ≥16.0.0   | JavaScript运行环境       |
| 类型检查       | TypeScript        | ≥4.5.0    | 提供类型安全             |
| HTTP客户端     | Axios             | ≥1.3.0    | 处理HTTP请求             |
| 日志管理       | Winston           | ≥3.8.0    | 日志记录                 |
| 配置管理       | dotenv            | ≥16.0.0   | 环境变量管理             |
| 代码规范       | ESLint            | ≥8.0.0    | 代码质量检查             |
| 测试框架       | Jest              | ≥29.0.0   | 单元测试和集成测试       |

## 5. 错误处理策略

### 5.1 错误类型定义
```typescript
// src/types/errors.ts
export enum ErrorType {
  CONFIG_ERROR = 'CONFIG_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATA_ERROR = 'DATA_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export class AppError extends Error {
  type: ErrorType;
  timestamp: number;

  constructor(message: string, type: ErrorType) {
    super(message);
    this.type = type;
    this.timestamp = Date.now();
    this.name = 'AppError';
  }
}
```

### 5.2 错误处理流程
1. 捕获不同类型错误并包装为AppError
2. 根据错误类型执行不同恢复策略
3. 详细记录错误上下文信息
4. 对关键错误实现告警机制

## 6. 扩展性设计

### 6.1 可扩展点
- 支持多节点配置，实现负载均衡
- 插件化数据处理器，支持不同格式输出
- 可配置的重试策略和退避机制

### 6.2 未来扩展方向
- 添加缓存层减少重复请求
- 实现数据持久化存储接口
- 增加监控指标收集