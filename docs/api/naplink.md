# NapLink 类

NapLink 主客户端类的完整API参考。

## 构造函数

### new NapLink(config)

创建新的NapLink客户端实例。

**参数**：
- `config` - [`PartialNapLinkConfig`](/api/config) 配置对象

**示例**：
```typescript
import { NapLink } from 'naplink';

const client = new NapLink({
  connection: {
    url: 'ws://localhost:3001',
    token: 'your_token',
  },
});
```

## 连接管理

### connect()

连接到NapCat服务器。

**返回**: `Promise<void>`

**抛出**: [`ConnectionError`](/api/errors#connectionerror)

```typescript
await client.connect();
```

### disconnect()

断开连接。

**返回**: `void`

```typescript
client.disconnect();
```

### getState()

获取当前连接状态。

**返回**: `ConnectionState`

```typescript
const state = client.getState();
// 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
```

### isConnected()

检查是否已连接。

**返回**: `boolean`

```typescript
if (client.isConnected()) {
  console.log('已连接');
}
```

## 账号API

### getLoginInfo()

获取登录号信息。

**返回**: `Promise<LoginInfo>`

```typescript
const info = await client.getLoginInfo();
console.log(info.user_id);
console.log(info.nickname);
```

### getStatus()

获取运行状态。

**返回**: `Promise<Status>`

```typescript
const status = await client.getStatus();
console.log(status.online);
```

## 消息发送API

### sendMessage(params)

发送消息（通用方法）。

**参数**：
```typescript
{
  message_type?: 'private' | 'group';
  user_id?: number | string;
  group_id?: number | string;
  message: any;
  auto_escape?: boolean;
}
```

**返回**: `Promise<MessageResult>`

```typescript
await client.sendMessage({
  message_type: 'group',
  group_id: '123456',
  message: '你好',
});
```

### sendPrivateMessage(userId, message)

发送私聊消息。

**参数**：
- `userId` - `number | string` 用户QQ号
- `message` - `any` 消息内容

**返回**: `Promise<MessageResult>`

```typescript
await client.sendPrivateMessage('12345', '你好');

// 发送复杂消息
await client.sendPrivateMessage('12345', [
  { type: 'text', data: { text: '你好' } },
  { type: 'face', data: { id: '123' } },
]);
```

### sendGroupMessage(groupId, message)

发送群消息。

**参数**：
- `groupId` - `number | string` 群号
- `message` - `any` 消息内容

**返回**: `Promise<MessageResult>`

```typescript
await client.sendGroupMessage('123456', '你好');
```

### sendGroupForwardMessage(groupId, messages)

发送合并转发消息。

**参数**：
- `groupId` - `number | string` 群号
- `messages` - `any[]` 消息列表

**返回**: `Promise<MessageResult>`

```typescript
await client.sendGroupForwardMessage('123456', [
  {
    type: 'node',
    data: {
      name: '发送者',
      uin: '10001',
      content: '消息内容',
    },
  },
]);
```

## 消息管理API

### getMessage(messageId)

获取消息详情。

**参数**：
- `messageId` - `number | string` 消息ID

**返回**: `Promise<Message>`

```typescript
const msg = await client.getMessage('123456');
```

### deleteMessage(messageId)

撤回消息。

**参数**：
- `messageId` - `number | string` 消息ID

**返回**: `Promise<any>`

```typescript
await client.deleteMessage('123456');
```

### getForwardMessage(id)

获取合并转发消息内容。

**参数**：
- `id` - `string` 转发消息ID

**返回**: `Promise<any>`

```typescript
const messages = await client.getForwardMessage('forward_id');
```

## 群组管理API

### getGroupList()

获取群列表。

**返回**: `Promise<Group[]>`

```typescript
const groups = await client.getGroupList();
for (const group of groups) {
  console.log(group.group_name);
}
```

### getGroupInfo(groupId, noCache?)

获取群信息。

**参数**：
- `groupId` - `number | string` 群号
- `noCache` - `boolean` 是否不使用缓存（默认false）

**返回**: `Promise<GroupInfo>`

```typescript
const info = await client.getGroupInfo('123456');
const freshInfo = await client.getGroupInfo('123456', true);
```

### getGroupMemberList(groupId)

获取群成员列表。

**参数**：
- `groupId` - `number | string` 群号

**返回**: `Promise<GroupMember[]>`

```typescript
const members = await client.getGroupMemberList('123456');
```

### getGroupMemberInfo(groupId, userId, noCache?)

获取群成员信息。

**参数**：
- `groupId` - `number | string` 群号
- `userId` - `number | string` 用户QQ号
- `noCache` - `boolean` 是否不使用缓存（默认false）

**返回**: `Promise<GroupMember>`

```typescript
const member = await client.getGroupMemberInfo('123456', '12345');
console.log(member.nickname);
console.log(member.role); // owner/admin/member
```

## 好友管理API

### getFriendList()

获取好友列表。

**返回**: `Promise<Friend[]>`

```typescript
const friends = await client.getFriendList();
```

## 文件操作API

### getImage(file)

获取图片信息。

**参数**：
- `file` - `string` 文件ID

**返回**: `Promise<ImageInfo>`

```typescript
const image = await client.getImage('file_id');
console.log(image.url);
```

### getRecord(file, outFormat?)

获取语音文件。

**参数**：
- `file` - `string` 文件ID
- `outFormat` - `string` 输出格式（可选）

**返回**: `Promise<RecordInfo>`

```typescript
const record = await client.getRecord('file_id');
const mp3 = await client.getRecord('file_id', 'mp3');
```

### getFile(file)

获取文件信息。

**参数**：
- `file` - `string` 文件ID

**返回**: `Promise<FileInfo>`

```typescript
const file = await client.getFile('file_id');
```

## 自定义API

### callApi<T>(method, params?)

调用任意API。

**泛型参数**：
- `T` - 返回值类型（可选）

**参数**：
- `method` - `string` API方法名
- `params` - `any` 参数（可选）

**返回**: `Promise<T>`

```typescript
const result = await client.callApi('custom_action', {
  param1: 'value1',
});
```

## 事件方法

NapLink继承自EventEmitter，支持以下方法：

### on(event, handler)

监听事件。

```typescript
client.on('message.group', (data) => {
  console.log(data);
});
```

### once(event, handler)

监听一次事件。

```typescript
client.once('connect', () => {
  console.log('首次连接');
});
```

### off(event, handler)

移除事件监听器。

```typescript
const handler = (data) => console.log(data);
client.on('message', handler);
client.off('message', handler);
```

## 事件列表

查看 [事件处理](/guide/events) 了解所有可用事件。

## 类型定义

所有类型定义都从SDK导出：

```typescript
import type {
  NapLinkConfig,
  ConnectionState,
  LoginInfo,
  MessageResult,
  // ...更多类型
} from 'naplink';
```
