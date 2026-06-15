<template>
  <div :class="['knowledge-shell', { 'is-public': isPublicKnowledge }]">
    <header v-if="isPublicKnowledge" class="public-header">
      <button class="public-brand" type="button" @click="go('/')">
        <img src="@/assets/logo.svg" alt="心理健康AI助手" />
        <span>心理健康AI助手</span>
      </button>
      <nav class="public-nav" aria-label="公共知识库导航">
        <el-button text :icon="House" @click="go('/')">主页</el-button>
        <el-button text class="active" :icon="Reading">知识库</el-button>
        <el-button type="primary" class="brand-button" :icon="User" @click="go('/auth/login')">登录</el-button>
      </nav>
    </header>

    <div class="knowledge-page">
    <section class="page-hero">
      <el-tag class="soft-tag" effect="plain">知识库</el-tag>
      <h1>把心理知识变成每天能用的小方法</h1>
      <p>阅读精选心理健康文章，了解情绪、压力、睡眠和人际关系中的常见问题。</p>
    </section>

    <section class="filter-bar">
      <div class="filter-item">
        <span>文章标题</span>
        <el-input
          v-model="filters.title"
          clearable
          placeholder="请输入文章标题"
          :prefix-icon="Search"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        />
      </div>
      <div class="filter-item">
        <span>文章类型</span>
        <el-select
          v-model="filters.categoryId"
          clearable
          filterable
          placeholder="请选择文章类型"
          :loading="loadingCategories"
          @change="handleSearch"
          @clear="handleSearch"
        >
          <el-option
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="filter-actions">
        <el-button type="primary" class="brand-button" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="RefreshRight" @click="resetFilters">重置</el-button>
      </div>
    </section>

    <section class="featured-layout">
      <el-carousel
        v-if="featuredArticles.length"
        class="featured-carousel"
        height="420px"
        trigger="click"
        arrow="always"
        indicator-position="outside"
        :autoplay="true"
        :loop="true"
        :interval="4200"
      >
        <el-carousel-item v-for="item in featuredArticles" :key="item.id">
          <article class="featured-card" @click="goToArticle(item.id)">
            <img
              :src="getImage(item)"
              :alt="item.title"
              @error="handleImageError"
            />
            <div class="featured-overlay">
              <el-tag effect="dark" class="mint-tag">推荐</el-tag>
              <h2>{{ item.title }}</h2>
              <div class="featured-meta">
                <span><el-icon><List /></el-icon>{{ formatDate(item.updatedAt || item.publishedAt) }}</span>
                <span><el-icon><Avatar /></el-icon>{{ item.authorName || '心理健康AI助手' }}</span>
              </div>
            </div>
          </article>
        </el-carousel-item>
      </el-carousel>

      <aside class="rank-panel">
        <div class="rank-tabs">
          <button
            v-for="tab in rankTabs"
            :key="tab.key"
            class="rank-tab-button"
            type="button"
            :class="{ active: activeRank === tab.key }"
            @click="setActiveRank(tab.key)"
          >
            {{ tab.label }}
          </button>
          <button type="button" class="active">最近</button>
          <button type="button">热门</button>
          <button type="button">推荐</button>
        </div>
        <el-skeleton v-if="loadingRecommend" :rows="4" animated />
        <div v-else class="rank-list">
          <button
            v-for="item in recommendList.slice(0, 4)"
            :key="item.id"
            type="button"
            @click="goToArticle(item.id)"
          >
            <img
              :src="getImage(item)"
              :alt="item.title"
              @error="handleImageError"
            />
            <span>{{ item.title }}</span>
          </button>
        </div>
      </aside>
    </section>

    <section class="article-section">
      <div class="article-head">
        <div>
          <h2>全部知识文章</h2>
          <p>{{ filters.title || filters.categoryId ? '以下为筛选后的文章内容' : '持续更新心理健康科普内容' }}</p>
        </div>
        <el-tag type="success" effect="light">{{ pagination.total }} 篇</el-tag>
      </div>

      <el-skeleton v-if="loadingArticles" :rows="10" animated />
      <div v-else class="article-grid">
        <article
          v-for="item in articleList"
          :key="item.id"
          class="article-card"
          @click="goToArticle(item.id)"
        >
          <img
            :src="getImage(item)"
            :alt="item.title"
            @error="handleImageError"
          />
          <div class="article-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary || '这篇文章提供了一个心理健康主题下的实用理解角度。' }}</p>
            <div class="meta-row">
              <span><el-icon><List /></el-icon>{{ formatDate(item.updatedAt || item.publishedAt) }}</span>
              <span><el-icon><Avatar /></el-icon>{{ item.authorName || '心理健康AI助手' }}</span>
            </div>
          </div>
        </article>

        <el-empty v-if="!articleList.length" description="暂无文章" />
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          background
          layout="total, prev, pager, next, jumper"
          :pager-count="7"
          :total="pagination.total"
          :page-size="pagination.size"
          :hide-on-single-page="false"
          @current-change="handleChange"
        />
      </div>
    </section>
    </div>

    <footer v-if="isPublicKnowledge" class="public-footer">
      <div class="footer-shell">
        <div class="footer-brand">
          <strong>心理健康AI助手</strong>
          <p>Vue3 / Element Plus / Spring Boot / MaxKB 课程项目展示。</p>
        </div>
        <div class="footer-meta">
          <span>© 2026 AI Psychological Assistant System</span>
          <button type="button" @click="go('/')">返回主页</button>
          <button type="button" @click="go('/auth/login')">登录系统</button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { dayjs } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  Avatar,
  House,
  List,
  Reading,
  RefreshRight,
  Search,
  User,
} from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { getKnowledgeCategoryTree, getKnowledgeList } from '@/api/frontend'
import defaultArticleImage from '@/assets/images/default.png'
import { resolveArticleCoverUrl } from '@/utils/fileUrl'

