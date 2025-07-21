import { BaseRoute, asyncHandler, createResponse } from '../utils/routeUtils';
import { TronClient } from '../api/tronClient';

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
  protected initializeRoutes(): void {
    this.router.get('/', asyncHandler(this.getLatestBlock.bind(this)));
  }

  /**
   * 获取最新区块号及基本信息
   */
  private async getLatestBlock(req: any, res: any): Promise<void> {
    const block = await this.tronClient.getLatestBlock();
    res.json(createResponse(block));
  }
}

// 导出路由工厂函数
export default function latestBlockRoutes(tronClient: TronClient) {
  return new LatestBlockRoute(tronClient).getRouter();
}