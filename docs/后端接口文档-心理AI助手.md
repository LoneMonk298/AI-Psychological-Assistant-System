# 心理AI助手后端接口文档

生成日期：2026-06-22  
项目名称：AI Psychological Assistant System / 心理健康 AI 助手  
后端模块：`ai-server`  
基础路径：`/api`

## 1. 后端代码结构分析

### 1.1 技术栈

| 类型 | 技术 |
| --- | --- |
| 运行环境 | Java 21 |
| Web 框架 | Spring Boot 3.3.5 |
| ORM | MyBatis-Plus 3.5.9 |
| 数据库 | MySQL 8.x |
| 鉴权 | JWT，Authorization Bearer Token |
| 密码加密 | BCrypt |
| 文件上传 | Spring MultipartFile |
| 邮件验证码 | Spring Mail，未配置 SMTP 时写入后端日志 |

### 1.2 主要包结构

| 包路径 | 作用 |
| --- | --- |
| `controller` | 对外 REST API 接口 |
| `dto` | 请求参数对象 |
| `entity` | 数据库表实体 |
| `mapper` | MyBatis-Plus 数据访问接口 |
| `common` | 统一响应、业务异常、全局异常处理 |
| `config` | 分页插件、静态资源映射、JWT 统一鉴权拦截器 |
| `service` | 邮件发送、验证码缓存与校验 |
| `util` | JWT 生成解析、当前用户解析 |

### 1.3 统一响应格式

所有接口统一返回：

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

| code | 含义 |
| --- | --- |
| `200` | 请求成功 |
| `500` | 业务异常或服务器异常 |
| `-1` | 未登录、登录过期或 token 无效 |

### 1.4 JWT 统一鉴权说明

后端新增 `JwtAuthInterceptor`，在 `WebMvcConfig` 中对 `/**` 注册统一拦截。除公开接口外，请求都需要通过请求头传递 token：

```http
Authorization: Bearer <token>
```

统一鉴权流程：

1. 放行 `OPTIONS` 预检请求。
2. 判断当前路径是否属于公开路径。
3. 非公开路径必须携带 `Authorization: Bearer <token>`。
4. 通过 `JwtUtil` 解析用户 ID。
5. 查询 `sys_user`，确认用户存在且 `status=1`。
6. 对管理员路径额外校验角色是否为 `ADMIN` 或 `SUPER_ADMIN`。

