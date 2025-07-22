import { BaseRoute, asyncHandler, createResponse } from '../utils/routeUtils';
import { TronClient } from '../api/tronClient';
import { Request, Response } from 'express';

/**
 * 最新区块路由处理类
 */
export class LatestBlockRoute extends BaseRoute {
  constructor(tronClient: TronClient) {
    super(tronClient);
  }

  /**
   * 初始化路由
   */
  public initializeRoutes(): void {
    this.router.get('/', asyncHandler(this.getLatestBlock.bind(this)));
  }

  /**
   * 获取最新区块号及基本信息
   */
  private async getLatestBlock(req: Request, res: Response): Promise<void> {
    const block = await this.tronClient.getLatestBlock();
    res.json(createResponse(block));
  }
}

export default function latestBlockRoutes(tronClient: TronClient) {
  return new LatestBlockRoute(tronClient).router;
}