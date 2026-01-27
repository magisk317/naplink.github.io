# OneBot API

OneBot 11 标准API的完整参考。

NapLink实现了OneBot 11的所有核心API。

## API分类

- [账号信息](#账号信息)
- [消息发送](#消息发送)
- [消息管理](#消息管理)
- [群组管理](#群组管理)
- [好友管理](#好友管理)
- [文件操作](#文件操作)
- [系统/能力探测（NapCat 扩展）](#系统能力探测napcat-扩展)
- [NapCat 扩展 API](#napcat-扩展-api)
- [全量 action 直通（raw）](#全量-action-直通raw)
- [点赞/资料](#点赞资料)
- [请求处理](#请求处理)

## 账号信息

### get_login_info

获取登录号信息。

**方法**: `client.getLoginInfo()`

**返回**:
```typescript
{
  user_id: number;
  nickname: string;
}
```

### get_status

获取运行状态。

**方法**: `client.getStatus()`

**返回**:
```typescript
{
  online: boolean;
  good: boolean;
}
```

## 消息发送

### send_msg

发送消息。

**方法**: `client.sendMessage(params)`

**参数**:
```typescript
{
  message_type?: 'private' | 'group';
  user_id?: number | string;
  group_id?: number | string;
  message: MessageSegment | MessageSegment[] | string;
  auto_escape?: boolean;
}
```

**返回**:
```typescript
{
  message_id: number;
}
```

### send_private_msg

发送私聊消息。

**方法**: `client.sendPrivateMessage(userId, message)`

**参数**:
- `user_id` - 用户QQ号
- `message` - 消息内容

### send_group_msg

发送群消息。

**方法**: `client.sendGroupMessage(groupId, message)`

**参数**:
- `group_id` - 群号
- `message` - 消息内容

### send_group_forward_msg

发送合并转发消息（群）。

**方法**: `client.sendGroupForwardMessage(groupId, messages)`

**参数**:
- `group_id` - 群号
- `messages` - 消息节点数组

## 消息管理

### get_msg

获取消息详情。

**方法**: `client.getMessage(messageId)`

**参数**:
- `message_id` - 消息ID

**返回**: 消息对象

### delete_msg

撤回消息。

**方法**: `client.deleteMessage(messageId)`

**参数**:
- `message_id` - 消息ID

### get_forward_msg

获取合并转发消息内容。

**方法**: `client.getForwardMessage(id)`

**参数**:
- `id` - 转发消息ID

### set_essence_msg / delete_essence_msg

设置/移除精华消息。

**方法**:
- `client.setEssenceMessage(messageId)`
- `client.deleteEssenceMessage(messageId)`

**参数**:
- `message_id` - 消息ID

### get_essence_msg_list

获取群精华消息列表。

**方法**: `client.getEssenceMessageList(groupId)`

**参数**:
- `group_id` - 群号

### mark_msg_as_read

标记消息已读。

**方法**: `client.markMessageAsRead(messageId)`

**参数**:
- `message_id` - 消息ID

### mark_group_msg_as_read / mark_private_msg_as_read / _mark_all_as_read

标记群/私聊/全量消息已读（NapCat 扩展）。

**方法**:
- `client.markGroupMsgAsRead(groupId)`
- `client.markPrivateMsgAsRead(userId)`
- `client.markAllMsgAsRead()`

### get_group_msg_history / get_friend_msg_history

获取群/好友消息历史（NapCat 扩展）。

**方法**:
- `client.getGroupMsgHistory(params)`
- `client.getFriendMsgHistory(params)`

**参数（示例）**:
```typescript
// 群消息历史
{
  group_id: number | string;
  message_seq: number | string;
  count: number;
  reverse_order?: boolean;
}

// 好友消息历史
{
  user_id: number | string;
  message_seq: number | string;
  count: number;
  reverse_order?: boolean;
}
```

### group_poke / friend_poke / send_poke

戳一戳（NapCat 扩展）。

**方法**:
- `client.sendGroupPoke(groupId, userId)`
- `client.sendFriendPoke(userId)`
- `client.sendPoke(targetId, groupId?)`

## 群组管理

### get_group_list

获取群列表。

**方法**: `client.getGroupList()`

**返回**:
```typescript
Array<{
  group_id: number;
  group_name: string;
  member_count: number;
  max_member_count: number;
}>
```

### get_group_info

获取群信息。

**方法**: `client.getGroupInfo(groupId, noCache?)`

**参数**:
- `group_id` - 群号
- `no_cache` - 是否不使用缓存

**返回**:
```typescript
{
  group_id: number;
  group_name: string;
  member_count: number;
  max_member_count: number;
}
```

### get_group_member_list

获取群成员列表。

**方法**: `client.getGroupMemberList(groupId)`

**参数**:
- `group_id` - 群号

**返回**: 群成员数组

### get_group_member_info

获取群成员信息。

**方法**: `client.getGroupMemberInfo(groupId, userId, noCache?)`

**参数**:
- `group_id` - 群号
- `user_id` - 用户QQ号
- `no_cache` - 是否不使用缓存

**返回**:
```typescript
{
  user_id: number;
  nickname: string;
  card: string;
  role: 'owner' | 'admin' | 'member';
  join_time: number;
  last_sent_time: number;
}
```

### set_group_ban / set_group_whole_ban

禁言成员或全员禁言。

**方法**:
- `client.setGroupBan(groupId, userId, duration?)` // 默认 30 分钟
- `client.unsetGroupBan(groupId, userId)` // 等价 duration=0
- `client.setGroupWholeBan(groupId, enable?)`

### set_group_admin / set_group_card / set_group_name / set_group_special_title

设置管理员、名片、群名、头衔。

**方法**:
- `client.setGroupAdmin(groupId, userId, enable?)`
- `client.setGroupCard(groupId, userId, card)`
- `client.setGroupName(groupId, name)`
- `client.setGroupSpecialTitle(groupId, userId, title, duration?)` // 默认 -1 永久

### set_group_portrait

设置群头像。

**方法**: `client.setGroupPortrait(groupId, file)`

### set_group_kick / set_group_leave / set_group_anonymous_ban

踢人、退群、匿名禁言。

**方法**:
- `client.setGroupKick(groupId, userId, rejectAddRequest?)`
- `client.setGroupLeave(groupId, isDismiss?)`
- `client.setGroupAnonymousBan(groupId, anonymousFlag, duration?)` // 默认 30 分钟

### get_group_at_all_remain

查询 @全体 剩余次数。

**方法**: `client.getGroupAtAllRemain(groupId)`

### get_group_system_msg

获取群系统消息（入群申请等）。

**方法**: `client.getGroupSystemMsg()`

### get_group_honor_info

获取群荣誉信息。

**方法**: `client.getGroupHonorInfo(groupId, type)`

**参数**:
- `type` - `all | talkative | performer | legend | strong_newbie | emotion`

## 好友管理

### get_friend_list

获取好友列表。

**方法**: `client.getFriendList()`

**返回**:
```typescript
Array<{
  user_id: number;
  nickname: string;
  remark: string;
}>
```

### send_like

点赞。

**方法**: `client.sendLike(userId, times?)` // 默认 1

## 文件操作

### get_image

获取图片信息。

**方法**: `client.getImage(file)`

**参数**:
- `file` - 文件ID

**返回**:
```typescript
{
  file: string;
  url: string;
}
```

### get_record

获取语音文件。

**方法**: `client.getRecord(file, outFormat?)`

**参数**:
- `file` - 文件ID
- `out_format` - 输出格式（如'mp3'）

**返回**:
```typescript
{
  file: string;
}
```

### get_file

获取文件信息。

**方法**: `client.getFile(file)`

**参数**:
- `file` - 文件ID

**返回**:
```typescript
{
  file: string;
  url: string;
}
```

### upload_group_file / upload_private_file

上传文件到群/私聊，支持本地路径、`Buffer`/`Uint8Array` 或可读流。

**方法**:
- `client.uploadGroupFile(groupId, file, name, folder?, uploadFile?)`
- `client.uploadPrivateFile(userId, file, name, uploadFile?)`

**参数**:
- `file` 支持本地路径

### upload_file_stream / get_upload_stream_status

NapCat Stream API 分片上传/状态查询（支持断点续传）。

**方法**:
- `client.uploadFileStream(file, options?)`
- `client.getUploadStreamStatus(streamId)`

**可选参数**:
- `streamId` 自定义流 ID（续传用）
- `chunkSize` 分片大小，默认 256KB
- `expectedSha256` 期望 SHA256
- `fileRetention` 分片保留时间（毫秒）
- `filename` 文件名
- `reset` 先重置流
- `verifyOnly` 仅校验分片，不写入

### download_file_stream / download_file_image_stream / download_file_record_stream

NapCat Stream API 流式下载（分片通过 WebSocket 返回）。

**方法**:
- `client.downloadFileStream(fileId, options?)`
- `client.downloadFileStreamToFile(fileId, options?)`
- `client.downloadFileImageStream(fileId, options?)`
- `client.downloadFileImageStreamToFile(fileId, options?)`
- `client.downloadFileRecordStream(fileId, outFormat?, options?)`
- `client.downloadFileRecordStreamToFile(fileId, outFormat?, options?)`

### clean_stream_temp_file

清理 NapCat 侧 stream 临时文件（按需）。

**方法**: `client.cleanStreamTempFile()`

## 系统/能力探测（NapCat 扩展）

用于排障、能力探测和运行状态确认：

**方法**:
- `client.getOnlineClients(noCache?)`
- `client.canSendImage()` / `client.canSendRecord()`
- `client.getCookies(domain)` / `client.getCsrfToken()` / `client.getCredentials(domain)`
- `client.setInputStatus(userId, eventType)`
- `client.ocrImage(image)` / `client.translateEn2zh(words)` / `client.checkUrlSafely(url)`
- `client.handleQuickOperation(context, operation)`

## NapCat 扩展 API

NapCat 在 OneBot 11 之外提供了大量扩展 action，NapLink 已封装常用部分（其余可用 `raw` 直通调用）。

常见示例：

- RKey：`getRkey()` / `getRkeyServer()` / `getRkeyEx()`
- 好友：`setFriendRemark()` / `deleteFriend()` / `getUnidirectionalFriendList()`
- 群：`setGroupRemark()` / `getGroupInfoEx()` / `getGroupDetailInfo()` / `getGroupIgnoredNotifies()` / `getGroupShutList()`
- 表情：`setMsgEmojiLike()` / `getEmojiLikes()` / `fetchEmojiLike()` / `fetchCustomFace()`

## 全量 action 直通（raw）

当你需要调用“服务端有实现但 SDK 还没写 wrapper”的 action 时，可以使用 `raw`：

```typescript
await client.api.raw['get_group_shut_list']({ group_id: 123 });

// 带 '.' 前缀的 action 用 bracket 写法
await client.api.raw['.ocr_image']({ image: 'file:///tmp/a.png' });
```

## 消息段类型

### 文本

```typescript
{
  type: 'text';
  data: { text: string };
}
```

### @某人

```typescript
{
  type: 'at';
  data: { qq: string | 'all' };
}
```

### 回复

```typescript
{
  type: 'reply';
  data: { id: string };
}
```

### 表情

```typescript
{
  type: 'face';
  data: { id: string };
}
```

### 图片

```typescript
{
  type: 'image';
  data: {
    file: string;    // 文件路径、URL或base64
    summary?: string;
    sub_type?: string;
  };
}
```

### 文件

```typescript
{
  type: 'file';
  data: {
    file: string;   // 文件路径或URL
    name?: string;
  };
}
```

### 语音

```typescript
{
  type: 'record';
  data: { file: string };
}
```

### 视频

```typescript
{
  type: 'video';
  data: { file: string };
}
```

### JSON消息

```typescript
{
  type: 'json';
  data: { data: string };
}
```

### XML消息

```typescript
{
  type: 'xml';
  data: { data: string };
}
```

### Markdown

```typescript
{
  type: 'markdown';
  data: { content: string };
}
```

## 自定义API调用

对于文档中未列出的API，可以使用：

```typescript
const result = await client.callApi('api_name', {
  param1: 'value1',
  param2: 'value2',
});
```

## 点赞/资料

### get_stranger_info

**方法**: `client.getStrangerInfo(userId, noCache?)`

### get_version_info

**方法**: `client.getVersionInfo()`

## 请求处理

### set_friend_add_request / set_group_add_request

处理好友/群请求或邀请。

**方法**:
- `client.handleFriendRequest(flag, approve?, remark?)`
- `client.handleGroupRequest(flag, subType, approve?, reason?)`

## OneBot 11 标准

完整的OneBot 11标准请参考：
[OneBot 11 文档](https://github.com/botuniverse/onebot-11)

## 相关文档

- [API调用指南](/guide/api) - API使用示例
- [NapLink类](/api/naplink) - 完整方法列表
- [事件处理](/guide/events) - 事件系统
