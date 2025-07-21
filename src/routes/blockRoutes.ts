import { BaseRoute, asyncHandler, createResponse } from '../utils/routeUtils';
import { TronClient } from '../api/tronClient';
import { BlockDetail } from '../types/block';

/**
 * 区块路由处理类
 */
export class BlockRoute extends BaseRoute {
  constructor(tronClient: TronClient) {
    super(tronClient);
  }

  /**
   * 初始化路由
   */
  protected initializeRoutes(): void {
    this.router.get('/latest-details', asyncHandler(this.getLatestBlockDetails.bind(this)));
  }

  /**
   * 获取最新区块的详细信息，包括完整交易列表
   */
  private async getLatestBlockDetails(req: any, res: any): Promise<void> {
    const blockDetails: BlockDetail = await this.tronClient.getLatestBlockDetails();
    res.json(createResponse(blockDetails));
  }
}

// 导出路由工厂函数
export default function blockRoutes(tronClient: TronClient) {
  return new BlockRoute(tronClient).getRouter();
}