公开路径：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/user/login` | 登录 |
| POST | `/user/register` | 注册 |
| POST | `/user/password/reset-code` | 发送重置验证码 |
| PUT | `/user/password/reset` | 重置密码 |
| GET | `/knowledge/category/tree` | 知识库分类 |
| GET | `/knowledge/article/page` | 文章分页 |
| GET | `/knowledge/article/{id}` | 文章详情 |
| GET | `/uploads/**` | 上传资源静态访问 |

管理员路径：

| 路径 | 规则 |
| --- | --- |
| `/data-analytics/**` | 需要 `ADMIN` 或 `SUPER_ADMIN` |
| `/psychological-chat/**` | 需要 `ADMIN` 或 `SUPER_ADMIN` |
| `/emotion-diary/admin/**` | 需要 `ADMIN` 或 `SUPER_ADMIN` |
| 非 GET 的 `/knowledge/article/**` | 新增、更新、发布、删除文章需要 `ADMIN` 或 `SUPER_ADMIN` |

特殊权限：`POST /user/admin` 除了需要登录外，还会在 Controller 中校验当前用户必须为 `SUPER_ADMIN`。

### 1.5 角色说明

| 角色 | 说明 |
| --- | --- |
| `USER` | 普通用户 |
| `ADMIN` | 管理员 |
| `SUPER_ADMIN` | 超级管理员，可创建管理员 |

前端中的 `roleType`：

| roleType | 含义 |
| --- | --- |
| `1` | 普通用户 |
| `2` | 管理员或超级管理员 |

### 1.6 数据表概览

| 表名 | 实体 | 说明 |
| --- | --- | --- |
| `sys_user` | `SysUser` | 用户、管理员、超级管理员 |
| `knowledge_category` | `KnowledgeCategory` | 知识库分类 |
| `knowledge_article` | `KnowledgeArticle` | 知识库文章 |
| `file_resource` | `FileResource` | 上传文件记录 |
| `emotion_diary` | `EmotionDiary` | 情绪日志与分析结果 |
| `psychological_chat_session` | `PsychologicalChatSession` | 心理咨询会话记录 |
| `psychological_chat_message` | `PsychologicalChatMessage` | 心理咨询消息记录 |

## 2. 接口总览

| 模块 | 方法 | 路径 | 说明 | 鉴权 |
| --- | --- | --- | --- | --- |
| 用户认证 | POST | `/user/login` | 用户登录 | 否 |
| 用户认证 | POST | `/user/register` | 用户注册 | 否 |
| 用户管理 | POST | `/user/admin` | 超级管理员创建管理员 | 是，`SUPER_ADMIN` |
| 用户管理 | GET | `/user/profile` | 获取当前用户资料 | 是 |
| 用户管理 | PUT | `/user/profile` | 修改当前用户资料 | 是 |
| 用户管理 | PUT | `/user/password` | 修改当前用户密码 | 是 |
| 用户管理 | PUT | `/user/email` | 修改当前用户邮箱 | 是 |
| 用户认证 | POST | `/user/password/reset-code` | 发送邮箱重置验证码 | 否 |
| 用户认证 | PUT | `/user/password/reset` | 邮箱验证码重置密码 | 否 |
| 用户认证 | POST | `/user/logout` | 退出登录 | 是 |
| 知识库 | GET | `/knowledge/category/tree` | 获取知识分类 | 否 |
| 知识库 | GET | `/knowledge/article/page` | 分页查询文章 | 否 |
| 知识库 | POST | `/knowledge/article` | 新增文章 | 管理员 |
| 知识库 | GET | `/knowledge/article/{id}` | 文章详情 | 否 |
| 知识库 | PUT | `/knowledge/article/{id}` | 更新文章 | 管理员 |
| 知识库 | PUT | `/knowledge/article/{id}/status` | 修改文章状态 | 管理员 |
| 知识库 | DELETE | `/knowledge/article/{id}` | 删除文章 | 管理员 |
| 文件 | POST | `/file/upload` | 上传文件 | 是 |
| 情绪日志 | POST | `/emotion-diary` | 新增情绪日志 | 是 |
| 情绪日志 | GET | `/emotion-diary/admin/page` | 管理端分页查询情绪日志 | 管理员 |
| 情绪日志 | DELETE | `/emotion-diary/admin/{id}` | 删除情绪日志 | 管理员 |
| 咨询记录 | GET | `/psychological-chat/sessions` | 分页查询咨询会话 | 管理员 |
| 咨询记录 | GET | `/psychological-chat/sessions/{sessionId}/messages` | 查询会话消息 | 管理员 |
| 数据分析 | GET | `/data-analytics/overview` | 综合数据概览 | 管理员 |
| 数据分析 | GET | `/data-analytics/emotion-trend` | 近 7 天情绪趋势 | 管理员 |
| 数据分析 | GET | `/data-analytics/chat-stats` | 咨询统计 | 管理员 |
| 数据分析 | GET | `/data-analytics/knowledge-stats` | 知识库统计 | 管理员 |

## 3. 用户认证与用户管理接口

### 3.1 用户登录

```http
POST /api/user/login
Content-Type: application/json
```

请求参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `username` | string | 是 | 登录用户名 |
| `password` | string | 是 | 登录密码 |

请求示例：

```json
{
  "username": "admin",
  "password": "123456"
}
```

成功响应：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "jwt-token",
    "userInfo": {
      "id": 1,
      "username": "admin",
      "nickname": "系统管理员",
      "email": "admin@example.com",
      "phone": "13800000000",
      "age": 22,
      "gender": "unknown",
      "avatar": null,
      "avatarUrl": null,
      "role": "SUPER_ADMIN",
      "roleType": 2
    }
  }
}
```

失败响应：

```json
{
  "code": -1,
  "msg": "用户名或密码错误",
  "data": null
}
```

### 3.2 用户注册

```http
POST /api/user/register
Content-Type: application/json
```

请求参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `username` | string | 是 | 用户名，3-20 位 |
| `password` | string | 是 | 密码，至少 6 位 |
| `email` | string | 否 | 邮箱 |

请求示例：

```json
{
  "username": "student01",
  "password": "123456",
  "email": "student01@example.com"
}
```

成功响应：

```json
{
  "code": 200,
  "msg": "success",
  "data": null
}
```

说明：注册用户默认角色为 `USER`，密码使用 BCrypt 加密保存。

### 3.3 超级管理员创建管理员

```http
POST /api/user/admin
Content-Type: application/json
Authorization: Bearer <token>
```

权限要求：当前登录用户必须为 `SUPER_ADMIN`。

请求参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `username` | string | 是 | 管理员用户名 |
| `password` | string | 是 | 初始密码，至少 6 位 |
| `email` | string | 否 | 管理员邮箱 |

请求示例：

```json
{
  "username": "admin02",
  "password": "123456",
  "email": "admin02@example.com"
}
```

成功响应：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 3,
    "username": "admin02",
    "nickname": "admin02",
    "email": "admin02@example.com",
    "role": "ADMIN",
    "roleType": 2
  }
}
```

常见错误：

```json
{
  "code": 500,
  "msg": "Only SUPER_ADMIN can create admin users",
  "data": null
}
```

### 3.4 获取当前用户资料

```http
GET /api/user/profile
Authorization: Bearer <token>
```

成功响应：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 2,
    "username": "student01",
    "nickname": "学生用户",
    "email": "student01@example.com",
    "phone": null,
    "age": 20,
    "gender": "unknown",
    "avatar": "/api/uploads/avatar.png",
    "avatarUrl": "/api/uploads/avatar.png",
    "role": "USER",
    "roleType": 1
  }
}
```

### 3.5 修改当前用户资料

```http
PUT /api/user/profile
Content-Type: application/json
Authorization: Bearer <token>
```

请求参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `username` | string | 否 | 用户名 |
| `nickname` | string | 否 | 昵称 |
| `email` | string | 否 | 邮箱 |
| `age` | number | 否 | 年龄 |
| `gender` | string | 否 | 性别 |
| `avatar` | string | 否 | 头像地址 |

请求示例：

```json
{
  "nickname": "小明",
  "email": "student01@example.com",
  "age": 20,
  "gender": "male",
  "avatar": "/api/uploads/2026/06/22/avatar.jpg"
}
```

### 3.6 修改当前用户密码

```http
PUT /api/user/password
Content-Type: application/json
Authorization: Bearer <token>
```

请求参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `oldPassword` | string | 是 | 原密码 |
| `newPassword` | string | 是 | 新密码 |

请求示例：

```json
{
  "oldPassword": "123456",
  "newPassword": "654321"
}
```

### 3.7 修改当前用户邮箱

```http
PUT /api/user/email
Content-Type: application/json
Authorization: Bearer <token>
```

请求示例：

```json
{
  "email": "new-email@example.com"
}
```

### 3.8 发送邮箱重置密码验证码

```http
POST /api/user/password/reset-code
Content-Type: application/json
```

请求参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `email` | string | 是 | 已绑定账号的邮箱 |

请求示例：

```json
{
  "email": "student01@example.com"
}
```

说明：

- 验证码为 6 位数字。
- 有效期 5 分钟。
- 使用后立即失效。
- 配置 SMTP 时发送邮件；未配置时写入后端日志。

### 3.9 邮箱验证码重置密码

```http
PUT /api/user/password/reset
Content-Type: application/json
```

请求参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `email` | string | 是 | 邮箱 |
| `code` | string | 是 | 验证码 |
| `newPassword` | string | 是 | 新密码，至少 6 位 |

请求示例：

```json
{
  "email": "student01@example.com",
  "code": "123456",
  "newPassword": "654321"
}
```

### 3.10 退出登录

```http
POST /api/user/logout
```

说明：当前实现为前端清除 token，本接口返回成功。

## 4. 知识库接口

### 4.1 获取知识分类

```http
GET /api/knowledge/category/tree
```

成功响应：

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 101,
      "parentId": null,
      "name": "焦虑调节",
      "categoryName": "焦虑调节",
      "code": "anxiety-regulation",
      "description": "分类描述",
      "sortOrder": 10,
      "status": 1,
      "createdAt": "2026-06-01T09:00:00",
      "updatedAt": "2026-06-13T09:00:00",
      "deleted": 0
    }
  ]
}
```

### 4.2 分页查询文章

```http
GET /api/knowledge/article/page
```

查询参数：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `currentPage` | number | 否 | 1 | 当前页 |
| `size` | number | 否 | 10 | 每页数量 |
| `title` | string | 否 | - | 标题模糊查询 |
| `categoryId` | number | 否 | - | 分类 ID |
| `status` | number | 否 | - | 0 草稿，1 已发布，2 已下线 |
| `sortField` | string | 否 | `updatedAt` | 支持 `readCount`、`publishedAt` |
| `sortDirection` | string | 否 | `desc` | `asc` 或 `desc` |

请求示例：

```http
GET /api/knowledge/article/page?currentPage=1&size=6&status=1&sortField=publishedAt&sortDirection=desc
```

返回数据：MyBatis-Plus 分页对象，核心字段如下：

| 字段 | 说明 |
| --- | --- |
| `records` | 当前页文章列表 |
| `total` | 总条数 |
| `size` | 每页数量 |
| `current` | 当前页 |
| `pages` | 总页数 |

文章字段：

| 字段 | 说明 |
| --- | --- |
| `id` | 文章 ID |
| `title` | 标题 |
| `categoryId` | 分类 ID |
| `authorId` | 作者 ID |
| `authorName` | 作者名称 |
| `summary` | 摘要 |
| `content` | 富文本内容 |
| `coverImg` | 封面图片路径 |
| `tags` | 标签，逗号分隔 |
| `status` | 文章状态 |
| `readCount` | 阅读量 |
| `publishedAt` | 发布时间 |
| `createdAt` | 创建时间 |
| `updatedAt` | 更新时间 |

### 4.3 新增文章

```http
POST /api/knowledge/article
Content-Type: application/json
Authorization: Bearer <admin-token>
```

请求示例：

```json
{
  "title": "考试焦虑的调节方法",
  "categoryId": 101,
  "summary": "介绍考试焦虑的识别和缓解方法。",
  "content": "<p>正文内容</p>",
  "coverImg": "/uploads/2026/06/22/cover.jpg",
  "tags": "焦虑,考试,心理健康",
  "status": 0
}
```

说明：

- 未传 `authorName` 时默认 `authorId=1`、`authorName=System Administrator`。
- 未传 `status` 时默认为 `0`。
- 未传 `readCount` 时默认为 `0`。

### 4.4 获取文章详情

```http
GET /api/knowledge/article/{id}
```

### 4.5 更新文章

```http
PUT /api/knowledge/article/{id}
Content-Type: application/json
Authorization: Bearer <admin-token>
```

请求体同新增文章，可传需要更新的字段。

### 4.6 修改文章状态

```http
PUT /api/knowledge/article/{id}/status
Content-Type: application/json
Authorization: Bearer <admin-token>
```

请求参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `status` | number | 是 | 0 草稿，1 发布，2 下线 |

请求示例：

```json
{
  "status": 1
}
```

说明：当 `status=1` 时，后端会自动写入 `publishedAt`。

### 4.7 删除文章

```http
DELETE /api/knowledge/article/{id}
Authorization: Bearer <admin-token>
```

说明：使用 MyBatis-Plus 逻辑删除。

## 5. 文件上传接口

### 5.1 上传文件

```http
POST /api/file/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

表单参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `file` | file | 是 | 上传文件 |
| `businessType` | string | 是 | 业务类型，如 `ARTICLE`、`avatar` |
| `businessId` | string | 否 | 业务 ID，不传则后端生成 UUID |
| `businessField` | string | 否 | 业务字段，如 `cover` |

成功响应：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "filePath": "/uploads/2026/06/22/uuid.jpg",
    "fileUrl": "/api/uploads/2026/06/22/uuid.jpg",
    "url": "/api/uploads/2026/06/22/uuid.jpg",
    "originalName": "cover.jpg"
  }
}
```

说明：

- 文件按日期目录保存：`uploadDir/yyyy/MM/dd/文件名`。
- 静态资源通过 `/api/uploads/**` 访问。
- 上传记录写入 `file_resource` 表。

## 6. 情绪日志接口

### 6.1 新增情绪日志

```http
POST /api/emotion-diary
Content-Type: application/json
Authorization: Bearer <token>
```

请求参数：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `diaryDate` | string | 否 | 日志日期，格式 `YYYY-MM-DD`，不传默认为当天 |
| `moodScore` | number | 是 | 心情评分，1-10 |
| `dominantEmotion` | string | 否 | 主要情绪 |
| `sleepQuality` | number | 否 | 睡眠质量 |
| `stressLevel` | number | 否 | 压力等级 |
| `emotionTriggers` | string | 否 | 情绪触发因素 |
| `diaryContent` | string | 否 | 日志内容 |

请求示例：

```json
{
  "diaryDate": "2026-06-22",
  "moodScore": 6,
  "dominantEmotion": "焦虑",
  "sleepQuality": 3,
  "stressLevel": 4,
  "emotionTriggers": "考试临近",
  "diaryContent": "今天复习效率不高，有些担心。"
}
```

成功响应包含日志字段与规则生成的分析字段：

| 字段 | 说明 |
| --- | --- |
| `mainEmotion` | 主要情绪 |
| `intensity` | 情绪强度 |
| `riskLevel` | 风险等级 |
| `sentiment` | 情绪倾向 |
| `analysisResult` | 分析文本 |
| `suggestion` | 建议 |
| `improvementSuggestions` | 改善建议列表 |

说明：当前情绪分析为规则生成，并非外部 AI 模型实时分析。

### 6.2 管理端分页查询情绪日志

```http
GET /api/emotion-diary/admin/page
Authorization: Bearer <admin-token>
```

查询参数：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `current` | number | 否 | 1 | 当前页 |
| `size` | number | 否 | 10 | 每页数量 |
| `userId` | number | 否 | - | 用户 ID |
| `moodScore` | number | 否 | - | 心情评分 |

返回字段：

| 字段 | 说明 |
| --- | --- |
| `records` | 日志列表 |
| `total` | 总条数 |
| `size` | 每页数量 |
| `current` | 当前页 |
| `pages` | 总页数 |

### 6.3 删除情绪日志

```http
DELETE /api/emotion-diary/admin/{id}
Authorization: Bearer <admin-token>
```

说明：使用 MyBatis-Plus 逻辑删除。

## 7. 心理咨询记录接口

当前系统前端通过 iframe 接入 MaxKB 对话页面，本模块主要用于管理端查询本地数据库中的咨询记录。

### 7.1 分页查询咨询会话

```http
GET /api/psychological-chat/sessions
Authorization: Bearer <admin-token>
```

查询参数：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `currentPage` | number | 否 | 1 | 当前页 |
| `size` | number | 否 | 10 | 每页数量 |

返回数据：MyBatis-Plus 分页对象。

会话字段：

| 字段 | 说明 |
| --- | --- |
| `id` | 会话 ID |
| `userId` | 用户 ID |
| `userNickname` | 用户昵称快照 |
| `sessionTitle` | 会话标题 |
| `lastMessageContent` | 最后一条消息摘要 |
| `messageCount` | 消息数量 |
| `startedAt` | 开始时间 |
| `lastMessageTime` | 最后消息时间 |
| `status` | 状态，1 进行中，2 已结束 |

### 7.2 查询会话消息

```http
GET /api/psychological-chat/sessions/{sessionId}/messages
Authorization: Bearer <admin-token>
```

消息字段：

| 字段 | 说明 |
| --- | --- |
| `id` | 消息 ID |
| `sessionId` | 会话 ID |
| `senderType` | 发送方，1 用户，2 AI，3 系统 |
| `content` | 消息内容 |
| `modelName` | 模型名称 |
| `promptTokens` | 输入 token 数 |
| `completionTokens` | 输出 token 数 |
| `createdAt` | 创建时间 |

## 8. 数据分析接口

### 8.1 综合数据概览

```http
GET /api/data-analytics/overview
Authorization: Bearer <admin-token>
```

成功响应：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "systemOverview": {
      "totalUsers": 12,
      "activeUsers": 12,
      "totalDiaries": 50,
      "todayNewDiaries": 2,
      "totalSessions": 10,
      "todayNewSessions": 1,
      "avgMoodScore": 6.8,
      "recordCount": 50
    },
    "consultationStats": {
      "totalSessions": 10,
      "avgDurationMinutes": 0
    },
    "emotionTrend": [],
    "consultationTrend": [],
    "knowledgeStats": {
      "totalArticles": 77,
      "publishedArticles": 70,
      "totalReadCount": 1200
    }
  }
}
```

### 8.2 近 7 天情绪趋势

```http
GET /api/data-analytics/emotion-trend
Authorization: Bearer <admin-token>
```

返回字段：

| 字段 | 说明 |
| --- | --- |
| `date` | 日期 |
| `avgMoodScore` | 平均心情评分 |
| `moodScore` | 平均心情评分，前端兼容字段 |
| `recordCount` | 当天记录数 |
| `count` | 当天记录数，前端兼容字段 |

### 8.3 咨询统计

```http
GET /api/data-analytics/chat-stats
Authorization: Bearer <admin-token>
```

返回字段：

| 字段 | 说明 |
| --- | --- |
| `totalSessions` | 总咨询会话数 |
| `avgDurationMinutes` | 平均咨询时长，当前固定为 0 |

### 8.4 知识库统计

```http
GET /api/data-analytics/knowledge-stats
Authorization: Bearer <admin-token>
```

返回字段：

| 字段 | 说明 |
| --- | --- |
| `totalArticles` | 文章总数 |
| `publishedArticles` | 已发布文章数 |
| `totalReadCount` | 总阅读量 |

## 9. 部署与环境变量

### 9.1 数据库配置

```yaml
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=ai_psychological_assistant
DB_USERNAME=ai_user
DB_PASSWORD=change_me
```

### 9.2 JWT 配置

```yaml
JWT_SECRET=change-this-production-secret-at-least-32-characters
JWT_EXPIRE_HOURS=24
```

### 9.3 文件上传配置

```yaml
UPLOAD_DIR=/www/wwwroot/ai-psychological-assistant/uploads
```

静态访问路径：

```text
/api/uploads/**
```

### 9.4 邮件验证码配置

示例，以 QQ 邮箱为例：

```yaml
MAIL_FROM=xxx@qq.com
SPRING_MAIL_HOST=smtp.qq.com
SPRING_MAIL_PORT=465
SPRING_MAIL_USERNAME=xxx@qq.com
SPRING_MAIL_PASSWORD=邮箱授权码
SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_SSL_ENABLE=true
```

说明：如果没有配置 SMTP，验证码接口仍会生成验证码，但只会输出到后端日志中。

## 10. 当前实现说明与结项建议

1. 用户登录、注册、管理员创建、个人资料修改、密码修改、邮箱验证码重置密码已经具备完整后端能力。
2. 知识库文章接口已支持分类、分页、筛选、排序、增删改查和发布状态管理。
3. 文件上传已打通封面图、头像等场景，返回 `filePath`、`fileUrl`、`url` 三个兼容字段。
4. 情绪日志接口会根据用户提交内容生成规则化分析结果，可支撑前端展示和后台统计。
5. 数据分析接口聚合本地数据库数据，包括用户、情绪日志、咨询记录和知识库文章。
6. MaxKB 当前由前端 iframe 直接接入，对话历史主要由 MaxKB 自身 cookie/session 管理；如果后续要求本系统用户与 MaxKB 历史强绑定，需要新增后端代理或同步 MaxKB 会话记录。
7. 当前后端已通过 `JwtAuthInterceptor` 增加统一鉴权：除公开接口外均需 token，文章写操作、情绪日志后台、咨询记录和数据分析接口均要求管理员角色。

## 11. 在线运行测试与示例代码实现说明

截图中的页面风格类似 Apifox、Swagger UI、Knife4j、Postman Documentation 这类接口文档工具。它们的“在线运行”“请求参数”“请求示例代码”通常不是手写页面，而是基于接口定义自动生成。

### 11.1 在线运行测试的原理

在线运行本质上是一个内置 HTTP 客户端：

1. 页面读取接口定义，例如方法、路径、Path 参数、Query 参数、Header 参数、Body JSON。
2. 用户在右侧面板填写参数。
3. 点击“发送”时，前端把参数组装成真实 HTTP 请求。
4. 请求发送到后端接口。
5. 页面把响应状态码、响应头、响应体展示出来。

以 `/knowledge/article/{id}/status` 为例：

```text
PUT /api/knowledge/article/1001/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": 1
}
```

页面中的 Path 参数 `id` 会替换 `{id}`，Header 参数会写入请求头，Body 参数会作为 JSON 请求体发送。

### 11.2 请求参数表如何生成

请求参数表通常来自以下信息：

| 参数来源 | 后端写法 | 文档展示 |
| --- | --- | --- |
| Path 参数 | `@PathVariable Long id` | Path 参数：`id` |
| Query 参数 | `@RequestParam String title` | Query 参数：`title` |
| Header 参数 | `@RequestHeader Authorization` | Header 参数：`Authorization` |
| Body 参数 | `@RequestBody ArticleStatusRequest` | Body JSON：`status` |
| 校验规则 | `@NotBlank`、`@Size`、`@Min`、`@Max` | 必填、长度、范围 |

如果使用 Apifox，也可以手动维护这些字段；如果使用 Swagger/OpenAPI，则可以从后端注解自动生成。

### 11.3 请求示例代码如何生成

示例代码一般由工具根据接口定义套模板生成。例如同一个请求可以生成：

curl：

```bash
curl -X PUT "http://localhost:8080/api/knowledge/article/1001/status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":1}'
```

Axios：

```js
import axios from "axios";

await axios.put(
  "http://localhost:8080/api/knowledge/article/1001/status",
  { status: 1 },
  {
    headers: {
      Authorization: "Bearer <token>",
    },
  }
);
```

Fetch：

```js
await fetch("http://localhost:8080/api/knowledge/article/1001/status", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <token>",
  },
  body: JSON.stringify({ status: 1 }),
});
```

### 11.4 本项目推荐实现方式

如果想让本项目也拥有截图那种高级接口文档页面，推荐两种方式：

#### 方式一：使用 Apifox

适合结项展示，成本最低。

流程：

1. 在 Apifox 新建项目。
2. 按模块录入接口，或导入 OpenAPI JSON。
3. 配置环境变量，例如：

```text
baseUrl = http://服务器地址/api
token = 登录接口返回的 JWT
```

4. 每个需要登录的接口统一配置 Header：

```text
Authorization: Bearer {{token}}
```

5. 点击“在线运行”即可测试接口。
6. 通过“分享文档”导出类似截图中的页面。

#### 方式二：后端集成 Swagger / OpenAPI

适合后续维护，接口变更后文档可以自动更新。

可在 `pom.xml` 添加：

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.6.0</version>
</dependency>
```

启动后访问：

```text
http://localhost:8080/api/swagger-ui/index.html
```

OpenAPI JSON 地址通常为：

```text
http://localhost:8080/api/v3/api-docs
```

然后可以把 `/v3/api-docs` 导入 Apifox，生成更漂亮的在线文档。

### 11.5 注意事项

1. 线上接口如果要允许文档页面在线测试，需要配置 CORS 或让文档页面与 API 同域。
2. JWT 统一鉴权后，在线测试必须先登录拿 token，再把 token 放到全局 Header。
3. 管理员接口需要 `ADMIN` 或 `SUPER_ADMIN` token。
4. `POST /user/admin` 必须使用 `SUPER_ADMIN` token。
5. 生产环境不建议公开 Swagger UI，可只在开发或答辩演示环境开放。
