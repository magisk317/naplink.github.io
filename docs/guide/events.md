# 事件处理

NapLink 使用事件驱动模型，完整支持 OneBot 11 的所有事件。

## 基本用法

```typescript
// 监听事件
client.on('message', (data) => {
  console.log('收到消息:', data);
});

// 监听一次
client.once('connect', () => {
  console.log('首次连接成功');
});

// 移除监听
const handler = (data) => console.log(data);
client.on('message', handler);
client.off('message', handler);  // 移除
```

## 事件层级

NapLink 使用层级化事件命名，你可以监听不同级别：

```
message                      // 所有消息
├── message.group           // 所有群消息
│   └── message.group.normal    // 普通群消息
└── message.private         // 所有私聊
    ├── message.private.friend  // 好友私聊
    └── message.private.group   // 群临时会话
```

```typescript
// 监听所有消息
client.on('message', (data) => {
  console.log('收到消息');
});

// 只监听群消息
client.on('message.group', (data) => {
  console.log('收到群消息');
});

// 只监听普通群消息
client.on('message.group.normal', (data) => {
  console.log('收到普通群消息');
});
```

## 连接事件

### connect

连接成功时触发。

```typescript
client.on('connect', () => {
  console.log('已连接到 NapCat');
});
```

### disconnect

连接断开时触发。

```typescript
client.on('disconnect', () => {
  console.log('连接已断开');
});
```

### reconnecting

正在重连时触发。

```typescript
client.on('reconnecting', () => {
  console.log('正在重连...');
});
```

## 消息事件

### message.group

群消息事件。

```typescript
client.on('message.group', (data) => {
  console.log(`[群${data.group_id}] ${data.sender.nickname}: ${data.raw_message}`);
  
  // 消息内容
  console.log('消息ID:', data.message_id);
  console.log('发送者:', data.sender);
  console.log('消息:', data.message);
});
```

**事件数据**：
- `message_id` - 消息ID
- `group_id` - 群号
- `user_id` - 发送者QQ号
- `message` - 消息内容（数组格式）
- `raw_message` - 消息文本
- `sender` - 发送者信息
  - `user_id` - QQ号
  - `nickname` - 昵称
  - `card` - 群名片
  - `role` - 角色（owner/admin/member）

### message.private

私聊消息事件。

```typescript
client.on('message.private', (data) => {
  console.log(`[私聊] ${data.sender.nickname}: ${data.raw_message}`);
});
```

### message_sent

自己发送的消息。

```typescript
client.on('message_sent.group', (data) => {
  console.log('我发送了群消息:', data.raw_message);
});
```

## 通知事件

### notice.group_increase

群成员增加。

```typescript
client.on('notice.group_increase', (data) => {
  console.log(`${data.user_id} 加入了群 ${data.group_id}`);
  
  // 欢迎新成员
  client.sendGroupMessage(data.group_id, `欢迎 @${data.user_id}`);
});
```

### notice.group_decrease

群成员减少。

```typescript
client.on('notice.group_decrease', (data) => {
  if (data.sub_type === 'leave') {
    console.log(`${data.user_id} 退出了群`);
  } else if (data.sub_type === 'kick') {
    console.log(`${data.user_id} 被踢出群`);
  }
});
```

### notice.group_recall

群消息撤回。

```typescript
client.on('notice.group_recall', (data) => {
  console.log(`消息 ${data.message_id} 被撤回`);
  console.log('操作者:', data.operator_id);
});
```

### notice.friend_add

好友添加。

```typescript
client.on('notice.friend_add', (data) => {
  console.log(`添加了好友: ${data.user_id}`);
});
```

### notice.notify.poke

戳一戳。

```typescript
client.on('notice.notify.poke', (data) => {
  if ('group_id' in data) {
    // 群聊戳一戳
    console.log(`在群 ${data.group_id} 被 ${data.user_id} 戳了`);
  } else {
    // 私聊戳一戳
    console.log(`被 ${data.user_id} 戳了`);
  }
});
```

## 请求事件

### request.friend

好友请求。

```typescript
client.on('request.friend', async (data) => {
  console.log(`${data.user_id} 请求添加好友`);
  console.log('验证消息:', data.comment);
  
  // 自动通过（需要实现相应 API）
  // await client.setFriendAddRequest(data.flag, true);
});
```

### request.group

加群请求/邀请。

```typescript
client.on('request.group', async (data) => {
  if (data.sub_type === 'add') {
    console.log(`${data.user_id} 请求加入群 ${data.group_id}`);
  } else if (data.sub_type === 'invite') {
    console.log(`${data.user_id} 邀请加入群 ${data.group_id}`);
  }
});
```

## 元事件

### meta_event.heartbeat

心跳事件。

```typescript
client.on('meta_event.heartbeat', (data) => {
  console.log('心跳:', data.status);
});
```

### meta_event.lifecycle

生命周期事件。

```typescript
client.on('meta_event.lifecycle.connect', () => {
  console.log('OneBot 连接建立');
});
```

## 原始事件

### raw

接收所有原始事件。

```typescript
client.on('raw', (data) => {
  console.log('原始事件:', data);
});
```

## 实用模式

### 命令处理器

```typescript
const commands = {
  '/help': async (groupId: string) => {
    await client.sendGroupMessage(groupId, '帮助信息...');
  },
  '/ping': async (groupId: string) => {
    await client.sendGroupMessage(groupId, 'Pong!');
  },
};

client.on('message.group', async (data) => {
  const cmd = data.raw_message.trim();
  const handler = commands[cmd];
  if (handler) {
    await handler(data.group_id);
  }
});
```

### 关键词回复

```typescript
const keywords = {
  '你好': '你好呀！',
  '再见': '再见👋',
};

client.on('message.group', async (data) => {
  const reply = keywords[data.raw_message];
  if (reply) {
    await client.sendGroupMessage(data.group_id, reply);
  }
});
```

### 权限控制

```typescript
const admins = ['12345', '67890'];

client.on('message.group', async (data) => {
  if (data.raw_message.startsWith('/admin')) {
    if (!admins.includes(data.user_id.toString())) {
      await client.sendGroupMessage(data.group_id, '权限不足');
      return;
    }
    
    // 执行管理员命令
  }
});
```

### 消息过滤

```typescript
// 忽略自己的消息
client.on('message', async (data) => {
  const loginInfo = await client.getLoginInfo();
  if (data.user_id === loginInfo.user_id) {
    return;  // 忽略
  }
  
  // 处理其他人的消息
});
```

## 错误处理

事件处理器中的错误不会导致程序崩溃，但建议添加错误处理：

```typescript
client.on('message.group', async (data) => {
  try {
    // 处理消息
    await client.sendGroupMessage(data.group_id, 'Response');
  } catch (error) {
    console.error('处理消息失败:', error);
  }
});
```

## 下一步

- [错误处理](/guide/errors) - 了解错误处理
- [最佳实践](/guide/best-practices) - 编写更好的代码
- [API 参考](/api/naplink) - 查看所有API
