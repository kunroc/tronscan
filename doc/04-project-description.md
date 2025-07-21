# 波场链区块浏览器项目说明文档

## 1. 项目概述

本项目是一个基于Node.js和TypeScript开发的波场链区块浏览器后端服务，能够连接波场公网节点获取最新区块信息，并通过RESTful API提供数据访问接口。

## 2. 核心功能

- 连接波场公网节点(`https://api.trongrid.io`)获取区块链数据
- 提供最新区块信息查询API
- 实现请求重试机制和错误处理
- 结构化日志记录和分级日志管理
- 环境变量配置和多环境支持

## 3. 技术栈

- **运行环境**: Node.js 14+、TypeScript
- **Web框架**: Express.js
- **HTTP客户端**: Axios
- **日志工具**: Winston
- **开发工具**: nodemon、ts-node
- **测试工具**: Jest

## 4. 项目结构

```
/src
  /api          - 外部API交互模块
  /config       - 配置管理模块
  /processor    - 数据处理模块
  /types        - 类型定义
  /utils        - 工具函数
  index.ts      - 应用入口文件
/tests          - 单元测试和集成测试
/doc            - 项目文档
.env.example    - 环境变量示例
```

## 5. 快速开始

### 5.1 环境准备

```bash
# 克隆仓库
git clone <repository-url>
cd tronScan

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件设置必要参数

# 启动开发服务器
npm run dev
```

### 5.2 API接口

- **健康检查**:
  `GET /health` - 检查服务运行状态

- **获取最新区块**:
  `GET /latest-block` - 获取波场链最新区块信息

## 6. 部署指南

### 6.1 生产环境配置

创建生产环境配置文件:
```bash
cp .env.example .env.production
# 修改配置为生产环境参数
```

### 6.2 构建与启动

```bash
# 构建TypeScript代码
npm run build

# 启动生产服务器
npm start
```

## 7. 维护与扩展

### 7.1 代码规范
- 遵循ESLint规则
- 使用Prettier保持代码格式一致
- 所有新功能需编写单元测试

### 7.2 功能扩展
如需添加新功能，请遵循以下步骤:
1. 更新需求文档(`01-requirements.md`)
2. 修改设计文档(`02-design.md`)
3. 实现代码并添加测试
4. 更新项目说明文档

## 8. 故障排除

常见问题及解决方法:

- **节点连接失败**: 检查TRON_NODE_URL配置和网络连接
- **API响应缓慢**: 调整REQUEST_TIMEOUT和MAX_RETRIES参数
- **日志级别调整**: 修改LOG_LEVEL环境变量(debug/info/warn/error)

## 9. 联系方式

项目维护者: [Your Name]
邮箱: [your.email@example.com]