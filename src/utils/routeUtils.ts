import express, { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError, ErrorType } from '../types/errors';
import { TronClient } from '../api/tronClient';
import { logger } from './logger';

/**
 * 路由处理函数接口定义
 */
export interface RouteHandler<T = any> {
  (req: Request, res: Response): Promise<T>;
}

/**
 * 基础路由接口
 */
export interface BaseRouteInterface {
  router: Router;
  initializeRoutes(): void;
}

/**
 * 异步路由错误处理包装器
 * @param handler 异步路由处理函数
 * @returns 包装后的Express路由处理函数
 */
export function asyncHandler<T>(handler: RouteHandler<T>): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req, res);
      if (result !== undefined) {
        res.json(createResponse(result));
      }
    } catch (error) {
      logger.error(`路由处理错误: ${error instanceof Error ? error.message : String(error)}`);
      next(error instanceof AppError ? error : new AppError('服务器内部错误', ErrorType.SERVER_ERROR));
    }
  };
}

/**
 * 创建标准化的API响应
 * @param data 响应数据
 * @returns 标准化响应对象
 */
export function createResponse<T>(data: T): { success: true; data: T } {
  return {
    success: true,
    data
  };
}

/**
 * 创建带TronClient实例的路由处理器
 * @param handler 需要TronClient的路由处理函数
 * @returns 包装后的路由处理函数
 */
export function withTronClient<T>(handler: (tronClient: TronClient) => RouteHandler<T>): RequestHandler {
  return asyncHandler(async (req: Request, res: Response) => {
    const tronClient = req.app.get('tronClient') as TronClient | undefined;
    if (!tronClient) {
      throw new AppError('TronClient实例未初始化', ErrorType.SERVER_ERROR);
    }
    return handler(tronClient)(req, res);
  });
}

/**
 * 基础路由类，所有路由类应继承此类
 */
export abstract class BaseRoute implements BaseRouteInterface {
  public router: Router;
  protected tronClient: TronClient;

  constructor(tronClient: TronClient) {
    this.tronClient = tronClient;
    this.router = express.Router();
    this.initializeRoutes();
  }

  /**
   * 初始化路由，子类必须实现此方法
   */
  public abstract initializeRoutes(): void;
}

/**
 * 注册路由到Express应用
 * @param app Express应用实例
 * @param routes 路由实例数组
 */
export function registerRoutes(app: express.Application, routes: BaseRouteInterface[]): void {
  routes.forEach(route => {
        app.use(route.router);
  });
}