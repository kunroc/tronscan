import { BaseRoute, asyncHandler, createResponse } from '../utils/routeUtils';
import { TronClient } from '../api/tronClient';
import { Request, Response } from 'express';

/**
 * 健康检查路由处理类
 */
export class HealthRoute extends BaseRoute {
  constructor(tronClient: TronClient) {
    super(tronClient);
  }

  /**
   * 初始化路由
   */
  public initializeRoutes(): void {
    this.router.get('/', asyncHandler(this.getHealthStatus.bind(this)));
  }

  /**
   * 获取服务健康状态
   */
  private async getHealthStatus(req: Request, res: Response): Promise<void> {
    const healthData = {
      status: 'ok',
      service: 'tronScan-api',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      tronNode: this.tronClient ? 'connected' : 'disconnected'
    };
    res.json(createResponse(healthData));
  }
}

export default function healthRoutes(tronClient: TronClient) {
  return new HealthRoute(tronClient).router;
}