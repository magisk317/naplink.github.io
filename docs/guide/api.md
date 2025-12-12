# API 调用

NapLink 提供了完整的 OneBot 11 API 支持。所有 API 方法都是异步的，返回 Promise。

## 基本用法

```typescript
// 调用 API
const result = await client.sendGroupMessage('123456', '你好');
console.log('消息ID:', result.message_id);
```

## 账号相关

### getLoginInfo()

获取登录号信息。

```typescript
const info = await client.getLoginInfo();
console.log(info);
// { user_id: 12345, nickname: 'Bot' }
```

### getStatus()

获取运行状态。

```typescript
const status = await client.getStatus();
console.log(status);
// { online: true, good: true }
```

## 消息发送

### sendMessage()

发送消息（通用）。

```typescript
await client.sendMessage({
  message_type: 'group',  // 或 'private'
  group_id: '123456',
  message: '你好',
});
```

### sendPrivateMessage()

发送私聊消息。

```typescript
await client.sendPrivateMessage('user_id', '私聊消息');

// 发送复杂消息
await client.sendPrivateMessage('user_id', [
  { type: 'text', data: { text: '你好！' } },
  { type: 'face', data: { id: '123' } },
]);
```

### sendGroupMessage()

发送群消息。

```typescript
await client.sendGroupMessage('group_id', '群消息');

// 发送 @ 消息
await client.sendGroupMessage('group_id', [
  { type: 'at', data: { qq: 'user_id' } },
  { type: 'text', data: { text: ' 你好' } },
]);
```

### sendGroupForwardMessage()

发送合并转发消息。

```typescript
await client.sendGroupForwardMessage('group_id', [
  {
    type: 'node',
    data: {
      name: '发送者1',
      uin: '10001',
      content: '消息内容1',
    },
  },
  {
    type: 'node',
    data: {
      name: '发送者2',
      uin: '10002',
      content: '消息内容2',
    },
  },
]);
```

## 消息管理

### getMessage()

获取消息详情。

```typescript
const msg = await client.getMessage('message_id');
console.log(msg);
```

### deleteMessage()

撤回消息。

```typescript
await client.deleteMessage('message_id');
```

### getForwardMessage()

获取合并转发消息内容。

```typescript
const messages = await client.getForwardMessage('forward_id');
console.log(messages);
```

## 群组管理

### getGroupList()

获取群列表。

```typescript
const groups = await client.getGroupList();
for (const group of groups) {
  console.log(`${group.group_name} (${group.group_id})`);
}
```

### getGroupInfo()

获取群信息。

```typescript
const info = await client.getGroupInfo('group_id');
console.log(info);

// 不使用缓存
const freshInfo = await client.getGroupInfo('group_id', true);
```

### getGroupMemberList()

获取群成员列表。

```typescript
const members = await client.getGroupMemberList('group_id');
console.log(`群成员数: ${members.length}`);
```

### getGroupMemberInfo()

获取群成员信息。

```typescript
const member = await client.getGroupMemberInfo('group_id', 'user_id');
console.log(`昵称: ${member.nickname}`);
console.log(`权限: ${member.role}`);  // owner/admin/member
```

## 好友管理

### getFriendList()

获取好友列表。

```typescript
const friends = await client.getFriendList();
for (const friend of friends) {
  console.log(`${friend.nickname} (${friend.user_id})`);
}
```

## 文件操作

### getImage()

获取图片信息。

```typescript
const image = await client.getImage('file_id');
console.log(image.file);  // 图片文件路径
console.log(image.url);   // 图片URL
```

### getRecord()

获取语音文件。

```typescript
const record = await client.getRecord('file_id');

// 指定输出格式
const mp3 = await client.getRecord('file_id', 'mp3');
```

### getFile()

获取文件信息。

```typescript
const file = await client.getFile('file_id');
console.log(file.file);  // 文件路径
console.log(file.url);   // 文件URL
```

## 自定义 API

### callApi()

调用任意 API。

```typescript
const result = await client.callApi('custom_action', {
  param1: 'value1',
  param2: 'value2',
});
```

## 错误处理

所有 API 方法都可能抛出错误：

```typescript
import { ApiError, ApiTimeoutError } from 'naplink';

try {
  await client.sendGroupMessage('group_id', 'Hello');
} catch (error) {
  if (error instanceof ApiTimeoutError) {
    console.error('API 调用超时');
  } else if (error instanceof ApiError) {
    console.error(`API 错误 (${error.details.retcode})`);
  }
}
```

## 超时和重试

你可以为单次 API 调用设置不同的超时和重试：

```typescript
// 默认使用全局配置
await client.sendGroupMessage('group_id', 'Hello');

// 自定义超时（需要扩展实现）
// 当前版本使用全局配置
```

## 批量操作

处理多个群：

```typescript
const groups = await client.getGroupList();

// 并行发送
await Promise.all(
  groups.map(group =>
    client.sendGroupMessage(group.group_id, '公告')
  )
);

// 串行发送（避免频繁）
for (const group of groups) {
  await client.sendGroupMessage(group.group_id, '公告');
  await new Promise(resolve => setTimeout(resolve, 1000)); // 延迟1秒
}
```

## 下一步

- [事件处理](/guide/events) - 监听和处理事件
- [错误处理](/guide/errors) - 正确处理错误
- [OneBot API 参考](/api/onebot) - 完整 API 文档