const router = useRouter()
const route = useRoute()
const recommendList = ref([])
const articleList = ref([])
const categories = ref([])
const loadingArticles = ref(false)
const loadingRecommend = ref(false)
const loadingCategories = ref(false)
const activeRank = ref('recent')

const rankTabs = [
  { key: 'recent', label: '最近' },
  { key: 'hot', label: '热门' },
  { key: 'recommend', label: '推荐' },
]

const filters = reactive({
  title: '',
  categoryId: '',
})

const pagination = reactive({
  currentPage: 1,
  size: 6,
  total: 0,
  pages: 0,
})

const featuredArticles = computed(() => {
  const source = recommendList.value.length ? recommendList.value : articleList.value
  return source.slice(0, 5)
})

const isPublicKnowledge = computed(() => route.path.startsWith('/knowledge'))

const go = (path) => {
  router.push(path)
}

const getCategoryDisplayName = (item = {}) => {
  const rawName = item.categoryName || item.name || item.label || ''
  if (!rawName || !/[\u4e00-\u9fff]/.test(rawName)) return ''
  return rawName.replace(/[A-Za-z][A-Za-z\s_-]*/g, '').trim()
}

const flattenCategories = (tree = [], level = 0) => {
  return tree.flatMap((item) => {
    const id = item.id
    const children = item.children || item.childList || []
    const childOptions = flattenCategories(children, level + 1)
    const name = getCategoryDisplayName(item)

    if (!name) {
      return childOptions
    }

    return [{
      label: `${'　'.repeat(level)}${name}`,
      value: id,
    }, ...childOptions]
  })
}

const getImage = (item) => {
  return resolveArticleCoverUrl(item)
}

const handleImageError = (event) => {
  event.target.src = defaultArticleImage
}

const formatDate = (date) => {
  return date ? dayjs(date).format('YYYY-MM-DD') : '未发布'
}

const cleanParams = (params) => {
  Object.keys(params).forEach((key) => {
    if (params[key] === '' || params[key] === null || params[key] === undefined) {
      delete params[key]
    }
  })
  return params
}

const getPageList = async () => {
  loadingArticles.value = true
  try {
    const res = await getKnowledgeList(cleanParams({
      currentPage: pagination.currentPage,
      size: pagination.size,
      sortField: 'publishedAt',
      sortDirection: 'desc',
      title: filters.title.trim(),
      categoryId: filters.categoryId,
    }))
    const data = res?.data || res || {}
    const records = Array.isArray(data.records) ? data.records : (Array.isArray(data) ? data : [])
    articleList.value = records
    pagination.total = Number(data.total ?? data.totalCount ?? data.count ?? records.length)
    pagination.size = Number(data.size ?? pagination.size)
    pagination.currentPage = Number(data.current ?? data.currentPage ?? pagination.currentPage)
    pagination.pages = Number(data.pages ?? Math.ceil(pagination.total / pagination.size))
  } finally {
    loadingArticles.value = false
  }
}

const getRecommendList = async () => {
  loadingRecommend.value = true
  try {
    const sortMap = {
      recent: 'publishedAt',
      hot: 'readCount',
      recommend: 'readCount',
    }
    const res = await getKnowledgeList(cleanParams({
      sortField: sortMap[activeRank.value] || 'publishedAt',
      sortDirection: 'desc',
      currentPage: 1,
      size: 6,
      recommended: activeRank.value === 'recommend' ? true : undefined,
    }))
    const data = res?.data || res || {}
    recommendList.value = Array.isArray(data.records) ? data.records : []
  } finally {
    loadingRecommend.value = false
  }
}

