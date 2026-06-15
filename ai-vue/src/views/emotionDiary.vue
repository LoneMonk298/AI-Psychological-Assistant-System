<template>
  <div class="emotion-page">
    <section class="page-hero">
      <div>
        <el-tag class="soft-tag" effect="plain">情绪日志</el-tag>
        <h1>给今天的感受一个安放的位置</h1>
        <p>无需写得完美，只要把情绪、触发因素和生活状态记录下来，就是一次有效整理。</p>
      </div>
      <img src="@/assets/images/like.png" alt="情绪日志" />
    </section>

    <section class="diary-layout">
      <el-card class="diary-card score-card" shadow="never">
        <template #header>
          <div class="card-title">
            <span>今日情绪评分</span>
            <small>{{ diaryForm.diaryDate }}</small>
          </div>
        </template>
        <p>你的整体情绪状态如何？选择 1 到 10 分即可。</p>
        <el-rate v-model="diaryForm.moodScore" :texts="emotionStatus" show-text :max="10" size="large" />
      </el-card>

      <el-card class="diary-card" shadow="never">
        <template #header>
          <div class="card-title">
            <span>主要情绪</span>
            <small>选择最接近的一项</small>
          </div>
        </template>
        <div class="emotion-grid">
          <button
            v-for="emotion in emotionOptions"
            :key="emotion.name"
            class="emotion-card"
            :class="{ selected: emotion.name === diaryForm.dominantEmotion }"
            type="button"
            @click="selectEmotion(emotion.name)"
          >
            <img :src="emotion.url" :alt="emotion.name" />
            <span>{{ emotion.name }}</span>
          </button>
        </div>
      </el-card>

      <el-card class="diary-card form-card" shadow="never">
        <template #header>
          <div class="card-title">
            <span>详细记录</span>
            <small>帮助之后回看和分析</small>
          </div>
        </template>

        <div class="form-grid">
          <label class="field full">
            <span>情绪触发因素</span>
            <el-input
              v-model="diaryForm.emotionTriggers"
              type="textarea"
              placeholder="今天什么事情影响了你的情绪？"
              :rows="3"
              maxlength="1000"
              show-word-limit
            />
          </label>

          <label class="field full">
            <span>今日感想</span>
            <el-input
              v-model="diaryForm.diaryContent"
              type="textarea"
              placeholder="写下你的想法、感受或发生的有趣事情。"
              :rows="5"
              maxlength="2000"
              show-word-limit
            />
          </label>

          <label class="field">
            <span>睡眠质量</span>
            <el-select v-model="diaryForm.sleepQuality" placeholder="请选择">
              <el-option label="很好" :value="5" />
              <el-option label="较好" :value="4" />
              <el-option label="一般" :value="3" />
              <el-option label="较差" :value="2" />
              <el-option label="很差" :value="1" />
            </el-select>
          </label>

          <label class="field">
            <span>压力水平</span>
            <el-select v-model="diaryForm.stressLevel" placeholder="请选择">
              <el-option label="很高" :value="5" />
              <el-option label="较高" :value="4" />
              <el-option label="一般" :value="3" />
              <el-option label="较低" :value="2" />
              <el-option label="很低" :value="1" />
            </el-select>
          </label>
        </div>

        <div class="action-buttons">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" class="brand-button" :loading="submitting" @click="submit">
            提交记录
          </el-button>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { addEmotionDiary } from '@/api/frontend'

const emotionStatus = [
  '很低落',
  '低落',
  '焦虑',
  '不安',
  '平静',
  '轻松',
  '愉快',
  '满足',
  '兴奋',
  '非常好',
]

const emotionOptions = [
  { name: '开心', url: new URL('@/assets/images/开心.png', import.meta.url).href },
  { name: '平静', url: new URL('@/assets/images/平静.png', import.meta.url).href },
  { name: '焦虑', url: new URL('@/assets/images/焦虑.png', import.meta.url).href },
  { name: '悲伤', url: new URL('@/assets/images/悲伤.png', import.meta.url).href },
  { name: '兴奋', url: new URL('@/assets/images/兴奋.png', import.meta.url).href },
  { name: '疲惫', url: new URL('@/assets/images/疲惫.png', import.meta.url).href },
  { name: '惊讶', url: new URL('@/assets/images/惊讶.png', import.meta.url).href },
  { name: '困惑', url: new URL('@/assets/images/困惑.png', import.meta.url).href },
]

