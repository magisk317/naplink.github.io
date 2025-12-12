# 最佳实践

编写稳定、高效的 NapLink 机器人的最佳实践。

## 项目结构

推荐的项目结构：

```
my-bot/
├── src/
│   ├── index.ts          # 入口文件
│   ├── client.ts         # 客户端初始化
│   ├── commands/         # 命令处理
│   │   ├── index.ts
│   │   ├── help.ts
│   │   └── ping.ts
│   ├── handlers/         # 事件处理器
│   │   ├── message.ts
│   │   ├── notice.ts
│   │   └── request.ts
│   ├── utils/            # 工具函数
│   │   ├── logger.ts
│   │   └── config.ts
│   └── types/            # 类型定义
│       └── index.ts
├── .env                  # 环境变量
├── package.json
└── tsconfig.json
```

## 配置管理

使用环境变量：

```typescript
// src/utils/config.ts
import { config } from 'dotenv';

config();

export const CONFIG = {
  napcat: {
    url: process.env.NAPCAT_URL || 'ws://localhost:3001',
    token: process.env.NAPCAT_TOKEN,
  },
  bot: {
    adminIds: process.env.ADMIN_IDS?.split(',') || [],
  },
};
```

`.env` 文件：
```
NAPCAT_URL=ws://localhost:3001
NAPCAT_TOKEN=your_token
ADMIN_IDS=12345,67890
```

## 模块化命令

```typescript
// src/commands/index.ts
import { NapLink } from 'naplink';

export interface Command {
  name: string;
  description: string;
  execute: (client: NapLink, groupId: string, args: string[]) => Promise<void>;
}

export const commands: Command[] = [
  {
    name: '/help',
    description: '显示帮助',
    async execute(client, groupId) {
      const help = commands.map(cmd => 
        `${cmd.name} - ${cmd.description}`
      ).join('\n');
      await client.sendGroupMessage(groupId, help);
    },
  },
  {
    name: '/ping',
    description: '测试响应',
    async execute(client, groupId) {
      await client.sendGroupMessage(groupId, 'Pong!');
    },
  },
];

// src/handlers/message.ts
import { commands } from '../commands';

export function setupMessageHandler(client: NapLink) {
  client.on('message.group', async (data) => {
    const [cmdName, ...args] = data.raw_message.split(' ');
    const command = commands.find(cmd => cmd.name === cmdName);
    
    if (command) {
      try {
        await command.execute(client, data.group_id, args);
      } catch (error) {
        console.error(`命令 ${cmdName} 执行失败:`, error);
      }
    }
  });
}
```

## 错误处理

全局错误处理：

```typescript
// src/utils/errorHandler.ts
import { NapLinkError } from 'naplink';

export function setupErrorHandling() {
  process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    // 记录日志但不退出
  });
  
  process.on('unhandledRejection', (reason) => {
    console.error('未处理的 Promise 拒绝:', reason);
  });
}

export function handleError(error: unknown) {
  if (error instanceof NapLinkError) {
    console.error(`[${error.code}] ${error.message}`);
    console.error('详情:', error.details);
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('未知错误:', error);
  }
}
```

## 日志管理

使用专业的日志库：

```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

// 使用
import { logger } from './utils/logger';
logger.info('Bot 已启动');
logger.error('处理消息失败', { error });
```

## 性能优化

### 1. 消息去重

```typescript
const processedMessages = new Set<string>();

client.on('message', (data) => {
  if (processedMessages.has(data.message_id)) {
    return; // 已处理过
  }
  
  processedMessages.add(data.message_id);
  
  // 定期清理
  if (processedMessages.size > 10000) {
    processedMessages.clear();
  }
  
  // 处理消息...
});
```

### 2. 限流

```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canProcess(userId: string, maxRequests = 5, windowMs = 60000): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // 清理过期记录
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    return true;
  }
}

const limiter = new RateLimiter();

client.on('message.group', async (data) => {
  if (!limiter.canProcess(data.user_id.toString())) {
    await client.sendGroupMessage(data.group_id, '请求太频繁');
    return;
  }
  
  // 处理消息...
});
```

### 3. 缓存

```typescript
class Cache<T> {
  private cache = new Map<string, { value: T; expires: number }>();
  
  set(key: string, value: T, ttl = 300000) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl,
    });
  }
  
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
}

const groupCache = new Cache<any>();

async function getGroupInfo(groupId: string) {
  const cached = groupCache.get(groupId);
  if (cached) return cached;
  
  const info = await client.getGroupInfo(groupId);
  groupCache.set(groupId, info);
  return info;
}
```

## 安全实践

### 1. 输入验证

```typescript
function isValidGroupId(id: string): boolean {
  return /^\d+$/.test(id) && id.length > 5;
}

function sanitizeMessage(message: string): string {
  // 移除潜在的恶意字符
  return message.replace(/[<>]/g, '');
}
```

### 2. 权限控制

```typescript
const ADMIN_IDS = new Set(['12345', '67890']);

function isAdmin(userId: string): boolean {
  return ADMIN_IDS.has(userId);
}

client.on('message.group', async (data) => {
  if (data.raw_message.startsWith('/admin')) {
    if (!isAdmin(data.user_id.toString())) {
      await client.sendGroupMessage(data.group_id, '权限不足');
      return;
    }
    
    // 执行管理命令...
  }
});
```

## 测试

### 单元测试

```typescript
// tests/commands.test.ts
import { describe, it, expect } from 'vitest';

describe('Commands', () => {
  it('should execute help command', async () => {
    const result = await executeCommand('/help');
    expect(result).toContain('帮助');
  });
});
```

## 部署

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

CMD ["node", "dist/index.js"]
```

### PM2

```json
{
  "apps": [{
    "name": "naplink-bot",
    "script": "dist/index.js",
    "instances": 1,
    "autorestart": true,
    "watch": false,
    "max_memory_restart": "1G",
    "env": {
      "NODE_ENV": "production"
    }
  }]
}
```

## 监控

```typescript
// 定期报告状态
setInterval(async () => {
  const status = await client.getStatus();
  logger.info('Bot 状态', { status });
}, 60000);

// 监控内存使用
setInterval(() => {
  const usage = process.memoryUsage();
  logger.info('内存使用', {
    rss: `${(usage.rss / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
  });
}, 300000);
```

## 下一步

- [架构设计](/guide/architecture) - 了解NapLink内部
- [对比分析](/guide/comparison) - 与其他SDK的区别
