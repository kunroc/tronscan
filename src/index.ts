import express, { Request, Response, NextFunction } from 'express';
import { config } from './config';
import { logger } from './utils/logger';
import { TronClient } from './api/tronClient';
import { BlockProcessor } from './processor/blockProcessor';
import { AppError, ErrorType } from './types/errors';

// 创建Express应用
const app = express();

const tronClient = new TronClient({
  baseUrl: config.tronNodeUrl,
  timeout: config.requestTimeout,
  maxRetries: config.maxRetries
});
const blockProcessor = new BlockProcessor();

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查路由
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 获取最新区块信息路由
app.get('/latest-block', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('请求获取最新区块信息');
    // 获取最新区块详情并格式化
    const rawBlock = await tronClient.getRawLatestBlock();
    const formattedBlock = blockProcessor.formatBlockData(rawBlock);
    const isValid = blockProcessor.validateBlockData(formattedBlock);

    if (!isValid) {
      throw new AppError('区块数据验证失败', ErrorType.DATA_ERROR);
    }

    res.status(200).json({
      success: true,
      data: formattedBlock
    });
  } catch (error) {
    next(error);
  }
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`请求处理错误: ${err.message}`, err);

  if (err instanceof AppError) {
    return res.status(500).json({
      success: false,
      error: {
        message: err.message,
        type: err.type
      }
    });
  }

  res.status(500).json({
    success: false,
    error: {
      message: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
});

// 启动服务器
app.listen(config.port, () => {
  logger.info(`服务器已启动，监听端口 ${config.port}`);
  logger.info(`API地址: http://localhost:${config.port}/latest-block`);
  logger.info(`健康检查: http://localhost:${config.port}/health`);
});