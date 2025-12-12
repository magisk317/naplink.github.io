# 架构设计

了解NapLink的内部架构和设计理念。

## 架构概览

```
┌─────────────────────────────────────┐
│          NapLink (主类)              │
│          extends EventEmitter        │
└─────────────────────────────────────┘
           │
           ├── ConnectionManager  (连接管理)
           │   ├── ReconnectService  (重连服务)
           │   └── HeartbeatService  (心跳服务)
           │
           ├── ApiClient  (API调用)
           │
           └── EventRouter  (事件路由)
```

## 核心组件

### 1. ConnectionManager

负责WebSocket连接的完整生命周期管理。

**职责**：
- WebSocket 连接/断开
- 连接超时控制
- 状态管理
- 错误处理

**状态机**：
```
DISCONNECTED → CONNECTING → CONNECTED
              ↓              ↓
              ← RECONNECTING ←
```

### 2. ReconnectService

实现指数退避重连策略。

**算法**：
```
delay = min(initial * multiplier^attempt, max)
```

**示例**：
```
尝试1: 1秒后
尝试2: 2秒后
尝试3: 4秒后
尝试4: 8秒后
...
最多: 60秒
```

### 3. HeartbeatService

定期发送心跳保持连接活跃。

**机制**：
- 定时发送ping
- 检测pong响应
- 连续超时触发重连

### 4. ApiClient

管理所有API请求和响应。

**特性**：
- 请求/响应匹配（通过echo）
- 超时控制
- 自动重试
- 内存清理

### 5. EventRouter

解析和分发OneBot事件。

**流程**：
```
原始消息 → 解析 → 路由 → 触发事件
                  ↓
              层级化事件树
```

## 设计原则

### 1. 单一职责

每个类只负责一件事：
- ConnectionManager只管连接
- ApiClient只管API
- EventRouter只管事件

### 2. 依赖注入

所有依赖通过构造函数注入：

```typescript
constructor(
  private connection: ConnectionManager,
  private config: NapLinkConfig,
  private logger: Logger
) {}
```

### 3. 事件驱动

使用EventEmitter模式：

```typescript
client.emit('connect');
client.on('connect', handler);
```

### 4. 类型安全

完整的TypeScript类型：

```typescript
async call<T extends keyof WSSendParam>(
  method: T,
  params: WSSendParam[T]
): Promise<WSSendReturn[T]>
```

## 核心流程

### 连接流程

```
1. 用户调用 connect()
2. ConnectionManager 创建 WebSocket
3. 设置超时定时器
4. 监听 onopen 事件
5. 启动心跳服务
6. 触发 'connect' 事件
```

### 消息接收流程

```
1. WebSocket 收到消息
2. 解析 JSON
3. 检查是否有 echo（API响应）
   - 有：交给 ApiClient 处理
   - 无：交给 EventRouter 路由
4. EventRouter 解析事件类型
5. 触发层级化事件
```

### API调用流程

```
1. 用户调用 API 方法
2. 生成唯一 echo
3. 创建 Promise
4. 设置超时定时器
5. 发送请求
6. 等待响应
7. 匹配 echo
8. resolve/reject Promise
```

## 性能优化

### 1. 内存管理

定期清理过期的待处理请求：

```typescript
setInterval(() => {
  const now = Date.now();
  for (const [id, req] of this.pendingRequests) {
    if (now - req.createdAt > timeout * 2) {
      this.pendingRequests.delete(id);
    }
  }
}, 60000);
```

### 2. 事件优化

使用Map存储事件处理器，O(1)查找。

### 3. 私有字段

使用`#`私有字段而非`private`，真正的私有化。

## 扩展性

### 自定义Logger

```typescript
interface Logger {
  debug(message: string, ...meta: any[]): void;
  // ...
}
```

### 自定义配置

所有配置都有默认值，支持部分覆盖。

## 与其他SDK的区别

查看 [对比分析](/guide/comparison) 了解详情。
