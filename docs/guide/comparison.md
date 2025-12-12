# 与其他 SDK 对比

NapLink与其他NapCat/OneBot SDK的详细对比。

## 主要对比对象

- **node-napcat-ts** - 最流行的NapCat SDK
- **@onebots/protocol-onebot-v11** - 官方OneBot协议实现
- **onebot-client-next** - 另一个OneBot客户端

## 功能对比

| 特性 | NapLink | node-napcat-ts | @onebots |
|------|---------|---------------|----------|
| TypeScript | ✅ | ✅ | ✅ |
| 类型完整性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| API超时控制 | ✅ | ❌ | ✅ |
| 指数退避重连 | ✅ | ❌ | ❌ |
| 自动重试 | ✅ | ❌ | ❌ |
| 结构化错误 | ✅ | ⭐⭐ | ⭐⭐⭐ |
| 自定义Logger | ✅ | ❌ | ✅ |
| 分级日志 | ✅ | ❌ | ⭐⭐ |
| 事件系统 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 文档完善度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 社区活跃度 | 🆕 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 详细对比

### vs node-napcat-ts

**NapLink的优势**：

1. **API超时控制**
```typescript
// NapLink - 有超时保护
await client.sendGroupMessage('123', 'Hi');  // 30秒超时

// node-napcat-ts - 无超时，可能永久挂起
await client.send('send_group_msg', { ... });
```

2. **指数退避重连**
```typescript
// NapLink - 智能重连
reconnect: {
  backoff: {
    initial: 1000,
    multiplier: 2,
    max: 60000,
  }
}

// node-napcat-ts - 固定延迟
reconnect: {
  delay: 5000,  // 固定5秒
}
```

3. **结构化错误**
```typescript
// NapLink
if (error instanceof ApiTimeoutError) {
  console.log(error.details.method);
  console.log(error.details.timeout);
}

// node-napcat-ts
// 错误信息较简单
```

**node-napcat-ts的优势**：

1. **稳定性** - 使用时间长，问题已被发现修复
2. **社区** - 下载量高，社区活跃
3. **兼容性** - 被广泛测试

### vs @onebots/protocol-onebot-v11

**NapLink的优势**：

1. **更高层抽象** - 提供便捷的API方法
2. **NapCat专用** - 针对NapCat优化
3. **开箱即用** - 配置简单

**@onebots的优势**：

1. **官方实现** - OneBot标准的参考实现
2. **协议完整** - 支持所有OneBot特性
3. **通用性** - 支持所有OneBot实现（不限NapCat）

## 代码对比

### 发送消息

**NapLink**:
```typescript
await client.sendGroupMessage('123456', '你好');
```

**node-napcat-ts**:
```typescript
await client.send('send_group_msg', {
  group_id: '123456',
  message: '你好',
});
```

**@onebots**:
```typescript
await client.sendMessage({
  message_type: 'group',
  group_id: '123456',
  message: '你好',
});
```

### 事件监听

**NapLink**:
```typescript
client.on('message.group', (data) => {
  console.log(data.raw_message);
});
```

**node-napcat-ts**:
```typescript
client.on('message.group', (data) => {
  console.log(data.raw_message);
});
```

## 选择建议

### 选择 NapLink，如果你：
- ✅ 需要更完善的错误处理
- ✅ 需要API超时控制
- ✅ 想要更现代的架构
- ✅ 重视文档完善度
- ✅ 愿意尝试新项目

### 选择 node-napcat-ts，如果你：
- ✅ 需要经过广泛测试的SDK
- ✅ 重视社区规模
- ✅ 需要更多问题解决参考

### 选择 @onebots，如果你：
- ✅ 需要支持多种OneBot实现
- ✅ 需要官方协议实现
- ✅ 追求协议标准化

## 迁移指南

### 从 node-napcat-ts 迁移

主要区别：

1. **导入**
```typescript
// 之前
import { NCWebsocket } from 'node-napcat-ts';

// 现在
import { NapLink } from 'naplink';
```

2. **初始化**
```typescript
// 之前
const client = new NCWebsocket({
  baseUrl: 'ws://localhost:3001',
  accessToken: 'token',
});

// 现在
const client = new NapLink({
  connection: {
    url: 'ws://localhost:3001',
    token: 'token',
  },
});
```

3. **API调用**
```typescript
// 之前
await client.send('send_group_msg', {
  group_id: '123',
  message: 'Hi',
});

// 现在
await client.sendGroupMessage('123', 'Hi');
```

## 性能对比

| 指标 | NapLink | node-napcat-ts |
|------|---------|---------------|
| 包大小 | ~100KB | ~100KB |
| 依赖数量 | 1个 | 2个 |
| 内存占用 | 低 | 低 |
| 启动速度 | 快 | 快 |

## 总结

NapLink = node-napcat-ts + 改进

核心改进点：
- ✅ API超时控制
- ✅ 指数退避重连
- ✅ 结构化错误
- ✅ 自动重试
- ✅ 分级日志

如果你需要这些特性，选择NapLink。如果你需要经过充分验证的SDK，选择node-napcat-ts。