const setActiveRank = (key) => {
  activeRank.value = key
  getRecommendList()
}

const getCategories = async () => {
  loadingCategories.value = true
  try {
    const res = await getKnowledgeCategoryTree()
    const data = res?.data || res || []
    categories.value = flattenCategories(Array.isArray(data) ? data : [])
  } finally {
    loadingCategories.value = false
  }
}

const handleSearch = () => {
  pagination.currentPage = 1
  getPageList()
}

const resetFilters = () => {
  filters.title = ''
  filters.categoryId = ''
  handleSearch()
}

const handleChange = (page) => {
  pagination.currentPage = page
  getPageList()
}

const goToArticle = (id) => {
  const prefix = route.path.startsWith('/knowledge') ? '/knowledge' : '/customer/knowledge'
  router.push(`${prefix}/article/${id}`)
}

onMounted(() => {
  getCategories()
  getPageList()
  getRecommendList()
})
</script>

<style scoped>
.knowledge-shell {
  --brand-primary: #37c993;
  --brand-primary-dark: #16986a;
  --brand-ink: #17212d;
  --brand-deep: #263445;
  --brand-muted: #667482;
  --brand-soft: #eafbf4;
  min-height: 100vh;
}

.knowledge-shell.is-public {
  background:
    radial-gradient(circle at 14% 0%, rgba(100, 237, 172, 0.18), transparent 32%),
    radial-gradient(circle at 88% 8%, rgba(138, 104, 214, 0.12), transparent 30%),
    linear-gradient(180deg, #f7fffb 0%, #f5f8fb 62%, #ffffff 100%);
}

.public-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 76px;
  padding: 0 32px;
  border-bottom: 1px solid rgba(38, 52, 69, 0.08);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
}

.public-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: max-content;
  border: 0;
  background: transparent;
  color: var(--brand-ink);
  cursor: pointer;
  font-size: 17px;
  font-weight: 850;
}

.public-brand img {
  width: 38px;
  height: 38px;
}

.public-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.public-nav :deep(.el-button) {
  font-weight: 800;
}

.public-nav :deep(.el-button.active) {
  color: var(--brand-primary-dark);
  background: var(--brand-soft);
}

.public-footer {
  background: #26213e;
  color: #ded7f6;
}

.footer-shell {
  display: flex;
  max-width: 1160px;
  justify-content: space-between;
  gap: 24px;
  margin: 0 auto;
  padding: 28px 24px;
}

.footer-brand strong {
  display: inline-block;
  margin-bottom: 8px;
  color: #fff;
  font-size: 18px;
}

.footer-brand p,
.footer-meta {
  color: #c8c0e6;
  font-size: 13px;
}

.footer-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
}

.footer-meta button {
  border: 0;
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
}

.knowledge-page {
  --brand-primary: #37c993;
  --brand-primary-dark: #16986a;
  --brand-ink: #17212d;
  --brand-deep: #263445;
  --brand-muted: #667482;
  --brand-soft: #eafbf4;
  --panel-bg: rgba(255, 255, 255, 0.88);
  --line: rgba(38, 52, 69, 0.1);

  width: min(100%, 1240px);
  max-width: 1240px;
  margin: 0 auto;
  padding: 34px 24px 64px;
  color: var(--brand-deep);
  background:
    radial-gradient(circle at 16% 6%, rgba(100, 237, 172, 0.2), transparent 32%),
    radial-gradient(circle at 84% 8%, rgba(138, 104, 214, 0.1), transparent 30%),
    linear-gradient(180deg, #f7fffb 0%, #f3f8fb 62%, #ffffff 100%);
  box-shadow: 0 0 0 100vmax #f7fffb;
  clip-path: inset(0 -100vmax);
}

.page-hero {
  margin-bottom: 24px;
}

.soft-tag {
  margin-bottom: 14px;
  border-color: rgba(55, 201, 147, 0.24);
  background: var(--brand-soft);
  color: var(--brand-primary-dark);
}

.page-hero h1 {
  max-width: 760px;
  margin-bottom: 10px;
  color: var(--brand-ink);
  font-size: 38px;
  line-height: 1.15;
}

.page-hero p {
  color: var(--brand-muted);
  line-height: 1.75;
}

.filter-bar {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(220px, 1fr) auto;
  gap: 22px;
  align-items: end;
  margin-bottom: 24px;
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel-bg);
  backdrop-filter: blur(8px);
  box-shadow: 0 18px 45px rgba(38, 52, 69, 0.08);
}

.filter-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.filter-item span {
  color: var(--brand-deep);
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.filter-item :deep(.el-select) {
  width: 100%;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.brand-button {
  border: 0;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark));
  color: #fff;
  font-weight: 800;
}

