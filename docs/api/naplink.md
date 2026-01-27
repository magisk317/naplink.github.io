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

**返回**: `Promise&lt;void&gt;`

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

**返回**: `Promise&lt;LoginInfo&gt;`

```typescript
const info = await client.getLoginInfo();
console.log(info.user_id);
console.log(info.nickname);
```

### getStatus()

获取运行状态。

**返回**: `Promise&lt;Status&gt;`

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

**返回**: `Promise&lt;MessageResult&gt;`

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

**返回**: `Promise&lt;MessageResult&gt;`

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

**返回**: `Promise&lt;MessageResult&gt;`

```typescript
await client.sendGroupMessage('123456', '你好');
```

### sendGroupForwardMessage(groupId, messages)

发送合并转发消息。

**参数**：
- `groupId` - `number | string` 群号
- `messages` - `any[]` 消息列表

**返回**: `Promise&lt;MessageResult&gt;`

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

**返回**: `Promise&lt;Message&gt;`

```typescript
const msg = await client.getMessage('123456');
```

### deleteMessage(messageId)

撤回消息。

**参数**：
- `messageId` - `number | string` 消息ID

**返回**: `Promise&lt;any&gt;`

```typescript
await client.deleteMessage('123456');
```

### setEssenceMessage(messageId) / deleteEssenceMessage(messageId)

设置/移除精华消息。

```typescript
await client.setEssenceMessage('123456');
await client.deleteEssenceMessage('123456');
```

### getForwardMessage(id)

获取合并转发消息内容。

**参数**：
- `id` - `string` 转发消息ID

**返回**: `Promise&lt;any&gt;`

```typescript
const messages = await client.getForwardMessage('forward_id');
```

### getEssenceMessageList(groupId)

获取群精华消息列表。

```typescript
const list = await client.getEssenceMessageList('123456');
```

### markMessageAsRead(messageId)

标记消息已读。

```typescript
await client.markMessageAsRead('123');
```

### markGroupMsgAsRead(groupId)

标记群消息已读（NapCat 扩展）。

```typescript
await client.markGroupMsgAsRead('123456');
```

### markPrivateMsgAsRead(userId)

标记私聊消息已读（NapCat 扩展）。

```typescript
await client.markPrivateMsgAsRead('654321');
```

### markAllMsgAsRead()

标记全部消息已读（NapCat 扩展）。

```typescript
await client.markAllMsgAsRead();
```

### getGroupMsgHistory(params) / getFriendMsgHistory(params)

获取群/好友消息历史（NapCat 扩展）。

```typescript
const groupHistory = await client.getGroupMsgHistory({
  group_id: '123456',
  message_seq: 0,
  count: 20,
  reverse_order: true,
});

const friendHistory = await client.getFriendMsgHistory({
  user_id: '654321',
  message_seq: 0,
  count: 20,
  reverse_order: true,
});
```

### sendGroupPoke(groupId, userId) / sendFriendPoke(userId) / sendPoke(...)

戳一戳（NapCat 扩展）。

```typescript
await client.sendGroupPoke('123456', '654321');
await client.sendFriendPoke('654321');
await client.sendPoke('654321');              // 私聊
await client.sendPoke('654321', '123456');    // 群内
```

## 群组管理API

### getGroupList()

获取群列表。

**返回**: `Promise&lt;Group[]&gt;`

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

**返回**: `Promise&lt;GroupInfo&gt;`

```typescript
const info = await client.getGroupInfo('123456');
const freshInfo = await client.getGroupInfo('123456', true);
```

### getGroupMemberList(groupId)

获取群成员列表。

**参数**：
- `groupId` - `number | string` 群号

**返回**: `Promise&lt;GroupMember[]&gt;`

```typescript
const members = await client.getGroupMemberList('123456');
```

### getGroupMemberInfo(groupId, userId, noCache?)

获取群成员信息。

**参数**：
- `groupId` - `number | string` 群号
- `userId` - `number | string` 用户QQ号
- `noCache` - `boolean` 是否不使用缓存（默认false）

**返回**: `Promise&lt;GroupMember&gt;`

```typescript
const member = await client.getGroupMemberInfo('123456', '12345');
console.log(member.nickname);
console.log(member.role); // owner/admin/member
```

### setGroupBan(groupId, userId, duration?)

禁言成员，默认 30 分钟。

```typescript
await client.setGroupBan('123456', '654321', 10 * 60);
```

### unsetGroupBan(groupId, userId)

取消禁言。

```typescript
await client.unsetGroupBan('123456', '654321');
```

### setGroupWholeBan(groupId, enable?)

全员禁言开关。

```typescript
await client.setGroupWholeBan('123456', false);
```

### setGroupAdmin(groupId, userId, enable?)

设置/取消管理员。

```typescript
await client.setGroupAdmin('123456', '654321', true);
```

### setGroupCard(groupId, userId, card)

修改群名片。

```typescript
await client.setGroupCard('123456', '654321', 'NapLink Bot');
```

### setGroupName(groupId, name)

修改群名称。

