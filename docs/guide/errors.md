# 错误处理

正确的错误处理是构建稳定 Bot 的关键。NapLink 提供了完善的错误体系。

## 错误类型

NapLink 定义了以下错误类型：

```typescript
import {
  NapLinkError,           // 基类
  ConnectionError,        // 连接错误
  ApiTimeoutError,        // API超时
  ApiError,               // API调用失败
  MaxReconnectAttemptsError,  // 重连超限
  ConnectionClosedError,  // 连接关闭
  InvalidConfigError,     // 无效配置
} from 'naplink';
```

## 连接错误处理

### ConnectionError

连接失败时抛出。

```typescript
try {
  await client.connect();
} catch (error) {
  if (error instanceof ConnectionError) {
    console.error('连接失败:', error.message);
    console.error('详情:', error.details);
    // 可能的原因：
    // - NapCat 未启动
    // - URL 错误
    // - 网络问题
  }
}
```

### MaxReconnectAttemptsError

达到最大重连次数时抛出。

```typescript
client.on('error', (error) => {
  if (error instanceof MaxReconnectAttemptsError) {
    console.error('重连失败，已达到最大次数');
    // 决定是否退出程序
    process.exit(1);
  }
});
```

## API 错误处理

### ApiTimeoutError

API 调用超时。

```typescript
try {
  await client.sendGroupMessage('123456', 'Hello');
} catch (error) {
  if (error instanceof ApiTimeoutError) {
    console.error('API 调用超时');
    console.error('方法:', error.details.method);
    console.error('超时时间:', error.details.timeout);
  }
}
```

### ApiError

API 返回错误。

```typescript
try {
  await client.sendGroupMessage('invalid_id', 'Hello');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API 错误');
    console.error('返回码:', error.details.retcode);
    console.error('错误消息:', error.details.message);
    
    // 根据返回码处理
    if (error.details.retcode === 100) {
      console.error('参数错误');
    }
  }
}
```

## 最佳实践

### 1. 始终处理连接错误

```typescript
async function connectBot() {
  try {
    await client.connect();
    console.log('✅ 连接成功');
  } catch (error) {
    if (error instanceof ConnectionError) {
      console.error('❌ 连接失败，5秒后重试...');
      setTimeout(connectBot, 5000);
    } else {
      console.error('❌ 未知错误:', error);
      process.exit(1);
    }
  }
}

connectBot();
```

### 2. 事件处理器中的错误

```typescript
client.on('message.group', async (data) => {
  try {
    // 处理消息
    await processMessage(data);
  } catch (error) {
    console.error('处理消息失败:', error);
    // 不让单个消息的错误影响整个 bot
  }
});
```

### 3. 优雅关闭

```typescript
process.on('SIGINT', async () => {
  console.log('正在关闭...');
  client.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('正在关闭...');
  client.disconnect();
  process.exit(0);
});
```

### 4. 错误日志

```typescript
function logError(error: Error) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] 错误:`, error.message);
  
  if (error instanceof NapLinkError) {
    console.error('错误代码:', error.code);
    console.error('详情:', error.details);
  }
  
  console.error('堆栈:', error.stack);
}

try {
  await client.connect();
} catch (error) {
  logError(error as Error);
}
```

### 5. 重试机制

```typescript
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for(let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      console.log(`重试 ${i + 1}/${maxRetries}...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('不应该到达这里');
}

// 使用
await retryOperation(() => 
  client.sendGroupMessage('123456', 'Hello')
);
```

## 错误监控

### 使用 Sentry

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: 'your-dsn' });

try {
  await client.connect();
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

### 自定义错误上报

```typescript
function reportError(error: Error) {
  // 上报到你的监控系统
  fetch('https://your-monitor.com/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
    }),
  });
}
```

## 调试技巧

### 启用调试日志

```typescript
const client = new NapLink({
  connection: { url: '...' },
  logging: { level: 'debug' },
});
```

### 捕获所有事件

```typescript
client.on('raw', (data) => {
  console.log('原始事件:', JSON.stringify(data, null, 2));
});
```

## 下一步

- [最佳实践](/guide/best-practices) - 编写更好的代码
- [架构设计](/guide/architecture) - 了解内部实现
