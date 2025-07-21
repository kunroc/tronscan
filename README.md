# TronScan

Tron区块链浏览器和分析工具，提供实时区块数据查询、交易分析和网络监控功能。

## 项目概述
TronScan是一个开源的区块链浏览器，旨在提供Tron网络的实时数据可视化和分析能力。该工具允许用户查看区块详情、交易记录、账户余额以及智能合约信息。

## 核心功能
- 实时区块数据查询
- 交易记录分析
- 账户余额监控
- 智能合约交互
- 网络状态可视化

## 技术栈
- TypeScript
- Node.js
- Express
- TronWeb SDK
- Jest (测试)

## 快速开始

### 前提条件
- Node.js v14+ 和 npm
- Git

### 安装步骤
1. 克隆仓库
```bash
git clone https://github.com/kunroc/tronscan.git
cd tronscan
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制.env.example为.env并修改配置
```bash
cp .env.example .env
```

4. 启动开发服务器
```bash
npm run dev
```

5. 访问应用
- 应用地址: http://localhost:3000
- 健康检查: http://localhost:3000/health
- 最新区块: http://localhost:3000/latest-block

## API接口
- `GET /health` - 服务健康检查
- `GET /latest-block` - 获取最新区块信息
- `GET /block/:hash` - 通过哈希获取区块详情
- `GET /transaction/:id` - 获取交易详情
- `GET /account/:address` - 获取账户信息

## 项目结构
```
├── .env.example       # 环境变量示例
├── .gitignore         # Git忽略文件
├── doc/               # 项目文档
├── src/               # 源代码
│   ├── api/           # API接口
│   ├── config/        # 配置文件
│   ├── processor/     # 数据处理
│   ├── routes/        # 路由定义
│   ├── types/         # 类型定义
│   └── utils/         # 工具函数
└── tests/             # 测试文件
```

## 部署指南
### 生产环境构建
```bash
npm run build
npm start
```

### Docker部署
(待实现)

## 贡献指南
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证
本项目采用MIT许可证 - 详见LICENSE文件

## 联系方式
项目维护者: kunroc
GitHub: https://github.com/kunroc/tronscan