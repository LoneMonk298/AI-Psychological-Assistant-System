# MaxKB 与 MySQL 演示数据导入说明

## 1. MaxKB 数据导入

推荐导入顺序：

1. 在 MaxKB 中创建知识库。
2. 优先导入 `mock-data/maxkb_txt/` 目录下的 TXT 文件。
3. 如 TXT 导入效果不理想，可改用 `mock-data/maxkb_html/` 目录下的 HTML 文件。
4. 再导入 `mock-data/faq/faq.csv`，用于增强常见问题命中率。
5. 使用 `mock-data/test_questions.md` 中的问题进行答辩演示测试。

## 2. MySQL 导入

执行前先确认已经导入基础表结构 `database/init.sql`，然后执行：

```bash
mysql -uroot -p ai_psychological_assistant < /www/wwwroot/ai-psychological-assistant/demo_data.sql
```

如果不是 root 用户，替换成你的数据库用户名：

```bash
mysql -u你的数据库用户名 -p ai_psychological_assistant < /www/wwwroot/ai-psychological-assistant/demo_data.sql
```

## 3. 验证导入

```sql
USE ai_psychological_assistant;
SELECT COUNT(*) FROM knowledge_article;
SELECT COUNT(*) FROM psychological_chat_session;
SELECT COUNT(*) FROM psychological_chat_message;
SELECT COUNT(*) FROM emotion_diary;
```

## 4. 字段兼容说明

1. `knowledge_category.code` 已避开初始化数据中的 `relationship` 唯一索引冲突。
2. `emotion_diary.ai_emotion_analysis` 已使用合法 JSON 字符串。
3. `psychological_chat_message.sender_type` 已使用整数枚举：`1` 表示用户，`2` 表示助手。

