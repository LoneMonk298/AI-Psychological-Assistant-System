# 心理健康 AI 助手前端项目

## 项目简介

心理健康 AI 助手是一个面向学生心理健康辅助场景的前端项目，采用 Vue 3、Vite、Element Plus、Vue Router、Pinia 和 Axios 构建。系统提供公开主页、用户登录注册、心理知识库浏览、文章详情阅读、AI 咨询入口、情绪日志记录以及后台管理等功能。项目通过 `/api` 与 Spring Boot 后端服务交互，支持知识文章、咨询记录、情绪日志、文件上传和用户头像等业务数据展示与管理。

本项目适用于课程设计、心理健康服务平台原型、校园心理服务系统演示和 AI 知识库问答应用展示。系统后端可接入 MySQL 数据库和 MaxKB 知识库服务，前端负责页面展示、路由跳转、接口请求、表单交互和上传资源回显。

## 技术栈

| 技术 | 说明 |
| --- | --- |
| Vue 3 | 前端核心框架，使用组合式 API 开发页面逻辑 |
| Vite | 前端构建工具，提供开发服务器和生产打包能力 |
| Vue Router | 路由管理，支持公开页面、用户端页面和后台页面跳转 |
| Pinia | 全局状态管理 |
| Element Plus | UI 组件库，用于表单、按钮、弹窗、轮播图、表格等组件 |
| Axios | HTTP 请求库，用于与后端 REST API 通信 |
| ECharts | 图表展示，用于后台数据分析页面 |
| WangEditor | 富文本编辑器，用于知识文章内容编辑 |
| Sass | 样式预处理 |

## 工程目录

```text
ai-vue/
├─ public/                    # 静态公共资源
├─ src/                       # 前端源码目录
│  ├─ api/                    # 接口封装
│  │  ├─ admin.js             # 后台管理端接口
│  │  └─ frontend.js          # 用户端接口
│  ├─ assets/                 # 图片、Logo、页面预览图等静态资源
│  │  └─ images/              # 图标、默认图、情绪图片等
│  ├─ components/             # 公共组件
│  │  ├─ ArticleDialog.vue    # 知识文章新增/编辑弹窗
│  │  ├─ Authlayout.vue       # 登录页布局
│  │  ├─ BackendLayout.vue    # 后台管理布局
│  │  ├─ BrandMascot.vue      # 主页品牌视觉组件
│  │  ├─ Navbar.vue           # 后台顶部导航
│  │  ├─ RichTextEditor.vue   # 富文本编辑器组件
│  │  ├─ Sidebar.vue          # 后台侧边栏
│  │  ├─ UserLayout.vue       # 用户端布局
│  │  ├─ UserNavbar.vue       # 用户端导航栏
│  │  └─ UserProfileDialog.vue # 用户资料与头像上传弹窗
│  ├─ config/                 # 全局配置
│  │  └─ index.js             # 文件访问基础路径配置
│  ├─ router/                 # 路由配置和前置守卫
│  │  └─ index.js
│  ├─ stores/                 # Pinia 状态管理
│  ├─ utils/                  # 工具函数
│  │  ├─ fileUrl.js           # 文件 URL 解析工具
│  │  ├─ request.js           # Axios 实例和请求/响应拦截器
│  │  └─ userAvatar.js        # 用户头像字段兼容和 URL 解析工具
│  ├─ views/                  # 页面视图
│  │  ├─ index.vue            # 系统主页
│  │  ├─ login.vue            # 登录注册页
│  │  ├─ home.vue             # 用户端首页
│  │  ├─ chat.vue             # AI 咨询页
│  │  ├─ frontendKnowledge.vue # 用户端/公开知识库页面
│  │  ├─ articleDetail.vue    # 知识文章详情页
│  │  ├─ emotionDiary.vue     # 用户端情绪日志页
│  │  ├─ dashboard.vue        # 后台数据分析页
│  │  ├─ knowledge.vue        # 后台知识文章管理页
│  │  ├─ consultations.vue    # 咨询记录管理页
│  │  └─ emotion.vue          # 后台情绪日志管理页
│  ├─ App.vue                 # 根组件
│  ├─ main.js                 # 项目入口文件
│  └─ style.css               # 全局样式
├─ mock-data/                 # 演示数据和 MaxKB 导入资料
│  ├─ maxkb_docs/             # Markdown 知识文档
│  ├─ maxkb_txt/              # TXT 格式知识文档
│  ├─ maxkb_html/             # HTML 格式知识文档
│  ├─ faq/                    # FAQ 问答 CSV
│  └─ sql/                    # MySQL 演示数据 SQL
├─ scripts/                   # 数据生成和格式转换脚本
│  ├─ generate-mock-data.mjs  # 生成演示数据
│  └─ convert-maxkb-docs.mjs  # 转换 MaxKB 支持格式
├─ index.html                 # Vite HTML 入口
├─ vite.config.js             # Vite 配置
├─ package.json               # 项目依赖和脚本
└─ package-lock.json          # 依赖锁定文件
```

