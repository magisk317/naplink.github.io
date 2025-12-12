# 快速开始

本指南将帮助你在几分钟内创建第一个使用 NapLink 的机器人。

## 前置要求

- Node.js 18 或更高版本
- 一个运行中的 NapCat 实例

## 安装

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

## Hello World

创建一个简单的复读机器人：

```typescript
import { NapLink } from 'naplink';

// 创建客户端
const client = new NapLink({
  connection: {
    url: 'ws://localhost:3001',  // NapCat WebSocket 地址
    token: 'your_token',          // 访问令牌（可选）
  },
});

// 监听群消息
client.on('message.group', async (data) => {
  console.log(`[群${data.group_id}] ${data.sender.nickname}: ${data.raw_message}`);
  
  // 复读
  if (data.raw_message === '复读') {
    await client.sendGroupMessage(data.group_id, '复读');
  }
});

// 监听连接事件
client.on('connect', () => {
  console.log('✅ 已连接到 NapCat');
});

client.on('disconnect', () => {
  console.log('❌ 连接已断开');
});

// 连接
try {
  await client.connect();
  console.log('🚀 机器人已启动');
} catch (error) {
  console.error('连接失败:', error);
}
```

## 获取登录信息

```typescript
// 获取登录号信息
const info = await client.getLoginInfo();
console.log('登录账号:', info.user_id);
console.log('昵称:', info.nickname);

// 获取群列表
const groups = await client.getGroupList();
console.log(`加入了 ${groups.length} 个群`);
```

## 更复杂的示例

一个带命令处理的机器人：

```typescript
import { NapLink } from 'naplink';

const client = new NapLink({
  connection: { url: 'ws://localhost:3001' },
  logging: { level: 'info' },
});

// 命令处理器
const commands = {
  '/help': async (groupId: string) => {
    await client.sendGroupMessage(groupId, '可用命令:\n/help - 帮助\n/ping - 测试');
  },
  
  '/ping': async (groupId: string) => {
    const start = Date.now();
    await client.sendGroupMessage(groupId, 'Pong!');
    const elapsed = Date.now() - start;
    await client.sendGroupMessage(groupId, `响应时间: ${elapsed}ms`);
  },
};

client.on('message.group', async (data) => {
  const message = data.raw_message.trim();
  const handler = commands[message as keyof typeof commands];
  
  if (handler) {
    await handler(data.group_id);
  }
});

await client.connect();
```

## 错误处理

处理可能的错误：

```typescript
import { 
  NapLink, 
  ConnectionError, 
  ApiTimeoutError,
  ApiError 
} from 'naplink';

const client = new NapLink({ /* ... */ });

try {
  await client.connect();
} catch (error) {
  if (error instanceof ConnectionError) {
    console.error('连接失败:', error.message);
    // 重试或退出
  } else if (error instanceof ApiTimeoutError) {
    console.error('连接超时');
  } else {
    console.error('未知错误:', error);
  }
}

// API 调用错误处理
try {
  await client.sendGroupMessage('123456', 'Hello');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API 错误 (${error.details.retcode}):`, error.message);
  }
}
```

## 下一步

- [配置](/guide/configuration) - 了解所有配置选项
- [API 调用](/guide/api) - 学习如何调用各种 API
- [事件处理](/guide/events) - 处理各种事件
- [API 文档](/api/index) - 查看完整 API 参考
