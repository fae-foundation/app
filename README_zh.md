> [!WARNING]
>  Arctica 应用仍在原型开发和早期开发阶段。

# Arctica

 **[🇨🇳 中文](./README_zh.md)  |  [🇺🇸 English](./README.md)**

> 去中心化同人站 - 在链上分享和保存你的同人作品

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Lens Protocol](https://img.shields.io/badge/Protocol-Lens-dark.svg)](https://lens.xyz/docs/protocol)
[![Grove Storage](https://img.shields.io/badge/Storage-Grove-orange.svg)](https://lens.xyz/docs/storage)
[![License: AGPL](https://img.shields.io/badge/License-AGPL-purple.svg)](https://opensource.org/licenses/agpl-v3)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.75-orange.svg)](https://tanstack.com/query)

## 🩵 项目概述

**Arctica** 是一个去中心化的同人平台，为创作者提供了一个安全、开放的环境来分享和保存同人作品。作为 Tumblr、Pixiv 和 Lofter 的替代方案，Arctica 基于区块链技术，确保创作者的作品长期保存并拥有完全的所有权。

## ✨ 核心功能

- **🚢 链上存储**: 基于 Lens Protocol 的长期内容存储
- **🎨 上传编辑**: 富文本编辑器，支持图片、文本混合创作
- **🌐 去中心化**: 自审查，创作者完全拥有内容所有权
- **👥 社交互动**: 关注、点赞、评论和分享功能
- **🔍 内容发现**: 智能推荐和标签分类系统
- **🌍 多语言支持**: 支持中文和英文界面切换
- **📱 响应式设计**: 优化的移动端和桌面端体验
- **🎭 同人文化**: 专为同人创作社区设计的功能

## 🧱 技术架构

### 技术栈

| 层级 | 技术 | 用途 |
| ----------------- | -------------------------------------------- | ------------------------------------------- |
| **前端框架**      | Next.js 14.2.16 + TypeScript 5.0 + App Router | 现代 React 应用，支持服务端渲染             |
| **区块链协议**    | Lens Protocol + Grove Storage                | 去中心化内容存储和社交图谱                 |
| **Web3 集成**     | Wagmi v2.15 + Viem v2.29 + ConnectKit       | 钱包连接和区块链交互                       |
| **状态管理**      | Zustand 5.0 + TanStack Query v5.75          | 应用状态和服务器数据管理                   |
| **UI 组件库**     | TailwindCSS 3.4 + Radix UI + shadcn/ui      | 组件库和设计系统                           |
| **国际化**        | next-intl 4.3                               | 多语言支持                                 |
| **实时通信**      | XMTP React SDK                               | 消息传递                           |
| **主题系统**      | next-themes 0.4 + Mantine 8.2               | 深色/浅色主题切换                          |

## 🚀 快速开始

### 环境要求

- Node.js 22+ 和 pnpm 9.7+
- Git 版本控制
- Web3 钱包 (MetaMask 等)

### 安装步骤

```bash
# 克隆仓库
git clone git clone https://github.com/fae-foundation/app.git
cd app

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:3000` 查看应用。

### 环境配置

```bash
# 复制环境模板
cp .env.example .env.local

# 配置环境变量
# .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
NEXT_PUBLIC_ALCHEMY_ID=kkkkkkkkkkkkkkkkkkkkk

NEXT_PUBLIC_ENVIRONMENT=development

NEXT_PUBLIC_APP_ADDRESS_TESTNET=0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD 

LENS_API_KEY_TESTNET=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb 
```

## 📁 项目结构

```
Arctica/
├── src/
│   ├── app/                          # Next.js App Router 页面
│   │   ├── [locale]/                # 国际化路由
│   │   │   ├── feed/                # 动态流页面
│   │   │   ├── profile/             # 用户资料
│   │   │   ├── discover/            # 搜索器
│   │   │   └── p/[postid]/         # 帖子详情
│   │   └── globals.css              # 全局样式
│   ├── components/
│   │   ├── auth/                    # 身份认证组件
│   │   ├── comment/                 # 评论系统
│   │   ├── dialogs/                 # 对话框组件
│   │   ├── editer/                  # 富文本编辑器
│   │   ├── feed/                    # 动态流组件
│   │   ├── home/                    # 首页组件
│   │   ├── providers/               # 上下文提供者
│   │   ├── ui/                      # 可复用 UI 组件
│   │   └── user/                    # 用户相关组件
│   ├── contexts/                    # React 上下文
│   ├── hooks/                       # 自定义 React Hooks
│   ├── i18n/                        # 国际化配置
│   ├── lib/                         # 工具库和配置
│   ├── stores/                      # 状态管理
│   └── utils/                       # 工具函数
├── public/                          # 静态资源
├── txt/                            # 文档和配置
├── package.json                     # 项目依赖配置
└── README.md
```

## 🎮 使用指南

### 1. 连接钱包

点击页面右上角的"连接钱包"按钮，支持 邮箱登录、MetaMask、WalletConnect 等主流钱包。

### 2. 创建内容

- 导航到"创作"页面
- 使用富文本编辑器创作内容
- 添加图片、标签和描述
- 发布到链上存储

### 3. 探索内容

- 在"发现"页面浏览热门内容
- 使用标签筛选感兴趣的内容
- 关注喜欢的创作者
- 与内容互动（点赞、评论、分享）

### 4. 管理资料

- 编辑个人资料和头像
- 查看创作历史
- 管理关注列表
- 设置个人偏好

## 🔧 开发脚本

```bash
# 开发
pnpm dev                          # 启动开发服务器
```

```bash
pnpm build                        # 构建生产版本
pnpm start                        # 启动生产服务器
pnpm lint                         # 代码检查

# 类型检查
pnpm type-check                   # TypeScript 类型检查

# 代码格式化
pnpm format                       # 代码格式化
pnpm format:check                 # 检查代码格式
```

## 🌐 多语言支持

Arctica 目前支持以下语言：

- 🇨🇳 中文简体
- 🇺🇸 English

语言切换功能位于页面左侧的语言选择器中。

## 🤝 贡献指南

我们欢迎社区贡献！请查看我们的[贡献指南](./CONTRIBUTING.md)了解详情。

## 🛣️ 发展路线图

详细的待办事项请查看 [todos.md](./todos.md)。


## 📄 开源许可

本项目基于 AGPL-3.0 许可证开源 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 🕊️ 支持与联系

- 📮 邮箱联系: `faefoundation@protonmail.com`
- 👾 问题反馈: [Issues](https://github.com/fae-foundation/app/issues)
- 💬 社区讨论: [Discussions](https://github.com/orgs/fae-foundation/discussions)


⭐ 如果这个项目对你有帮助，请给我们一个 Star！

**Made with 🩵 by the FAE Foundation**