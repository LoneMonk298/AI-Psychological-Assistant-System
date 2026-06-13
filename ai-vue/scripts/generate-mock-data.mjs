import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const outDir = path.join(rootDir, 'mock-data');
const docsDir = path.join(outDir, 'maxkb_docs');
const faqDir = path.join(outDir, 'faq');
const sqlDir = path.join(outDir, 'sql');

const categories = [
  {
    id: 101,
    name: '焦虑调节',
    code: 'anxiety-regulation',
    count: 18,
    summary: '围绕考试焦虑、社交焦虑、过度担心和身体紧张反应，提供识别、放松和行动拆解方法。',
    scenarios: ['考试前紧张', '担心未来结果', '上台发言害怕', '心慌和坐立不安', '反复确认与担忧'],
    methods: ['腹式呼吸', '担忧时间', '证据记录法', '小步暴露', '身体扫描'],
  },
  {
    id: 102,
    name: '压力管理',
    code: 'stress-management',
    count: 16,
    summary: '帮助学生识别压力来源，建立任务优先级、休息节奏和支持系统。',
    scenarios: ['任务堆积', 'DDL 临近', '社团和学习冲突', '长期疲惫', '对结果要求过高'],
    methods: ['四象限任务法', '番茄钟', '压力源清单', '恢复性休息', '求助沟通'],
  },
  {
    id: 103,
    name: '睡眠改善',
    code: 'sleep-improvement',
    count: 14,
    summary: '关注入睡困难、睡前反刍、作息紊乱和睡眠质量下降等问题。',
    scenarios: ['睡前脑子停不下来', '熬夜后白天困倦', '考试前失眠', '午睡过久', '醒来后仍疲惫'],
    methods: ['固定起床时间', '睡前放松仪式', '减少屏幕刺激', '渐进式肌肉放松', '睡眠记录'],
  },
  {
    id: 104,
    name: '情绪识别',
    code: 'emotion-awareness',
    count: 14,
    summary: '训练学生识别情绪名称、强度、触发因素和身体信号，提升情绪表达能力。',
    scenarios: ['突然烦躁', '说不清自己的感受', '情绪波动明显', '容易压抑情绪', '难以表达委屈'],
    methods: ['情绪命名', '情绪温度计', '身体信号记录', '触发因素追踪', '情绪日记'],
  },
  {
    id: 105,
    name: '人际关系',
    code: 'interpersonal-relationship',
    count: 14,
    summary: '覆盖宿舍关系、同伴沟通、边界表达、冲突修复和孤独感应对。',
    scenarios: ['室友矛盾', '被误解', '不敢拒绝别人', '关系疏远', '沟通后更尴尬'],
    methods: ['非暴力沟通', '边界表达', '复述确认', '冲突降温', '主动支持'],
  },
  {
    id: 106,
    name: '学业压力',
    code: 'academic-pressure',
    count: 18,
    summary: '面向考试、绩点、论文、实习和未来规划焦虑，提供学习计划与自我效能支持。',
    scenarios: ['复习效率低', '担心挂科', '论文拖延', '成绩比较', '未来规划迷茫'],
    methods: ['目标拆解', '复习计划表', '错题复盘', '行动清单', '阶段反馈'],
  },
  {
    id: 107,
    name: '自我接纳',
    code: 'self-acceptance',
    count: 10,
    summary: '帮助学生处理自我否定、完美主义、比较心理和低价值感。',
    scenarios: ['总觉得自己不够好', '害怕失败', '经常和别人比较', '自责明显', '不敢尝试'],
    methods: ['自我同情练习', '优点证据清单', '降低完美标准', '成长型思维', '友善自我对话'],
  },
  {
    id: 108,
    name: '正念放松',
    code: 'mindfulness',
    count: 8,
    summary: '提供呼吸、身体扫描、五感练习和短时正念方法，帮助恢复当下感。',
    scenarios: ['注意力分散', '身体紧绷', '情绪过载', '无法安静下来', '压力后难恢复'],
    methods: ['三分钟呼吸空间', '五感落地法', '身体扫描', '正念行走', '觉察呼吸'],
  },
  {
    id: 109,
    name: '危机识别与求助',
    code: 'crisis-support',
    count: 8,
    summary: '识别明显风险信号，强调及时联系专业人员、学校心理中心或紧急支持资源。',
    scenarios: ['持续绝望', '自伤念头', '严重失眠', '惊恐发作频繁', '无法维持日常学习生活'],
    methods: ['风险信号识别', '安全计划', '联系可信任的人', '学校心理中心预约', '紧急求助'],
  },
];