.featured-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 28px;
  align-items: stretch;
  margin-bottom: 34px;
}

.featured-carousel,
.featured-card,
.rank-panel,
.article-card {
  border: 1px solid var(--line);
  background: var(--panel-bg);
  box-shadow: 0 24px 70px rgba(38, 52, 69, 0.12);
}

.featured-carousel {
  overflow: hidden;
  border-radius: 14px;
}

.featured-carousel :deep(.el-carousel__container) {
  border-radius: 14px;
}

.featured-card {
  position: relative;
  height: 420px;
  overflow: hidden;
  border: 0;
  border-radius: 14px;
  cursor: pointer;
}

.featured-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.96;
}

.featured-overlay {
  position: absolute;
  inset: auto 0 0;
  padding: 34px;
  background: linear-gradient(180deg, rgba(9, 24, 40, 0), rgba(9, 24, 40, 0.9));
}

.mint-tag {
  border: 0;
  background: var(--brand-primary);
  color: #fff;
  font-weight: 850;
}

.featured-overlay h2 {
  max-width: 780px;
  margin: 18px 0 16px;
  color: #fff;
  font-size: 36px;
  line-height: 1.2;
}

.featured-meta,
.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--brand-muted);
  font-size: 13px;
}

.featured-meta {
  color: rgba(255, 255, 255, 0.84);
}

.featured-meta span,
.meta-row span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.rank-panel {
  border-radius: 10px;
  padding: 12px;
}

.rank-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 16px;
  border: 1px solid var(--line);
}

.rank-tabs button {
  border: 0;
  border-right: 1px solid var(--line);
  background: transparent;
  color: var(--brand-deep);
  cursor: pointer;
  padding: 12px;
  font-weight: 850;
}

.rank-tabs button:not(.rank-tab-button) {
  display: none;
}

.rank-tabs .rank-tab-button:nth-child(3) {
  border-right: 0;
}

.rank-tabs button:last-child {
  border-right: 0;
}

.rank-tabs .active {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark));
  color: #fff;
}

.rank-list {
  display: grid;
  gap: 12px;
}

.rank-list button {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  min-height: 76px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  color: var(--brand-deep);
  cursor: pointer;
  text-align: left;
}

.rank-list img {
  width: 92px;
  height: 62px;
  border-radius: 6px;
  object-fit: cover;
}

.rank-list span {
  color: var(--brand-ink);
  font-size: 16px;
  font-weight: 850;
  line-height: 1.45;
}

.article-section {
  margin-top: 10px;
}

.article-head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.article-head h2 {
  color: var(--brand-ink);
  font-size: 28px;
}

.article-head p {
  margin-top: 6px;
  color: var(--brand-muted);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.article-card {
  overflow: hidden;
  border: 1px solid rgba(55, 201, 147, 0.18);
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 18px 42px rgba(38, 52, 69, 0.11);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.article-card:hover {
  border-color: rgba(55, 201, 147, 0.42);
  box-shadow: 0 24px 54px rgba(38, 52, 69, 0.15);
  transform: translateY(-4px);
}

.article-card img {
  width: 100%;
  height: 180px;
  border-bottom: 1px solid rgba(55, 201, 147, 0.14);
  object-fit: cover;
  background: var(--brand-soft);
}

.article-info {
  padding: 22px;
}

.article-info h3 {
  color: var(--brand-ink);
  font-size: 20px;
  line-height: 1.45;
}

.article-info p {
  display: -webkit-box;
  margin: 12px 0 18px;
  overflow: hidden;
  color: var(--brand-muted);
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 34px;
  padding: 18px 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 14px 34px rgba(38, 52, 69, 0.08);
}

.pagination-wrapper :deep(.el-pagination) {
  --el-pagination-button-bg-color: transparent;
  --el-pagination-bg-color: transparent;
  --el-pagination-button-color: var(--brand-deep);
  --el-pagination-button-disabled-color: #b8c3ce;
  --el-pagination-button-disabled-bg-color: transparent;
  --el-pagination-hover-color: var(--brand-primary-dark);
  font-weight: 700;
}

.pagination-wrapper :deep(.el-pager li.is-active) {
  background: var(--brand-primary-dark);
  color: #fff;
}

@media (max-width: 980px) {
  .featured-layout,
  .filter-bar {
    grid-template-columns: 1fr;
  }

  .article-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .public-header,
  .footer-shell {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }

  .public-nav,
  .footer-meta {
    justify-content: flex-start;
  }

  .knowledge-page {
    padding: 24px 16px 44px;
  }

  .filter-item {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
  }

  .article-grid {
    grid-template-columns: 1fr;
  }
}
</style>
