# 错误类型

NapLink错误类型的完整参考。

## 错误继承关系

```
Error (原生)
  └── NapLinkError (基类)
      ├── ConnectionError
      ├── ApiTimeoutError
      ├── ApiError
      ├── MaxReconnectAttemptsError
      ├── ConnectionClosedError
      └── InvalidConfigError
```

## NapLinkError

所有NapLink错误的基类。

```typescript
class NapLinkError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  );
  
  toJSON(): object;
}
```

### 属性

- `message` - `string` 错误消息
- `code` - `string` 错误代码
- `details` - `any` 错误详情（可选）
- `name` - `string` 错误名称（继承自Error）
- `stack` - `string` 堆栈跟踪（继承自Error）

### 方法

#### toJSON()

转换为JSON格式。

```typescript
{
  name: string;
  message: string;
  code: string;
  details?: any;
}
```

### 示例

```typescript
try {
  await client.connect();
} catch (error) {
  if (error instanceof NapLinkError) {
    console.log(error.code);
    console.log(error.details);
    console.log(error.toJSON());
  }
}
```

## ConnectionError

连接错误。

```typescript
class ConnectionError extends NapLinkError {
  constructor(message: string, cause?: any);
}
```

### 错误代码

`E_CONNECTION`

### 触发场景

- WebSocket连接失败
- 网络错误
- URL无效
- NapCat未运行

### 示例

```typescript
try {
  await client.connect();
} catch (error) {
  if (error instanceof ConnectionError) {
    console.error('连接失败:', error.message);
    console.error('原因:', error.details);
  }
}
```

## ApiTimeoutError

API调用超时错误。

```typescript
class ApiTimeoutError extends NapLinkError {
  constructor(method: string, timeout: number);
}
```

### 错误代码

`E_API_TIMEOUT`

### 详情字段

```typescript
{
  method: string;   // API方法名
  timeout: number;  // 超时时间(ms)
}
```

### 示例

```typescript
try {
  await client.sendGroupMessage('123', 'Hi');
} catch (error) {
  if (error instanceof ApiTimeoutError) {
    console.error('API超时');
    console.error('方法:', error.details.method);
    console.error('超时时间:', error.details.timeout);
  }
}
```

## ApiError

API调用失败错误。

```typescript
class ApiError extends NapLinkError {
  constructor(
    method: string,
    retcode: number,
    message: string,
    wording?: string
  );
}
```

### 错误代码

`E_API_FAILED`

### 详情字段

```typescript
{
  method: string;    // API方法名
  retcode: number;   // OneBot返回码
  message: string;   // 错误消息
  wording?: string;  // 用户友好的错误描述
}
```

### 常见返回码

- `0` - 成功
- `1` - 异步调用
- `100` - 参数缺失或参数无效
- `102` - 操作失败
- `103` - 资源未找到
- `104` - 权限不足

### 示例

```typescript
try {
  await client.sendGroupMessage('invalid_id', 'Hi');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API错误');
    console.error('返回码:', error.details.retcode);
    console.error('消息:', error.details.message);
    
    if (error.details.retcode === 100) {
      console.error('参数错误');
    }
  }
}
```

## MaxReconnectAttemptsError

达到最大重连次数错误。

```typescript
class MaxReconnectAttemptsError extends NapLinkError {
  constructor(attempts: number);
}
```

### 错误代码

`E_MAX_RECONNECT`

### 详情字段

```typescript
{
  attempts: number;  // 重连次数
}
```

### 示例

```typescript
client.on('error', (error) => {
  if (error instanceof MaxReconnectAttemptsError) {
    console.error(`重连失败，已尝试${error.details.attempts}次`);
    process.exit(1);
  }
});
```

## ConnectionClosedError

连接关闭错误。

```typescript
class ConnectionClosedError extends NapLinkError {
  constructor(code: number, reason: string);
}
```

### 错误代码

`E_CONNECTION_CLOSED`

### 详情字段

```typescript
{
  code: number;     // 关闭代码
  reason: string;   // 关闭原因
}
```

### WebSocket关闭代码

- `1000` - 正常关闭
- `1006` - 异常关闭
- `1011` - 服务器错误

### 示例

```typescript
try {
  await client.sendMessage({ /* ... */ });
} catch (error) {
  if (error instanceof ConnectionClosedError) {
    console.error('连接已关闭');
    console.error('代码:', error.details.code);
    console.error('原因:', error.details.reason);
  }
}
```

## InvalidConfigError

无效配置错误。

```typescript
class InvalidConfigError extends NapLinkError {
  constructor(field: string, reason: string);
}
```

### 错误代码

`E_INVALID_CONFIG`

### 详情字段

```typescript
{
  field: string;    // 配置字段
  reason: string;   // 错误原因
}
```

### 示例

```typescript
try {
  const client = new NapLink({
    connection: {
      url: '',  // 空URL
    },
  });
} catch (error) {
  if (error instanceof InvalidConfigError) {
    console.error('配置错误');
    console.error('字段:', error.details.field);
    console.error('原因:', error.details.reason);
  }
}
```

## 错误处理最佳实践

### 1. 类型检查

```typescript
import {
  NapLinkError,
  ConnectionError,
  ApiTimeoutError,
  ApiError,
} from 'naplink';

try {
  await client.connect();
} catch (error) {
  if (error instanceof ConnectionError) {
    // 处理连接错误
  } else if (error instanceof ApiTimeoutError) {
    // 处理超时
  } else if (error instanceof ApiError) {
    // 处理API错误
  } else if (error instanceof NapLinkError) {
    // 处理其他NapLink错误
  } else {
    // 处理未知错误
  }
}
```

### 2. 错误日志

```typescript
function logError(error: Error) {
  if (error instanceof NapLinkError) {
    console.error({
      name: error.name,
      code: error.code,
      message: error.message,
      details: error.details,
      stack: error.stack,
    });
  } else {
    console.error(error);
  }
}
```

### 3. 错误上报

```typescript
function reportError(error: Error) {
  if (error instanceof NapLinkError) {
    // 上报到监控系统
    monitor.captureException(error, {
      extra: {
        code: error.code,
        details: error.details,
      },
    });
  }
}
```

## 相关文档

- [错误处理指南](/guide/errors) - 错误处理最佳实践
- [NapLink类](/api/naplink) - 主要API方法