## 核心功能

### 公开页面

- 系统主页：展示项目定位、功能预览、登录入口和隐私政策。
- 公开知识库：未登录用户可浏览心理健康知识文章。
- 文章详情：展示文章标题、封面、正文内容和文章信息。

### 用户端功能

- 用户登录注册与登录状态保存。
- 用户首页功能入口。
- AI 咨询页面，用于接入 MaxKB 问答服务。
- 情绪日志记录页面，支持情绪、睡眠、压力和触发因素记录。
- 用户资料弹窗，支持头像上传和个人信息修改。

### 后台管理功能

- 数据分析页：展示文章、咨询、情绪日志等统计信息。
- 知识文章管理：支持文章分页查询、新增、编辑、发布/下线、删除、封面上传。
- 咨询记录管理：支持咨询会话分页查看和消息详情查看。
- 情绪日志管理：支持日志分页查询、详情查看和删除。

### 演示数据与 MaxKB 数据

- 提供 120 篇心理健康知识文档。
- 提供 TXT、HTML、CSV 等 MaxKB 支持格式。
- 提供 MySQL 演示数据 SQL，用于答辩和系统演示。

## 环境要求

建议使用以下环境：

```text
Node.js 18 或以上
npm 9 或以上
```

查看本机版本：

```bash
node -v
npm -v
```

## 安装依赖

进入前端项目目录：

```bash
cd ai-vue
```

安装依赖：

```bash
npm install
```

如果依赖安装较慢，可以配置 npm 镜像源后再安装。

## 本地开发运行

启动开发服务器：

```bash
npm run dev
```

启动后访问终端提示的地址，一般为：

```text
http://localhost:5173
```

开发环境下，前端请求 `/api` 会通过 `vite.config.js` 代理到后端服务：

```js
server: {
  proxy: {
    '/api': {
      target: 'http://36.138.103.18:38180',
      changeOrigin: true
    },
  },
}
```

如果后端部署地址发生变化，请修改 `vite.config.js` 中的 `target`。

## 生产打包

执行：

```bash
npm run build
```

打包完成后会生成：

```text
dist/
```

`dist` 目录中的文件即为生产环境静态资源，可上传到 Nginx、宝塔面板、Vercel 等静态站点环境。

## 本地预览打包结果

```bash
npm run preview
```

该命令用于本地预览 `dist` 构建产物，不等同于开发模式。

## 宝塔/Nginx 部署说明

将 `dist` 目录中的内容上传到宝塔站点根目录，例如：

```text
/www/wwwroot/web.lonemonk.xyz/
```

注意是上传 `dist` 内部的文件，而不是把整个 `dist` 文件夹放到站点目录下。

推荐 Nginx 配置如下：

```nginx
location ^~ /api/ {
    proxy_pass http://127.0.0.1:38080/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_connect_timeout 10s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    client_max_body_size 10M;

    add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0" always;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

其中：

- `/api/` 用于代理 Spring Boot 后端服务。
- `try_files $uri $uri/ /index.html;` 用于解决 Vue Router history 模式刷新页面 404 的问题。
- 上传图片访问路径通常为 `/api/uploads/...`，需要确保后端已配置上传目录静态资源映射。

## 后端接口说明

前端默认通过 `/api` 调用后端接口，常用接口包括：

| 接口 | 说明 |
| --- | --- |
| `/api/user/login` | 用户登录 |
| `/api/user/register` | 用户注册 |
| `/api/user/profile` | 用户资料查询/更新 |
| `/api/file/upload` | 文件上传 |
| `/api/knowledge/category/tree` | 知识分类查询 |
| `/api/knowledge/article/page` | 知识文章分页查询 |
| `/api/knowledge/article/{id}` | 知识文章详情 |
| `/api/psychological-chat/sessions` | 咨询会话分页查询 |
| `/api/psychological-chat/sessions/{sessionId}/messages` | 咨询消息查询 |
| `/api/emotion-diary/admin/page` | 后台情绪日志分页查询 |
| `/api/emotion-diary/admin/{id}` | 后台情绪日志删除 |

统一响应格式示例：

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

## 演示数据使用说明

项目提供演示数据目录 `mock-data/`，用于 MaxKB 知识库导入和 MySQL 数据库演示。

### MaxKB 知识库资料

推荐导入：

```text
mock-data/maxkb_txt/
mock-data/faq/faq.csv
```

如果 TXT 导入效果不理想，可以使用：

```text
mock-data/maxkb_html/
```


## 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建生产环境静态文件 |
| `npm run preview` | 本地预览生产构建结果 |
| `node scripts/generate-mock-data.mjs` | 重新生成演示数据 |
| `node scripts/convert-maxkb-docs.mjs` | 将 Markdown 知识文档转换为 TXT/HTML |

## 项目说明

本项目为课程设计和功能演示项目，心理健康知识库和 FAQ 数据主要用于系统测试与答辩演示，不作为专业心理诊断或治疗依据。