```typescript
await client.setGroupName('123456', '新群名');
```

### setGroupPortrait(groupId, file)

设置群头像（支持路径/Buffer/流）。

```typescript
await client.setGroupPortrait('123456', '/tmp/avatar.jpg');
```

### setGroupSpecialTitle(groupId, userId, title, duration?)

设置群头衔（默认 -1 永久）。

```typescript
await client.setGroupSpecialTitle('123456', '654321', '活跃成员', 3600);
```

### setGroupKick(groupId, userId, rejectAddRequest?)

踢出群成员。

```typescript
await client.setGroupKick('123456', '654321', true);
```

### setGroupLeave(groupId, isDismiss?)

退出群聊。

```typescript
await client.setGroupLeave('123456', false);
```

### setGroupAnonymousBan(groupId, anonymousFlag, duration?)

匿名禁言，默认 30 分钟。

```typescript
await client.setGroupAnonymousBan('123456', 'flag', 30 * 60);
```

### getGroupAtAllRemain(groupId)

查询群 @全体 剩余次数。

```typescript
const remain = await client.getGroupAtAllRemain('123456');
```

### getGroupSystemMsg()

获取群系统消息（如入群申请列表）。

```typescript
const sys = await client.getGroupSystemMsg();
```

### getGroupHonorInfo(groupId, type)

获取群荣誉信息。

```typescript
const honor = await client.getGroupHonorInfo('123456', 'talkative'); // all | talkative | performer | legend | strong_newbie | emotion
```

## 好友管理API

### getFriendList()

获取好友列表。

**返回**: `Promise&lt;Friend[]&gt;`

```typescript
const friends = await client.getFriendList();
```

### sendLike(userId, times?)

点赞（默认 1 次）。

```typescript
await client.sendLike('123456', 5);
```

### getStrangerInfo(userId, noCache?)

获取陌生人资料。

```typescript
const stranger = await client.getStrangerInfo('123456', true);
```

## 文件操作API

### getImage(file)

获取图片信息。

**参数**：
- `file` - `string` 文件ID

**返回**: `Promise&lt;ImageInfo&gt;`

```typescript
const image = await client.getImage('file_id');
console.log(image.url);
```

### getRecord(file, outFormat?)

获取语音文件。

**参数**：
- `file` - `string` 文件ID
- `outFormat` - `string` 输出格式（可选）

**返回**: `Promise&lt;RecordInfo&gt;`

```typescript
const record = await client.getRecord('file_id');
const mp3 = await client.getRecord('file_id', 'mp3');
```

### getFile(file)

获取文件信息。

**参数**：
- `file` - `string` 文件ID

**返回**: `Promise&lt;FileInfo&gt;`

```typescript
const file = await client.getFile('file_id');
```

### hydrateMessage(message)

补充消息段中的媒体直链（自动通过 `get_file/get_image/get_record` 获取真实下载链接）。

> `v0.0.2` 起会自动兼容 `file_id -> file` 的场景。

```typescript
await client.hydrateMessage(messageSegments);
```

### uploadGroupFile(groupId, file, name, folder?, uploadFile?)

上传文件到群，支持本地路径、`Buffer`/`Uint8Array` 或可读流。

**参数**：
- `groupId` - `number | string` 群号
- `file` - `string | Buffer | Stream` 文件
- `name` - `string` 文件名
- `folder` - `string` 文件夹ID（可选）
- `uploadFile` - `boolean` 是否上传文件（可选，默认 true）

```typescript
await client.uploadGroupFile('123456', '/tmp/demo.txt', 'demo.txt');
await client.uploadGroupFile('123456', '/tmp/demo.txt', 'demo.txt', undefined, false); // 仅发送不上传
```

### uploadPrivateFile(userId, file, name, uploadFile?)

上传文件到私聊，支持本地路径、`Buffer`/`Uint8Array` 或可读流。

**参数**：
- `userId` - `number | string` 用户QQ号
- `file` - `string | Buffer | Stream` 文件
- `name` - `string` 文件名
- `uploadFile` - `boolean` 是否上传文件（可选，默认 true）

```typescript
await client.uploadPrivateFile('654321', '/tmp/demo.txt', 'demo.txt');
```

### uploadFileStream(file, options?)

NapCat Stream API 分片上传（支持断点续传）。

**参数（options 部分可选）**：
- `streamId`：自定义流 ID，用于续传
- `chunkSize`：分片大小，默认 256KB
- `expectedSha256`：期望的 SHA256 校验
- `fileRetention`：分片保留时间（毫秒）
- `filename`：文件名
- `reset`：是否先重置已有流
- `verifyOnly`：仅校验分片不写入

```typescript
await client.uploadFileStream('/tmp/large.bin', {
  streamId: 'custom-id',
  chunkSize: 512 * 1024,
  reset: true,
});
```

### getUploadStreamStatus(streamId)

查询流状态（便于续传缺失分片）。