const submitting = ref(false)

const diaryForm = reactive({
  diaryDate: dayjs().format('YYYY-MM-DD'),
  moodScore: null,
  dominantEmotion: '',
  emotionTriggers: '',
  diaryContent: '',
  sleepQuality: null,
  stressLevel: null,
})

const selectEmotion = (emotion) => {
  diaryForm.dominantEmotion = emotion
}

const resetForm = () => {
  Object.assign(diaryForm, {
    diaryDate: dayjs().format('YYYY-MM-DD'),
    moodScore: null,
    dominantEmotion: '',
    emotionTriggers: '',
    diaryContent: '',
    sleepQuality: null,
    stressLevel: null,
  })
}

const submit = () => {
  if (!diaryForm.moodScore || !diaryForm.dominantEmotion) {
    ElMessage.error('请选择情绪评分和主要情绪')
    return
  }

  submitting.value = true
  addEmotionDiary(diaryForm)
    .then(() => {
      ElMessage.success('情绪日志提交成功')
      resetForm()
    })
    .catch((error) => {
      console.error('提交情绪日志失败：', error)
      ElMessage.error('提交失败，请稍后再试')
    })
    .finally(() => {
      submitting.value = false
    })
}
</script>

<style scoped>
.emotion-page {
  --brand-primary: #8a68d6;
  --brand-deep: #30284f;
  --brand-accent: #ee9fc9;
  --brand-soft: #fff2f8;
  --text-soft: #69627b;

  max-width: 980px;
  margin: 0 auto;
  padding: 34px 24px 64px;
}

.page-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
  padding: 34px;
  border-radius: 8px;
  background:
    radial-gradient(circle at 84% 24%, rgba(238, 159, 201, 0.22), transparent 28%),
    linear-gradient(135deg, #fff, #fbf4ff);
  box-shadow: 0 22px 55px rgba(85, 74, 110, 0.12);
}

.page-hero img {
  width: 104px;
  height: 104px;
}

.soft-tag {
  margin-bottom: 16px;
  border-color: rgba(138, 104, 214, 0.2);
  background: var(--brand-soft);
  color: var(--brand-primary);
}

.page-hero h1 {
  margin-bottom: 10px;
  color: var(--brand-deep);
  font-size: 34px;
}

.page-hero p,
.score-card p {
  color: var(--text-soft);
  line-height: 1.8;
}

.diary-layout {
  display: grid;
  gap: 18px;
}

.diary-card {
  border: 0;
  border-radius: 8px;
  box-shadow: 0 18px 45px rgba(85, 74, 110, 0.1);
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--brand-deep);
  font-weight: 850;
}

.card-title small {
  color: var(--text-soft);
  font-weight: 500;
}

.score-card :deep(.el-rate) {
  margin-top: 18px;
}

.emotion-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.emotion-card {
  display: grid;
  gap: 10px;
  place-items: center;
  padding: 16px 10px;
  border: 2px solid #f0edf7;
  border-radius: 8px;
  background: #fff;
  color: var(--brand-deep);
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.emotion-card:hover,
.emotion-card.selected {
  transform: translateY(-3px);
  border-color: var(--brand-primary);
  background: var(--brand-soft);
}

.emotion-card img {
  width: 52px;
  height: 52px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.field {
  display: grid;
  gap: 8px;
  color: var(--brand-deep);
  font-weight: 700;
}

.field.full {
  grid-column: 1 / -1;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.brand-button {
  border: 0;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
}

@media (max-width: 720px) {
  .emotion-page {
    padding: 22px 16px 44px;
  }

  .page-hero {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
  }

  .page-hero h1 {
    font-size: 28px;
  }

  .emotion-grid,
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .emotion-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
