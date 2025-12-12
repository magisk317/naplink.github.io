---
layout: home

hero:
  name: NapLink
  text: 现代化的 NapCat SDK
  tagline: 类型安全 · 易于使用 · 功能完整
  image:
    src: /logo.svg
    alt: NapLink
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/naplink/naplink

features:
  - icon: 🚀
    title: 现代化设计
    details: 使用最新的 TypeScript 和 ES2022 特性，提供一流的开发体验
  
  - icon: 🔐
    title: 类型安全
    details: 完整的 TypeScript 类型定义，编译时捕获错误
  
  - icon: 🔄
    title: 智能重连
    details: 内置指数退避重连机制，自动处理网络波动
  
  - icon: ⏱️
    title: 超时控制
    details: API 调用和连接超时保护，避免永久挂起
  
  - icon: 📊
    title: 完善的日志
    details: 分级日志系统，支持自定义 logger，易于调试
  
  - icon: 💪
    title: 稳定可靠
    details: 自动心跳检测和故障恢复，确保连接稳定
---

## 快速开始

::: code-group
```bash [npm]
npm install naplink
```

```bash [pnpm]
pnpm add naplink
```

```bash [yarn]
yarn add naplink
```
:::

```typescript
import { NapLink } from 'naplink';

const client = new NapLink({
  connection: {
    url: 'ws://localhost:3001',
  },
});

client.on('message', (data) => {
  console.log('收到消息:', data);
});

await client.connect();
```

## 为什么选择 NapLink？

NapLink 是基于对现有 NapCat SDK 深入分析后，从零开始创建的现代化客户端库。

相比其他 SDK，NapLink 具有：

- ✅ **API 超时控制** - 避免请求永久挂起
- ✅ **指数退避重连** - 避免重连风暴
- ✅ **结构化错误** - 清晰的错误信息和调试
- ✅ **自动重试** - 提高调用成功率
- ✅ **内存安全** - 自动清理过期请求

查看 [与其他 SDK 对比](/guide/comparison) 了解更多详情。