```typescript
const status = await client.getUploadStreamStatus('custom-id');
console.log(status.data?.missing_chunks);

// 补发缺失分片示例（简化版，可根据需要替换为流式读取）
const missing = status?.data?.missing_chunks as number[] | undefined;
if (missing?.length) {
  const filePath = '/tmp/large.bin';
  const buf = await fs.promises.readFile(filePath);
  const chunkSize = 256 * 1024;
  for (const idx of missing) {
    const start = idx * chunkSize;
    const end = Math.min(start + chunkSize, buf.length);
    const chunk = buf.slice(start, end);
    await client.callApi('upload_file_stream', {
      stream_id: 'custom-id',
      chunk_data: chunk.toString('base64'),
      chunk_index: idx,
      total_chunks: Math.ceil(buf.length / chunkSize),
      file_size: buf.length,
      filename: 'large.bin',
    });
  }
  await client.callApi('upload_file_stream', { stream_id: 'custom-id', is_complete: true });
}
```

## 流式下载（stream-action）

NapCat Stream API 流式下载（分片通过 WebSocket 返回）。

### downloadFileStream(fileId, options?)

流式下载文件（原始分片包，返回 AsyncIterable）。

```typescript
const { packets, result } = client.downloadFileStream('file_id');
for await (const pkt of packets) {
  // pkt.data_type: file_info / file_chunk / file_complete
}
await result;
```

### downloadFileStreamToFile(fileId, options?)

流式下载并写入本地临时文件（推荐）。

```typescript
const { path, info } = await client.downloadFileStreamToFile('file_id', { filename: 'demo.bin' });
console.log(path, info?.file_name, info?.file_size);
```

### downloadFileImageStream* / downloadFileRecordStream*

图片/语音流式下载（语音可指定输出格式）。

```typescript
await client.downloadFileImageStreamToFile('file_id', { filename: 'img.jpg' });
await client.downloadFileRecordStreamToFile('file_id', 'mp3', { filename: 'audio.mp3' });
```

### cleanStreamTempFile()

清理 NapCat 侧 stream 临时文件（按需）。

```typescript
await client.cleanStreamTempFile();
```

## 系统/能力探测（NapCat 扩展）

```typescript
await client.getOnlineClients(true);
await client.canSendImage();
await client.canSendRecord();

await client.getCookies('qun.qq.com');
await client.getCsrfToken();
await client.getCredentials('qun.qq.com');

await client.setInputStatus('user_id', 1);
await client.ocrImage('file:///tmp/a.png');
await client.translateEn2zh(['hello', 'world']);
await client.checkUrlSafely('https://example.com');
```

## NapCat 扩展能力（部分示例）

```typescript
await client.getRkey();
await client.getRkeyServer();
await client.getRkeyEx();

await client.setFriendRemark('user_id', 'remark');
await client.deleteFriend('user_id');
await client.getUnidirectionalFriendList();

await client.setGroupRemark('group_id', 'remark');
await client.getGroupInfoEx('group_id');
await client.getGroupDetailInfo('group_id');
await client.getGroupIgnoredNotifies();
await client.getGroupShutList('group_id');

await client.fetchCustomFace({ count: 20 });
```

### getEmojiLikes(params)

获取表情回应列表（NapCat 扩展）。

**参数**：
```typescript
{
  message_id: string;
  emoji_id: string;
  count?: number; // 默认 20
}
```

**返回**: `Promise&lt;EmojiLikeResult&gt;`

```typescript
const likes = await client.getEmojiLikes({
  message_id: 'msg_id',
  emoji_id: '123',
});
```

### fetchEmojiLike(params)

获取表情回应详情（支持翻页）（NapCat 扩展）。

**参数**：
```typescript
{
  message_id: string;
  emojiId: string;
  emojiType: string;
  count?: number;
  cookie?: string; // 分页 Cookie
}
```

```typescript
await client.fetchEmojiLike({
  message_id: 'msg_id',
  emojiId: '123',
  emojiType: '1',
  cookie: 'prev_cookie',
});
```

## 全量 action 直通：api.raw

当你需要调用“服务端有实现但 SDK 还没写 wrapper”的 action 时，可以使用 `raw`：

```typescript
await client.api.raw['get_group_shut_list']({ group_id: 123 });
await client.api.raw['.ocr_image']({ image: 'file:///tmp/a.png' });
```

## 自定义API

### callApi&lt;T&gt;(method, params?)

调用任意API。

**泛型参数**：
- `T` - 返回值类型（可选）

**参数**：
- `method` - `string` API方法名
- `params` - `any` 参数（可选）

**返回**: `Promise&lt;T&gt;`

```typescript
const result = await client.callApi('custom_action', {
  param1: 'value1',
});
```

## 版本/资料

### getVersionInfo()

获取协议端版本信息。

```typescript
const version = await client.getVersionInfo();
console.log(version);
```

## API 统一入口

除了直接方法，你也可以使用 `client.api.*` 调用，便于未来扩展：

```typescript
await client.api.setGroupBan('123', '456', 600);
await client.api.uploadGroupFile('123', '/tmp/demo.txt', 'demo.txt');
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
