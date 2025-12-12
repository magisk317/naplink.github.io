# API 文档

完整的NapLink API参考文档。

## 概览

NapLink提供以下主要模块：

- **NapLink类** - 主客户端类
- **配置** - 配置选项和类型
- **错误** - 错误类型
- **OneBot API** - OneBot 11标准API

## 快速导航

- [NapLink 类](/api/naplink) - 主要API方法
- [配置选项](/api/config) - 配置类型定义
- [错误类型](/api/errors) - 错误处理
- [OneBot API](/api/onebot) - OneBot 11 API参考

## 类型安全

NapLink完全使用TypeScript编写，提供完整的类型定义：

```typescript
import { NapLink, type NapLinkConfig } from 'naplink';

const config: NapLinkConfig = {
  connection: {
    url: 'ws://localhost:3001',
  },
};

const client = new NapLink(config);
```

## 主要类

### NapLink

主客户端类，继承自EventEmitter。

```typescript
class NapLink extends EventEmitter {
  constructor(config: PartialNapLinkConfig);
  
  // 连接管理
  connect(): Promise<void>;
  disconnect(): void;
  getState(): ConnectionState;
  isConnected(): boolean;
  
  // OneBot API
  getLoginInfo(): Promise<LoginInfo>;
  sendGroupMessage(groupId: string, message: any): Promise<MessageResult>;
  // ...更多API
}
```

查看 [NapLink 类](/api/naplink) 了解所有方法。

## 事件

NapLink支持所有OneBot 11事件：

```typescript
client.on('message.group', (data) => {
  // 处理群消息
});

client.on('connect', () => {
  // 连接成功
});

client.on('disconnect', () => {
  // 连接断开
});
```

查看 [事件处理指南](/guide/events) 了解所有事件。

## 错误处理

所有错误都继承自 `NapLinkError`：

```typescript
try {
  await client.connect();
} catch (error) {
  if (error instanceof ConnectionError) {
    // 处理连接错误
  }
}
```

查看 [错误类型](/api/errors) 了解所有错误。
