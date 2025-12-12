# 配置选项

NapLink配置类型的完整参考。

## NapLinkConfig

完整的配置接口。通常你不需要提供所有选项，使用 `PartialNapLinkConfig` 即可。

```typescript
interface NapLinkConfig {
  connection: ConnectionConfig;
  reconnect: ReconnectConfig;
  logging: LoggingConfig;
  api: ApiConfig;
}
```

## PartialNapLinkConfig

部分配置类型，用于构造函数。

```typescript
type PartialNapLinkConfig = {
  connection: {
    url: string;
    token?: string;
    timeout?: number;
    pingInterval?: number;
  };
  reconnect?: Partial<ReconnectConfig>;
  logging?: Partial<LoggingConfig>;
  api?: Partial<ApiConfig>;
};
```

**示例**：
```typescript
const config: PartialNapLinkConfig = {
  connection: {
    url: 'ws://localhost:3001',
    token: 'my_token',
  },
  reconnect: {
    enabled: true,
  },
};
```

## ConnectionConfig

连接配置。

```typescript
interface ConnectionConfig {
  url: string;
  token?: string;
  timeout?: number;
  pingInterval?: number;
}
```

### url

- **类型**: `string`
- **必需**: 是
- **说明**: WebSocket服务器地址

```typescript
url: 'ws://localhost:3001'
```

### token

- **类型**: `string`
- **必需**: 否
- **说明**: 访问令牌

```typescript
token: 'your_access_token'
```

### timeout

- **类型**: `number`
- **必需**: 否
- **默认**: `30000`（30秒）
- **说明**: 连接超时时间（毫秒）

```typescript
timeout: 60000  // 60秒
```

### pingInterval

- **类型**: `number`
- **必需**: 否
- **默认**: `30000`（30秒）
- **说明**: 心跳间隔（毫秒），设为0禁用

```typescript
pingInterval: 0  // 禁用心跳
```

## ReconnectConfig

重连配置。

```typescript
interface ReconnectConfig {
  enabled: boolean;
  maxAttempts: number;
  backoff: BackoffConfig;
}
```

### enabled

- **类型**: `boolean`
- **默认**: `true`
- **说明**: 是否启用自动重连

### maxAttempts

- **类型**: `number`
- **默认**: `10`
- **说明**: 最大重连次数

### backoff

- **类型**: `BackoffConfig`
- **说明**: 指数退避配置

## BackoffConfig

退避策略配置。

```typescript
interface BackoffConfig {
  initial: number;
  max: number;
  multiplier: number;
}
```

### initial

- **类型**: `number`
- **默认**: `1000`（1秒）
- **说明**: 初始延迟（毫秒）

### max

- **类型**: `number`
- **默认**: `60000`（60秒）
- **说明**: 最大延迟（毫秒）

### multiplier

- **类型**: `number`
- **默认**: `2`
- **说明**: 退避倍数

**工作原理**：
```
delay = min(initial * multiplier^attempt, max)
```

## LoggingConfig

日志配置。

```typescript
interface LoggingConfig {
  level: LogLevel;
  logger?: Logger;
}
```

### level

- **类型**: `'debug' | 'info' | 'warn' | 'error' | 'off'`
- **默认**: `'info'`
- **说明**: 日志等级

### logger

- **类型**: `Logger`
- **必需**: 否
- **说明**: 自定义logger实现

## Logger

自定义logger接口。

```typescript
interface Logger {
  debug(message: string, ...meta: any[]): void;
  info(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  error(message: string, error?: Error, ...meta: any[]): void;
}
```

**示例**：
```typescript
const customLogger: Logger = {
  debug(msg, ...meta) { console.debug(msg, ...meta); },
  info(msg, ...meta) { console.info(msg, ...meta); },
  warn(msg, ...meta) { console.warn(msg, ...meta); },
  error(msg, err, ...meta) { console.error(msg, err, ...meta); },
};
```

## ApiConfig

API配置。

```typescript
interface ApiConfig {
  timeout: number;
  retries: number;
}
```

### timeout

- **类型**: `number`
- **默认**: `30000`（30秒）
- **说明**: API调用超时时间（毫秒）

### retries

- **类型**: `number`
- **默认**: `3`
- **说明**: API调用失败重试次数

## DEFAULT_CONFIG

默认配置常量。

```typescript
const DEFAULT_CONFIG: Omit<NapLinkConfig, 'connection'> = {
  reconnect: {
    enabled: true,
    maxAttempts: 10,
    backoff: {
      initial: 1000,
      max: 60000,
      multiplier: 2,
    },
  },
  logging: {
    level: 'info',
  },
  api: {
    timeout: 30000,
    retries: 3,
  },
};
```

## 完整示例

```typescript
import { NapLink, type PartialNapLinkConfig, type Logger } from 'naplink';

// 自定义logger
const myLogger: Logger = {
  debug: (msg, ...meta) => console.debug(msg, ...meta),
  info: (msg, ...meta) => console.info(msg, ...meta),
  warn: (msg, ...meta) => console.warn(msg, ...meta),
  error: (msg, err, ...meta) => console.error(msg, err, ...meta),
};

// 完整配置
const config: PartialNapLinkConfig = {
  connection: {
    url: process.env.NAPCAT_URL!,
    token: process.env.NAPCAT_TOKEN,
    timeout: 60000,
    pingInterval: 30000,
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
  logging: {
    level: 'debug',
    logger: myLogger,
  },
  api: {
    timeout: 15000,
    retries: 5,
  },
};

const client = new NapLink(config);
```

## 相关文档

- [配置指南](/guide/configuration) - 配置详解和使用示例
- [NapLink类](/api/naplink) - 主要API方法
