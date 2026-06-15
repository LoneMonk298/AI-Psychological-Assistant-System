<template>
  <div class="customer-home">
    <section class="welcome-panel">
      <div class="welcome-copy">
        <el-tag effect="plain" class="soft-tag">今日陪伴</el-tag>
        <h1>{{ greeting }}，{{ displayName }}</h1>
        <p>从一次记录、一次阅读或一次对话开始，把今天的心理状态整理清楚。</p>
        <div class="welcome-actions">
          <el-button type="primary" class="brand-button" :icon="ChatDotRound" @click="go('/customer/chat')">
            开始 AI 咨询
          </el-button>
          <el-button :icon="Notebook" @click="go('/customer/emotionDiary')">记录情绪</el-button>
        </div>
      </div>
      <div class="mascot-card">
        <BrandMascot />
      </div>
    </section>

    <section class="quick-grid">
      <el-card v-for="item in quickActions" :key="item.title" class="quick-card" shadow="hover" @click="go(item.path)">
        <div class="quick-icon">
          <el-icon><component :is="item.icon" /></el-icon>
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </el-card>
    </section>

    <section class="insight-grid">
      <el-card class="insight-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>今日建议</span>
            <el-tag type="success" effect="light">轻量完成</el-tag>
          </div>
        </template>
        <div class="suggestion-list">
          <div v-for="item in suggestions" :key="item" class="suggestion-item">{{ item }}</div>
        </div>
      </el-card>

      <el-card class="insight-card timeline-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>推荐流程</span>
          </div>
        </template>
        <el-steps direction="vertical" :active="1">
          <el-step title="浏览一篇知识文章" description="先获得一点可执行的心理健康知识" />
          <el-step title="记录今日情绪" description="写下触发因素、睡眠质量和压力水平" />
          <el-step title="需要时开启 AI 咨询" description="通过 MaxKB 进行即时问答和自我梳理" />
        </el-steps>
      </el-card>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChatDotRound,
  Notebook,
  Reading,
  TrendCharts,
} from '@element-plus/icons-vue'
import BrandMascot from '@/components/BrandMascot.vue'

const router = useRouter()

const userInfo = computed(() => {
  try {
    const raw = localStorage.getItem('userInfo')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
})

const displayName = computed(() => userInfo.value.nickname || userInfo.value.username || '朋友')
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const quickActions = [
  {
    title: 'AI 咨询',
    desc: '进入 MaxKB 对话，整理当下的问题和感受。',
    path: '/customer/chat',
    icon: ChatDotRound,
  },
  {
    title: '心理知识库',
    desc: '阅读心理科普文章，找到可实践的小方法。',
    path: '/customer/knowledge',
    icon: Reading,
  },
  {
    title: '情绪日志',
    desc: '记录心情、睡眠、压力和事件触发因素。',
    path: '/customer/emotionDiary',
    icon: Notebook,
  },
  {
    title: '趋势观察',
    desc: '通过持续记录，为后续分析和咨询提供依据。',
    path: '/customer/emotionDiary',
    icon: TrendCharts,
  },
]

const suggestions = [
  '用 1 分钟给今天的情绪打个分。',
  '选择一个主要情绪，不需要解释得很完美。',
  '如果情绪很强烈，先写下触发它的事情。',
]

const go = (path) => {
  router.push(path)
}
</script>

<style scoped>
.customer-home {
  --brand-primary: #8a68d6;
  --brand-deep: #30284f;
  --brand-accent: #ee9fc9;
  --brand-soft: #fff2f8;
  --text-soft: #69627b;

  max-width: 1160px;
  margin: 0 auto;
  padding: 34px 24px 62px;
}

.welcome-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: 28px;
  align-items: center;
  margin-bottom: 24px;
  padding: 34px;
  border-radius: 8px;
  background:
    radial-gradient(circle at 82% 16%, rgba(238, 159, 201, 0.22), transparent 28%),
    linear-gradient(135deg, #fff, #fbf4ff);
  box-shadow: 0 22px 55px rgba(85, 74, 110, 0.12);
}

.soft-tag {
  margin-bottom: 18px;
  border-color: rgba(138, 104, 214, 0.2);
  background: var(--brand-soft);
  color: var(--brand-primary);
}

.welcome-copy h1 {
  margin-bottom: 14px;
  color: var(--brand-deep);
  font-size: 38px;
}

.welcome-copy p {
  max-width: 620px;
  color: var(--text-soft);
  font-size: 16px;
  line-height: 1.8;
}

.welcome-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.brand-button {
  border: 0;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
}

.mascot-card {
  display: grid;
  place-items: center;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.quick-card {
  min-height: 200px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.quick-card :deep(.el-card__body) {
  display: grid;
  gap: 12px;
  height: 100%;
}

.quick-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 8px;
  background: var(--brand-soft);
  color: var(--brand-primary);
  font-size: 24px;
}

.quick-card h3 {
  color: var(--brand-deep);
  font-size: 18px;
}

.quick-card p,
.suggestion-item,
.timeline-card :deep(.el-step__description) {
  color: var(--text-soft);
  line-height: 1.7;
}

.insight-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
}

.insight-card {
  border: 0;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--brand-deep);
  font-weight: 800;
}

.suggestion-list {
  display: grid;
  gap: 12px;
}

.suggestion-item {
  padding: 14px 16px;
  border-radius: 8px;
  background: #fff7fb;
}

@media (max-width: 920px) {
  .welcome-panel,
  .insight-grid {
    grid-template-columns: 1fr;
  }

  .quick-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .customer-home {
    padding: 22px 16px 44px;
  }

  .welcome-panel {
    padding: 24px;
  }

  .welcome-copy h1 {
    font-size: 30px;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>
