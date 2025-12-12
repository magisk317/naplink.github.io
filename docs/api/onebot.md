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

## 自定义API调用

对于文档中未列出的API，可以使用：

```typescript
const result = await client.callApi('api_name', {
  param1: 'value1',
  param2: 'value2',
});
```

## OneBot 11 标准

完整的OneBot 11标准请参考：
[OneBot 11 文档](https://github.com/botuniverse/onebot-11)

## 相关文档

- [API调用指南](/guide/api) - API使用示例
- [NapLink类](/api/naplink) - 完整方法列表
- [事件处理](/guide/events) - 事件系统
