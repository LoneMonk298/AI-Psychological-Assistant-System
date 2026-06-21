# 宝塔部署说明

目标结构：

```text
Nginx: 对外提供网站和 /api 反向代理
Vue dist: /www/wwwroot/ai-psychological-assistant/web
Spring Boot jar: /www/wwwroot/ai-psychological-assistant/server/ai-server.jar
Uploads: /www/wwwroot/ai-psychological-assistant/uploads
MySQL: ai_psychological_assistant
```

## 1. 宝塔安装环境

在宝塔软件商店安装：

- Nginx
- MySQL 8.x
- Java 项目管理器，JDK 17 或 JDK 21

## 2. 创建数据库

在宝塔“数据库”中新建：

```text
数据库名：ai_psychological_assistant
用户名：ai_user
密码：自行生成强密码
```

导入项目里的 SQL：

```text
database/init.sql
```

## 3. 本地打包

后端：

```bash
cd ai-server
mvn clean package -DskipTests
```

上传：

```text
ai-server/target/ai-server-0.0.1-SNAPSHOT.jar
```

到服务器：

```text
/www/wwwroot/ai-psychological-assistant/server/ai-server.jar
```

前端：

```bash
cd ai-vue
npm run build
```

上传 `ai-vue/dist` 里的所有文件到：

```text
/www/wwwroot/ai-psychological-assistant/web
```

## 4. 创建上传目录

服务器执行：

```bash
mkdir -p /www/wwwroot/ai-psychological-assistant/uploads
```

确保 Java 进程用户有写入权限。宝塔 Java 项目管理器一般用当前面板用户启动；若上传失败，再检查目录权限。

## 5. 启动 Spring Boot

宝塔 Java 项目管理器中新建 Java 项目：

```text
项目名称：ai-server
项目 jar：/www/wwwroot/ai-psychological-assistant/server/ai-server.jar
项目端口：8080
启动参数：
--spring.profiles.active=prod
```

环境变量建议配置：

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=ai_psychological_assistant
DB_USERNAME=ai_user
DB_PASSWORD=你的宝塔数据库密码
JWT_SECRET=至少32位的随机字符串
UPLOAD_DIR=/www/wwwroot/ai-psychological-assistant/uploads
```

如果宝塔 Java 项目管理器不方便填环境变量，也可以用启动命令：

```bash
java -jar ai-server.jar \
  --spring.profiles.active=prod \
  --DB_USERNAME=ai_user \
  --DB_PASSWORD=你的宝塔数据库密码 \
  --JWT_SECRET=至少32位的随机字符串
```

## 6. Nginx 配置

宝塔中新建站点，网站目录指向：

```text
/www/wwwroot/ai-psychological-assistant/web
```

站点 Nginx 配置加入：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location /api/ {
    proxy_pass http://127.0.0.1:8080/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 7. 部署后验证

浏览器访问：

```text
http://你的域名/api/knowledge/category/tree
```

看到：

```json
{"code":200,"msg":"success","data":[...]}
```

说明后端和数据库通了。

再访问：

```text
http://你的域名/
```

登录后台并测试知识文章、封面上传、咨询记录、情绪日志。

