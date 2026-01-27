# 更新日志

## v0.0.4

`v0.0.4` 专注于打通上游 NapCatQQ 的最新特性，补齐了表情回应 API、增强了文件上传控制，并适配了新的安全事件。

- GitHub Release：<https://github.com/NapLink/NapLink/releases/tag/v0.0.4>
- Tag：`v0.0.4`

### 主要更新

#### 1) 表情回应 (Emoji)
- **获取所有回应**: `getEmojiLikes()` 获取消息的完整表情回应列表。
- **分页获取详情**: `fetchEmojiLike()` 支持 `cookie` 参数，适配了上游的分页逻辑。

#### 2) 文件上传增强
- **上传控制**: `uploadGroupFile` / `uploadPrivateFile` 新增 `upload_file` 参数（默认 `true`）。允许仅发送文件信息而不实际上传文件内容（适配高级文件操作需求）。

#### 3) 安全性
- **灰条事件**: 新增 `ob11_group_gray_tip` 事件 (`notice.notify.gray_tip`)，用于监听群组封禁、解封等系统灰条提示。

#### 4) 其他
- **文档修正**: 修复了 NPM 徽章链接，明确了 TypeScript/JavaScript 语言支持。
- **类型完善**: 完善了 `NoticeEvent` 等类型定义。

## v0.0.3

`v0.0.3` 是一次维护性更新，主要优化了构建流程和依赖管理。

- GitHub Release：<https://github.com/NapLink/NapLink/releases/tag/v0.0.3>
- Tag：`v0.0.3`

### 主要更新

- 优化了项目构建配置。
- 更新了部分依赖版本。

## v0.0.2

`v0.0.2` 重点补齐了 NapCat 的 `stream-action` 能力，并将 NapCatQQ 服务端的 action 做到“全量可调用”，同时补充了系统/扩展类 API，降低业务侧 `callApi()`/兼容分支的数量。

- GitHub Release：<https://github.com/NapLink/NapLink/releases/tag/v0.0.2>
- Tag：`v0.0.2`

### 主要更新

#### 1) stream-action：流式上传/下载

- `uploadFileStream()` / `getUploadStreamStatus()`
- `downloadFileStream()` / `downloadFileStreamToFile()`
- `downloadFileImageStream()` / `downloadFileImageStreamToFile()`
- `downloadFileRecordStream()` / `downloadFileRecordStreamToFile()`
- `cleanStreamTempFile()`

#### 2) P0–P2 常用能力封装

- 已读/历史：`markGroupMsgAsRead()` / `markPrivateMsgAsRead()` / `markAllMsgAsRead()`、`getGroupMsgHistory()` / `getFriendMsgHistory()`
- 戳一戳：`sendGroupPoke()` / `sendFriendPoke()` / `sendPoke()`
- 系统/能力探测：`getOnlineClients()`、`canSendImage()` / `canSendRecord()`、`getCookies()` / `getCsrfToken()` / `getCredentials()`、`setInputStatus()`、`ocrImage()` / `translateEn2zh()` / `checkUrlSafely()`
- 媒体补全：`hydrateMedia()` 兼容 `file_id -> file`

#### 3) 全量 action 直通

新增 `client.api.raw[...]`（以及 `client.raw[...]`）用于直通调用服务端 action（包含带 `.` 前缀的 action）：

```ts
await client.api.raw['get_group_shut_list']({ group_id: 123 });
await client.api.raw['.ocr_image']({ image: 'file:///tmp/a.png' });
```

## v0.0.1

首个公开版本：连接管理、OneBot 事件、常用 API、基础流式上传等。

- GitHub Release：<https://github.com/NapLink/NapLink/releases/tag/v0.0.1>
- Tag：`v0.0.1`

