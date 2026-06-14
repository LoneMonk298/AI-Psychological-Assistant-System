<template>
  <div class="articleDetail-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconUrl" style="width: 60px; height: 60px"></el-image>
        <h1>知识文章详情</h1>
      </div>
    </div>
    <div class="content">
      <div class="diary-card">
        <p class="title">文章信息</p>
        <div class="sub-title">
          <el-tag size="large" class="category-tag">{{ articleDetail.categoryName }}</el-tag>
          <div class="flex-box">
            <el-icon><List /></el-icon>
            <span>{{ dayjs(articleDetail.updatedAt).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
        <h1 class="article-title">{{ articleDetail.title }}</h1>
        <div class="summary-content" v-if="articleDetail.summary">
          <p>{{ articleDetail.summary }}</p>
        </div>
        <div class="info-row">
          <div class="flex-box item">
            <el-icon><Avatar /></el-icon>
            <span>{{ articleDetail.authorName }}</span>
          </div>
          <div class="flex-box item">
            <el-icon><Platform /></el-icon>
            <span>{{ articleDetail.readCount }} 次阅读</span>
          </div>
        </div>
      </div>
      <div class="diary-card">
        <div class="title">正文内容</div>
        <div class="content-wrapper" v-html="formatContent(articleDetail.content)"></div>
        <div class="tags-content" v-if="articleDetail.tags">
          <h4 class="tags-title">相关标签</h4>
          <div class="tags-list">
            <el-tag v-for="tag in articleDetail.tags.split(',')" :key="tag" type="info" effect="light">{{ tag.trim() }}</el-tag>
          </div>
        </div>
      </div>
      <div class="diary-card">
        <el-button type="primary" @click="goBack">返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getKnowledgeDetail } from '@/api/frontend'
import { dayjs } from 'element-plus'
import { List, Avatar, Platform } from '@element-plus/icons-vue'

const iconUrl = new URL('@/assets/images/book.png', import.meta.url).href

const route = useRoute()
const router = useRouter()

const articleDetail = ref({})

const formatContent = (content) => {
  if (!content) return ''
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

const goBack = () => {
  router.push('/customer/knowledge')
}

onMounted(() => {
  const articleId = route.params.id
  console.log('文章ID:', articleId)
  if (!articleId) {
    console.error('文章ID不存在')
    return
  }
  getKnowledgeDetail(articleId).then(res => {
    console.log('API响应:', res)
    if (res && res.data) {
      articleDetail.value = res.data
    } else if (res) {
      articleDetail.value = res
    }
  }).catch(err => {
    console.error('获取文章详情失败:', err)
  })
})
</script>

<style lang="scss" scoped>
.articleDetail-container {
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
  min-height: 100vh;

  .flex-box {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .header-section {
    background: linear-gradient(135deg, #f59e8b 0%, #8b5cf6 100%);
    color: white;
    padding: 48px;

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  .content {
    max-width: 980px;
    margin: 0 auto;
    padding: 20px;

    .diary-card {
      margin-bottom: 20px;
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

      .title {
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: 600;
        color: #374151;
      }

      .sub-title {
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 15px;

        .category-tag {
          margin-right: 10px;
        }
      }

      .article-title {
        font-size: 28px;
        font-weight: bold;
        color: #111827;
        margin-top: 30px;
        margin-bottom: 10px;
      }

      .summary-content {
        background: rgba(126, 211, 33, 0.1);
        border-left: 4px solid #7ED321;
        padding: 10px 15px;
        border-radius: 0 8px 8px 0;
        margin-top: 15px;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 20px;

        .item {
          color: #666;
        }
      }

      .content-wrapper {
        font-size: 15px;
        color: #374151;
        line-height: 1.8;

        :deep(p) {
          margin-bottom: 10px;
        }

        :deep(h1),
        :deep(h2),
        :deep(h3),
        :deep(h4),
        :deep(h5),
        :deep(h6) {
          margin: 15px 0 10px;
          color: #111827;
          font-weight: 600;
        }

        :deep(h2) {
          font-size: 18px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
        }

        :deep(h3) {
          font-size: 16px;
        }

        :deep(ul),
        :deep(ol) {
          padding-left: 15px;
          margin-bottom: 10px;
        }

        :deep(li) {
          margin-bottom: 5px;
        }
      }

      .tags-content {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #e5e7eb;

        .tags-title {
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
      }
    }
  }
}
</style>