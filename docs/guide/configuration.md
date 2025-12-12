# 配置

NapLink 提供了灵活的配置系统，所有参数都有合理的默认值。

## 基本配置

最简单的配置只需要提供 WebSocket 连接地址：

```typescript
const client = new NapLink({
  connection: {
    url: 'ws://localhost:3001',
  },
});
```

## 完整配置

以下是所有可用的配置选项：

```typescript
const client = new NapLink({
  // 连接配置（必需）
  connection: {
    url: 'ws://localhost:3001',      // WebSocket 服务器地址
    token: 'your_token',              // 访问令牌（可选）
    timeout: 30000,                   // 连接超时（毫秒，默认30秒）
    pingInterval: 30000,              // 心跳间隔（毫秒，0表示禁用，默认30秒）
  },

  // 重连配置（可选）
  reconnect: {
    enabled: true,                    // 是否启用自动重连（默认true）
    maxAttempts: 10,                  // 最大重连次数（默认10）
    backoff: {
      initial: 1000,                  // 初始延迟（毫秒，默认1秒）
      max: 60000,                     // 最大延迟（毫秒，默认60秒）
      multiplier: 2,                  // 退避倍数（默认2）
    },
  },

  // 日志配置（可选）
  logging: {
    level: 'info',                    // 日志等级（默认info）
    logger: customLogger,             // 自定义 logger（可选）
  },

  // API配置（可选）
  api: {
    timeout: 30000,                   // API 调用超时（毫秒，默认30秒）
    retries: 3,                       // 失败重试次数（默认3）
  },
});
```

## 配置详解

### 连接配置

#### url
- **类型**: `string`
- **必需**: 是
- **说明**: NapCat WebSocket 服务器地址

```typescript
connection: {
  url: 'ws://localhost:3001',  // 本地
  // 或
  url: 'ws://your-server.com:3001',  // 远程
}
```

#### token
- **类型**: `string`
- **必需**: 否
- **说明**: 访问令牌，如果 NapCat 配置了 token 认证

```typescript
connection: {
  url: 'ws://localhost:3001',
  token: 'your_access_token',
}
```

#### timeout
- **类型**: `number`
- **必需**: 否
- **默认**: `30000`（30秒）
- **说明**: 连接超时时间

```typescript
connection: {
  url: 'ws://localhost:3001',
  timeout: 60000,  // 60秒
}
```

#### pingInterval
- **类型**: `number`
- **必需**: 否
- **默认**: `30000`（30秒）
- **说明**: 心跳间隔，设为 0 禁用心跳

```typescript
connection: {
  url: 'ws://localhost:3001',
  pingInterval: 0,  // 禁用心跳
}
```

### 重连配置

#### enabled
- **类型**: `boolean`
- **默认**: `true`
- **说明**: 是否启用自动重连

```typescript
reconnect: {
  enabled: false,  // 禁用自动重连
}
```

#### maxAttempts
- **类型**: `number`
- **默认**: `10`
- **说明**: 最大重连次数

```typescript
reconnect: {
  enabled: true,
  maxAttempts: 5,  // 最多重连5次
}
```

#### backoff
- **类型**: `object`
- **说明**: 指数退避配置

**工作原理**：
1. 第1次重连：`initial` 毫秒后
2. 第2次重连：`initial * multiplier` 毫秒后
3. 第3次重连：`initial * multiplier²` 毫秒后
4. ...以此类推，但不超过 `max`

```typescript
reconnect: {
  backoff: {
    initial: 1000,    // 1秒
    max: 30000,       // 最多30秒
    multiplier: 1.5,  // 每次延迟增加50%
  },
}
```

### 日志配置

#### level
- **类型**: `'debug' | 'info' | 'warn' | 'error' | 'off'`
- **默认**: `'info'`
- **说明**: 日志输出等级

```typescript
logging: {
  level: 'debug',  // 输出所有日志
}
```

#### logger
- **类型**: `Logger`
- **必需**: 否
- **说明**: 自定义 logger 实现

查看 [自定义 Logger](#自定义-logger) 了解详情。

### API 配置

#### timeout
- **类型**: `number`
- **默认**: `30000`（30秒）
- **说明**: API 调用超时时间

```typescript
api: {
  timeout: 10000,  // 10秒超时
}
```

#### retries
- **类型**: `number`
- **默认**: `3`
- **说明**: API 调用失败时的重试次数

```typescript
api: {
  retries: 5,  // 失败后重试5次
}
```

## 常见配置场景

### 开发环境

```typescript
const client = new NapLink({
  connection: {
    url: 'ws://localhost:3001',
  },
  logging: {
    level: 'debug',  // 详细日志
  },
  reconnect: {
    enabled: false,  // 开发时手动重连
  },
});
```

### 生产环境

```typescript
const client = new NapLink({
  connection: {
    url: process.env.NAPCAT_URL!,
    token: process.env.NAPCAT_TOKEN,
    timeout: 60000,
  },
  logging: {
    level: 'warn',  // 只记录警告和错误
  },
  reconnect: {
    enabled: true,
    maxAttempts: 20,
    backoff: {
      initial: 2000,
      max: 60000,
      multiplier: 2,
    },
  },
  api: {
    timeout: 15000,  // 生产环境可能网络较慢
    retries: 5,
  },
});
```

### 高可用场景

```typescript
const client = new NapLink({
  connection: {
    url: 'ws://napcat-server:3001',
    pingInterval: 10000,  // 频繁心跳检测
  },
  reconnect: {
    enabled: true,
    maxAttempts: Infinity,  // 无限重连
    backoff: {
      initial: 1000,
      max: 30000,
      multiplier: 2,
    },
  },
});
```

## 自定义 Logger

你可以提供自己的 logger 实现：

```typescript
import type { Logger } from 'naplink';

const customLogger: Logger = {
  debug(message: string, ...meta: any[]) {
    // 使用你的日志库
    myLogger.debug(message, ...meta);
  },
  info(message: string, ...meta: any[]) {
    myLogger.info(message, ...meta);
  },
  warn(message: string, ...meta: any[]) {
    myLogger.warn(message, ...meta);
  },
  error(message: string, error?: Error, ...meta: any[]) {
    myLogger.error(message, error, ...meta);
  },
};

const client = new NapLink({
  connection: { url: '...' },
  logging: { logger: customLogger },
});
```

## 环境变量

推荐使用环境变量管理敏感配置：

```typescript
const client = new NapLink({
  connection: {
    url: process.env.NAPCAT_WS_URL || 'ws://localhost:3001',
    token: process.env.NAPCAT_TOKEN,
  },
});
```

`.env` 文件示例：
```
NAPCAT_WS_URL=ws://your-server.com:3001
NAPCAT_TOKEN=your_secret_token
```

## 下一步

- [API 调用](/guide/api) - 学习如何调用 API
- [事件处理](/guide/events) - 处理各种事件
- [错误处理](/guide/errors) - 正确处理错误
