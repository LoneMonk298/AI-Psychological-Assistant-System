USE ai_psychological_assistant;

ALTER TABLE sys_user
  ADD COLUMN age INT NULL COMMENT 'Age' AFTER phone,
  ADD COLUMN gender VARCHAR(16) NULL COMMENT 'Gender: male/female/unknown' AFTER age;

UPDATE knowledge_category SET name = '情绪管理', code = 'emotion-management' WHERE id = 1;
UPDATE knowledge_category SET name = '压力缓解', code = 'stress-relief' WHERE id = 2;
UPDATE knowledge_category SET name = '人际关系', code = 'relationship' WHERE id = 3;
UPDATE knowledge_category SET name = '焦虑', code = 'anxiety' WHERE id = 4;
UPDATE knowledge_category SET name = '睡眠', code = 'sleep' WHERE id = 5;

UPDATE file_resource
SET file_url = CONCAT('/api', file_path)
WHERE file_path IS NOT NULL
  AND (file_url IS NULL OR file_url LIKE 'http://159.75.169.224:%');

UPDATE emotion_diary
SET ai_emotion_analysis = JSON_OBJECT(
  'mainEmotion', COALESCE(dominant_emotion, '平静'),
  'primaryEmotion', COALESCE(dominant_emotion, '平静'),
  'intensity', LEAST(100, GREATEST(10, mood_score * 10)),
  'emotionScore', LEAST(100, GREATEST(10, mood_score * 10)),
  'riskLevel', CASE
    WHEN mood_score <= 3 OR stress_level >= 5 THEN '高'
    WHEN mood_score <= 5 OR stress_level >= 4 THEN '中'
    ELSE '低'
  END,
  'sentiment', CASE WHEN mood_score <= 4 OR stress_level >= 4 THEN 'negative' ELSE 'positive' END,
  'isNegative', CASE WHEN mood_score <= 4 OR stress_level >= 4 THEN true ELSE false END,
  'analysisResult', '根据情绪评分、压力水平和主要情绪生成的规则分析。',
  'suggestion', CASE
    WHEN mood_score <= 4 OR stress_level >= 4 THEN '建议先降低任务压力，保持规律作息，并在情绪持续低落时寻求支持。'
    ELSE '当前状态较稳定，可以继续保持记录和复盘。'
  END,
  'riskDescription', '规则分析结果，仅用于联调展示。',
  'improvementSuggestions', JSON_ARRAY('记录触发情绪的具体事件', '安排短时间放松练习', '必要时寻求支持')
)
WHERE ai_emotion_analysis IS NULL;

UPDATE sys_user
SET role = 'SUPER_ADMIN'
WHERE username = 'admin'
  AND role = 'ADMIN'
  AND deleted = 0;