const topicPool = [
  '考试前紧张的自我调节方法',
  '睡前反复思考时的放松步骤',
  '学习任务太多时如何安排优先级',
  '和室友发生矛盾后的沟通方式',
  '面对成绩比较时如何稳定心态',
  '上台发言前的焦虑缓解练习',
  '情绪低落时的自我照顾清单',
  '长期压力下如何安排恢复性休息',
  '拖延复习时如何启动第一步',
  '不敢拒绝别人时的边界表达',
  '感觉自己不够好时的自我接纳练习',
  '使用情绪日记理解自己的感受',
  '用正念呼吸缓解身体紧张',
  '临近截止日期时的压力拆解',
  '失眠后第二天如何调整状态',
  '被同学误解后的情绪处理',
  '担心未来发展时的行动计划',
  '出现明显心理危机信号时如何求助',
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
}

function pad(num) {
  return String(num).padStart(3, '0');
}

function safeName(name) {
  return name.replace(/[\\/:*?"<>|]/g, '，');
}

function sql(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

function makeTitle(category, index) {
  const base = topicPool[(index + category.id) % topicPool.length];
  if (base.includes(category.name.slice(0, 2))) return base;
  return `${category.name}：${base}`;
}

function makeArticle(category, index) {
  const title = makeTitle(category, index);
  const scenarioA = category.scenarios[index % category.scenarios.length];
  const scenarioB = category.scenarios[(index + 2) % category.scenarios.length];
  const methodA = category.methods[index % category.methods.length];
  const methodB = category.methods[(index + 1) % category.methods.length];
  const methodC = category.methods[(index + 2) % category.methods.length];
  const keywords = [category.name, scenarioA, methodA, '大学生心理健康'];
  const summary = `本文围绕${scenarioA}和${scenarioB}等常见学生心理场景，介绍${methodA}、${methodB}和${methodC}等可操作方法，帮助使用者识别状态、稳定情绪并逐步恢复日常节奏。`;

  const markdown = `# ${title}

## 分类
${category.name}

## 摘要
${summary}

## 适用场景
- ${scenarioA}
- ${scenarioB}
- 希望通过简单练习改善当前状态
- 需要为咨询或自我反思整理问题

## 正文

### 1. 先识别当前状态
当出现${scenarioA}时，可以先暂停对自己的批评，把注意力放在“我现在发生了什么”上。建议记录三个信息：当时的事件、脑海中最强烈的想法、身体上最明显的反应。这样做不是为了立刻消除情绪，而是帮助自己从混乱感中退后一步，看清楚压力或情绪的来源。

### 2. 使用可执行的小步骤
面对${scenarioB}，不要一开始就要求自己完全恢复。可以先选择一个 5 到 10 分钟内能完成的小行动，例如整理桌面、写下任务清单、喝水、短暂散步或给可信任的人发一条消息。小步骤可以降低启动难度，让大脑重新获得掌控感。

### 3. 练习${methodA}
${methodA}适合在情绪强度较高时使用。练习时先找到一个相对安静的位置，保持自然坐姿或站姿，把注意力放在呼吸、身体触感或眼前可见的物品上。如果注意力被担忧带走，只需要温和地把它带回来，不需要责备自己。

### 4. 结合${methodB}和${methodC}
单一方法不一定适合所有情况。可以把${methodB}用于梳理问题，把${methodC}用于放松身体或安排下一步行动。持续记录几天后，通常能更清楚地看到哪些方法对自己更有效。

## 注意事项
本资料仅用于心理健康科普和系统测试，不能替代专业诊断或治疗。如果出现持续绝望、自伤想法、明显失控、长时间无法睡眠或难以维持正常学习生活等情况，应及时联系学校心理中心、专业心理咨询师或当地紧急求助资源。

## 关键词
${keywords.join('、')}
`;

  return { title, summary, content: markdown, keywords };
}

function writeMaxKbDocs() {
  const articles = [];
  let globalIndex = 1;

  for (const category of categories) {
    const categoryDir = path.join(docsDir, category.name);
    ensureDir(categoryDir);

    for (let i = 0; i < category.count; i += 1) {
      const article = makeArticle(category, i);
      const fileName = `${pad(globalIndex)}-${safeName(article.title)}.md`;
      const filePath = path.join(categoryDir, fileName);
      fs.writeFileSync(filePath, article.content, 'utf8');
      articles.push({
        id: 1000 + globalIndex,
        categoryId: category.id,
        categoryName: category.name,
        title: article.title,
        summary: article.summary,
        content: article.content,
        tags: article.keywords.join(','),
      });
      globalIndex += 1;
    }
  }

  return articles;
}

function writeFaq() {
  const rows = [['category', 'question', 'answer']];
  let count = 0;

  for (const category of categories) {
    for (let i = 0; i < 17 && count < 150; i += 1) {
      const scenario = category.scenarios[i % category.scenarios.length];
      const methodA = category.methods[i % category.methods.length];
      const methodB = category.methods[(i + 1) % category.methods.length];
      const questionPrefix = [
        `我遇到${scenario}怎么办？`,
        `${scenario}时有没有简单方法？`,
        `最近总是${scenario}，该如何调整？`,
      ][i % 3];
      const answer = `可以先记录触发事件、想法和身体反应，再尝试${methodA}。如果状态仍然明显，可以结合${methodB}，把问题拆成一个今天能完成的小行动。若出现持续失眠、自伤想法或无法维持学习生活，应及时寻求专业帮助。`;
      rows.push([category.name, questionPrefix, answer]);
      count += 1;
    }
  }

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  fs.writeFileSync(path.join(faqDir, 'faq.csv'), `${csv}\n`, 'utf8');
}

function writeQuestions() {
  const lines = ['# 答辩演示测试问题', ''];

  for (const category of categories) {
    lines.push(`## ${category.name}`, '');
    for (let i = 0; i < 5; i += 1) {
      const scenario = category.scenarios[i % category.scenarios.length];
      lines.push(`${i + 1}. 我最近${scenario}，可以怎么调整？`);
    }
    lines.push('');
  }

  lines.push('## 组合型问题', '');
  lines.push('1. 我考试前睡不好，还总担心自己考砸怎么办？');
  lines.push('2. 和室友关系紧张影响学习，我应该先处理哪一部分？');
  lines.push('3. 学习压力很大又不敢和别人说，如何开始求助？');
  lines.push('4. 我情绪低落很多天，怎么判断是否需要专业帮助？');
  lines.push('5. 如何用情绪日记观察自己的压力变化？');
  fs.writeFileSync(path.join(outDir, 'test_questions.md'), `${lines.join('\n')}\n`, 'utf8');
}

function writeSql(articles) {
  const selectedArticles = articles.slice(0, 72);
  const sqlLines = [];
  sqlLines.push('-- 心理健康 AI 助手平台答辩演示数据');
  sqlLines.push('-- 执行前请先导入 database/init.sql。');
  sqlLines.push('USE ai_psychological_assistant;');
  sqlLines.push('SET NAMES utf8mb4;');
  sqlLines.push('');
  sqlLines.push('-- 清理本脚本生成的演示数据，便于重复导入。');
  sqlLines.push('DELETE FROM psychological_chat_message WHERE id BETWEEN 6001 AND 7000;');
  sqlLines.push('DELETE FROM psychological_chat_session WHERE id BETWEEN 5001 AND 5100;');
  sqlLines.push('DELETE FROM emotion_diary WHERE id BETWEEN 7001 AND 7300;');
  sqlLines.push('DELETE FROM file_resource WHERE id BETWEEN 3001 AND 3100;');
  sqlLines.push('DELETE FROM knowledge_article WHERE id BETWEEN 1001 AND 1100;');
  sqlLines.push("DELETE FROM knowledge_category WHERE id BETWEEN 101 AND 109 OR code IN ('anxiety-regulation', 'stress-management', 'sleep-improvement', 'emotion-awareness', 'interpersonal-relationship', 'academic-pressure', 'self-acceptance', 'mindfulness', 'crisis-support');");
  sqlLines.push('DELETE FROM sys_user WHERE id BETWEEN 201 AND 220;');
  sqlLines.push('');

  sqlLines.push('INSERT INTO sys_user (id, username, password_hash, nickname, avatar_url, email, phone, role, status, created_at, updated_at, deleted) VALUES');
  const users = Array.from({ length: 12 }, (_, i) => {
    const id = 201 + i;
    const role = i === 0 ? 'admin' : 'user';
    return [id, `demo_user_${i + 1}`, 'demo123456', i === 0 ? '演示管理员' : `学生用户${i + 1}`, `/uploads/avatar/demo-${i + 1}.png`, `demo${i + 1}@example.com`, `1380000${String(i + 1).padStart(4, '0')}`, role, 1, '2026-06-01 09:00:00', '2026-06-13 09:00:00', 0];
  });
  sqlLines.push(`${users.map((row) => `(${row.map(sql).join(', ')})`).join(',\n')};`);
  sqlLines.push('');

  sqlLines.push('INSERT INTO knowledge_category (id, parent_id, name, code, description, sort_order, status, created_at, updated_at, deleted) VALUES');
  sqlLines.push(`${categories.map((category, index) => `(${[category.id, null, category.name, category.code, category.summary, (index + 1) * 10, 1, '2026-06-01 09:00:00', '2026-06-13 09:00:00', 0].map(sql).join(', ')})`).join(',\n')};`);
  sqlLines.push('');

  sqlLines.push('INSERT INTO knowledge_article (id, title, category_id, author_id, author_name, summary, content, cover_img, tags, status, read_count, published_at, created_at, updated_at, deleted) VALUES');
  sqlLines.push(`${selectedArticles.map((article, index) => {
    const content = article.content.replace(/^# .+\n/, '').slice(0, 1800);
    const status = index % 9 === 0 ? 0 : 1;
    const cover = `/uploads/covers/knowledge-${pad(index + 1)}.jpg`;
    const row = [article.id, article.title, article.categoryId, 201, '演示管理员', article.summary, content, cover, article.tags, status, 40 + index * 3, status ? '2026-06-05 10:00:00' : null, '2026-06-01 09:00:00', '2026-06-13 09:00:00', 0];
    return `(${row.map(sql).join(', ')})`;
  }).join(',\n')};`);
  sqlLines.push('');

  sqlLines.push('INSERT INTO file_resource (id, original_name, stored_name, file_path, file_url, mime_type, file_size, business_type, business_id, business_field, uploader_id, created_at, updated_at, deleted) VALUES');
  sqlLines.push(`${selectedArticles.slice(0, 36).map((article, index) => {
    const file = `knowledge-${pad(index + 1)}.jpg`;
    const row = [3001 + index, file, file, `/www/wwwroot/uploads/covers/${file}`, `/uploads/covers/${file}`, 'image/jpeg', 102400 + index * 2048, 'knowledge_article', article.id, 'cover_img', 201, '2026-06-01 09:00:00', '2026-06-13 09:00:00', 0];
    return `(${row.map(sql).join(', ')})`;
  }).join(',\n')};`);
  sqlLines.push('');

  sqlLines.push('INSERT INTO psychological_chat_session (id, user_id, user_nickname, session_title, last_message_content, message_count, started_at, last_message_time, status, created_at, updated_at, deleted) VALUES');
  const sessions = Array.from({ length: 50 }, (_, i) => {
    const userId = 202 + (i % 11);
    const category = categories[i % categories.length];
    return [5001 + i, userId, `学生用户${(i % 11) + 2}`, `${category.name}咨询会话${i + 1}`, `建议先尝试${category.methods[i % category.methods.length]}，并记录状态变化。`, 4, `2026-06-${String((i % 12) + 1).padStart(2, '0')} 20:00:00`, `2026-06-${String((i % 12) + 1).padStart(2, '0')} 20:12:00`, 1, '2026-06-01 09:00:00', '2026-06-13 09:00:00', 0];
  });
  sqlLines.push(`${sessions.map((row) => `(${row.map(sql).join(', ')})`).join(',\n')};`);
  sqlLines.push('');

  sqlLines.push('INSERT INTO psychological_chat_message (id, session_id, sender_type, content, model_name, prompt_tokens, completion_tokens, created_at, deleted) VALUES');
  const messages = [];
  for (let i = 0; i < 50; i += 1) {
    const category = categories[i % categories.length];
    const sessionId = 5001 + i;
    const scenario = category.scenarios[i % category.scenarios.length];
    const method = category.methods[i % category.methods.length];
    messages.push([6001 + i * 4, sessionId, 1, `我最近${scenario}，感觉影响学习和生活。`, null, 0, 0, `2026-06-${String((i % 12) + 1).padStart(2, '0')} 20:00:00`, 0]);
    messages.push([6002 + i * 4, sessionId, 2, `可以先记录触发事件和身体反应，再尝试${method}。`, 'MaxKB-demo', 60, 120, `2026-06-${String((i % 12) + 1).padStart(2, '0')} 20:03:00`, 0]);
    messages.push([6003 + i * 4, sessionId, 1, '如果今天还是很难受，我应该做什么？', null, 0, 0, `2026-06-${String((i % 12) + 1).padStart(2, '0')} 20:08:00`, 0]);
    messages.push([6004 + i * 4, sessionId, 2, '建议把目标缩小到一个十分钟内能完成的行动，同时联系可信任的人。如果出现自伤想法或明显失控，请立即寻求专业帮助。', 'MaxKB-demo', 80, 160, `2026-06-${String((i % 12) + 1).padStart(2, '0')} 20:12:00`, 0]);
  }
  sqlLines.push(`${messages.map((row) => `(${row.map(sql).join(', ')})`).join(',\n')};`);
  sqlLines.push('');

  sqlLines.push('INSERT INTO emotion_diary (id, user_id, username, nickname, diary_date, mood_score, dominant_emotion, sleep_quality, stress_level, emotion_triggers, diary_content, ai_emotion_analysis, created_at, updated_at, deleted) VALUES');
  const emotions = ['焦虑', '压力', '低落', '平静', '烦躁', '疲惫', '期待', '困惑'];
  const diaryRows = Array.from({ length: 180 }, (_, i) => {
    const userIndex = i % 11;
    const category = categories[i % categories.length];
    const emotion = emotions[i % emotions.length];
    const day = String((i % 28) + 1).padStart(2, '0');
    const score = 2 + (i % 4);
    const analysis = JSON.stringify({
      summary: `当前主要情绪为${emotion}，触发因素与${category.scenarios[i % category.scenarios.length]}有关。`,
      suggestion: `建议关注${category.name}主题，可尝试${category.methods[i % category.methods.length]}，并持续观察情绪变化。`,
      riskLevel: score <= 2 ? 'medium' : 'low',
    });
    return [7001 + i, 202 + userIndex, `demo_user_${userIndex + 2}`, `学生用户${userIndex + 2}`, `2026-05-${day}`, score, emotion, 2 + (i % 4), 1 + (i % 5), category.scenarios[i % category.scenarios.length], `今天主要感受到${emotion}，和${category.scenarios[i % category.scenarios.length]}有关。尝试记录后，发现自己需要更清晰的计划和休息。`, analysis, '2026-06-01 09:00:00', '2026-06-13 09:00:00', 0];
  });
  sqlLines.push(`${diaryRows.map((row) => `(${row.map(sql).join(', ')})`).join(',\n')};`);
  sqlLines.push('');
  sqlLines.push('-- 演示数据导入完成。');

  fs.writeFileSync(path.join(sqlDir, 'demo_data.sql'), `${sqlLines.join('\n')}\n`, 'utf8');
}

function writeReadme() {
  const readme = `# 心理健康 AI 助手平台演示数据

本目录用于答辩演示和系统功能测试，数据为结构化模拟心理健康科普资料，非商业用途，不作为专业心理咨询、诊断或治疗依据。

## 目录说明

- \`maxkb_docs/\`：120 篇 Markdown 知识文档，可按目录导入 MaxKB。
- \`faq/faq.csv\`：150 条常见问答，可导入 MaxKB 增强命中率。
- \`sql/demo_data.sql\`：MySQL 演示数据，执行前请先导入项目的 \`database/init.sql\`。
- \`test_questions.md\`：答辩现场可使用的测试问题清单。

## 建议导入顺序

1. 在 MaxKB 中创建知识库。
2. 导入 \`maxkb_docs/\` 下的 Markdown 文档。
3. 导入 \`faq/faq.csv\` 或将 FAQ 转为问答型文档。
4. 在 MySQL 中执行 \`sql/demo_data.sql\`。
5. 使用 \`test_questions.md\` 进行问答演示。

## 答辩说明话术

本系统演示数据采用结构化模拟心理健康科普资料，覆盖焦虑调节、压力管理、睡眠改善、人际关系、学业压力等学生常见心理场景。当前数据用于系统功能测试和答辩演示，后续部署到正式环境时，可替换为学校心理中心审核后的正式知识库内容。
`;
  fs.writeFileSync(path.join(outDir, 'README.md'), readme, 'utf8');
}

cleanDir(outDir);
ensureDir(docsDir);
ensureDir(faqDir);
ensureDir(sqlDir);

const articles = writeMaxKbDocs();
writeFaq();
writeQuestions();
writeSql(articles);
writeReadme();

console.log(`Generated ${articles.length} MaxKB markdown documents.`);
console.log('Generated 150 FAQ rows.');
console.log('Generated MySQL demo SQL and test questions.');
