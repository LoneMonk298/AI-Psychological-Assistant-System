<template>
  <div class="landing-page">
    <a class="skip-link" href="#main-content">跳到主要内容</a>

    <el-container>
      <el-header class="landing-header">
        <div class="nav-shell">
          <button class="brand" type="button" @click="go('/')">
            <img src="@/assets/logo.svg" alt="心理健康AI助手" />
            <span>心理健康AI助手</span>
          </button>

          <nav class="nav-links" aria-label="主页导航">
            <el-button text class="nav-button active" :icon="House" @click="go('/')">主页</el-button>
            <el-button text class="nav-button" :icon="Reading" @click="go('/knowledge')">
              知识库
            </el-button>
            <el-button type="primary" class="brand-button" :icon="User" @click="go('/auth/login')">
              登录
            </el-button>
          </nav>
        </div>
      </el-header>

      <el-main id="main-content" class="landing-main">
        <section class="hero">
          <div class="hero-copy">
            <span class="eyebrow">MaxKB 已接入</span>
            <h1>
              用一个轻量助手
              <span>承接每次情绪表达</span>
            </h1>
            <p>
              面向心理健康辅助场景，整合 AI 咨询、知识阅读、情绪日志和后台数据展示。
              用户可以更自然地表达状态，管理端也能更清楚地跟进内容与记录。
            </p>
            <div class="hero-actions">
              <el-button
                type="primary"
                size="large"
                class="brand-button"
                :icon="ChatDotRound"
                @click="go('/auth/login')"
              >
                开始使用
              </el-button>
              <button class="text-link" type="button" @click="go('/knowledge')">
                先浏览心理知识
                <el-icon><ArrowRight /></el-icon>
              </button>
            </div>
          </div>

          <div class="hero-showcase" aria-label="心理健康AI助手功能预览">
            <BrandMascot />
            <div class="metric-strip">
              <div>
                <strong>4</strong>
                <span>核心模块</span>
              </div>
              <div>
                <strong>MaxKB</strong>
                <span>对话能力</span>
              </div>
              <div>
                <strong>UTF-8</strong>
                <span>本地部署友好</span>
              </div>
            </div>
          </div>
        </section>

        <section class="preview-section">
          <div class="section-title">
            <span>页面预览</span>
            <h2>了解核心功能</h2>
            <p>横向滑动查看用户首页、AI 咨询、知识库、情绪日志和后台数据页面。</p>
          </div>

          <el-carousel
            ref="previewCarouselRef"
            class="preview-carousel"
            height="520px"
            trigger="click"
            arrow="always"
            indicator-position="outside"
            :autoplay="true"
            :loop="true"
            :pause-on-hover="false"
            :interval="3600"
          >
            <el-carousel-item v-for="item in previews" :key="item.title">
              <article class="preview-slide" :class="item.theme" @click="go(item.path)">
                <div class="preview-meta">
                  <span>{{ item.kicker }}</span>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.desc }}</p>
                  <button type="button" class="preview-action">
                    查看页面
                    <el-icon><ArrowRight /></el-icon>
                  </button>
                </div>

                <div class="screen-shot" :class="item.screen" aria-hidden="true">
                  <img v-if="item.image" :src="item.image" :alt="item.title" />
                  <template v-else>
                    <div class="screen-topbar">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div class="screen-body">
                      <div class="screen-sidebar">
                        <i v-for="n in 4" :key="n"></i>
                      </div>
                      <div class="screen-content">
                        <div class="screen-title"></div>
                        <div class="screen-line long"></div>
                        <div class="screen-line"></div>
                        <div class="mini-grid">
                          <b v-for="n in item.blocks" :key="n"></b>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </article>
            </el-carousel-item>
          </el-carousel>
        </section>

        <section class="cta">
          <div>
            <span>准备进入系统</span>
            <h2>从一次情绪记录开始，让后续咨询有迹可循</h2>
            <p>登录后可以进入用户端体验知识库、情绪日志和 AI 咨询页面。</p>
          </div>
          <el-button type="primary" class="brand-button" size="large" :icon="User" @click="go('/auth/login')">
            进入系统
          </el-button>
        </section>
      </el-main>

      <el-footer class="landing-footer">
        <div class="footer-shell">
          <div class="footer-brand">
            <strong>心理健康AI助手</strong>
            <p>Vue3 / Element Plus / Spring Boot / MaxKB 课程项目展示。</p>
          </div>
          <div class="footer-meta">
            <span>© 2026 AI Psychological Assistant System</span>
            <button type="button" @click="privacyVisible = true">隐私政策</button>
            <button type="button" @click="go('/auth/login')">登录系统</button>
          </div>
        </div>
      </el-footer>
    </el-container>

    <el-dialog v-model="privacyVisible" title="隐私政策" width="640px" destroy-on-close>
      <div class="privacy-content">
        <p>
          心理健康AI助手重视用户隐私与心理健康数据安全。系统仅在提供心理知识浏览、
          情绪日志管理、咨询记录查看和后台分析时使用必要数据。
        </p>
        <p>
          部署到真实服务器前，应启用 HTTPS、完善 Token 鉴权、密码加密、权限控制和操作日志，
          避免在页面中展示不必要的敏感信息。
        </p>
        <p>项目演示数据仅用于课程展示和功能验证，不应包含真实敏感心理咨询内容。</p>
      </div>
      <template #footer>
        <el-button type="primary" class="brand-button" @click="privacyVisible = false">
          我已了解
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ChatDotRound, House, Reading, User } from '@element-plus/icons-vue'
import BrandMascot from '@/components/BrandMascot.vue'

const homePreview = new URL('@/assets/home.png', import.meta.url).href
const chatPreview = new URL('@/assets/chat.png', import.meta.url).href
const knowledgePreview = new URL('@/assets/knowledge.png', import.meta.url).href
const emotionPreview = new URL('@/assets/emotion.png', import.meta.url).href
const backendPreview = new URL('@/assets/backend.png', import.meta.url).href

const router = useRouter()
const privacyVisible = ref(false)
const previewCarouselRef = ref(null)
let previewTimer = null

const go = (path) => {
  router.push(path)
}

const previews = [
  {
    kicker: 'Customer home',
    title: '用户首页',
    desc: '聚合咨询、知识库和情绪记录入口。',
    path: '/auth/login',
    theme: 'theme-home',
    screen: 'screen-home',
    blocks: 4,
    image: homePreview,
  },
  {
    kicker: 'MaxKB chat',
    title: 'AI 咨询',
    desc: '全屏嵌入 MaxKB，对话页面更沉浸。',
    path: '/auth/login',
    theme: 'theme-chat',
    screen: 'screen-chat',
    blocks: 2,
    image: chatPreview,
  },
  {
    kicker: 'Knowledge',
    title: '知识库',
    desc: '分类筛选、搜索和文章阅读集中展示。',
    path: '/knowledge',
    theme: 'theme-knowledge',
    screen: 'screen-knowledge',
    blocks: 5,
    image: knowledgePreview,
  },
  {
    kicker: 'Emotion diary',
    title: '情绪日志',
    desc: '记录心情、压力、睡眠和触发事件。',
    path: '/auth/login',
    theme: 'theme-emotion',
    screen: 'screen-emotion',
    blocks: 3,
    image: emotionPreview,
  },
  {
    kicker: 'Dashboard',
    title: '后台数据',
    desc: '用图表汇总文章、咨询与情绪日志。',
    path: '/auth/login',
    theme: 'theme-dashboard',
    screen: 'screen-dashboard',
    blocks: 6,
    image: backendPreview,
  },
]

onMounted(() => {
  previewTimer = window.setInterval(() => {
    previewCarouselRef.value?.next()
  }, 3600)
})

onBeforeUnmount(() => {
  if (previewTimer) {
    window.clearInterval(previewTimer)
  }
})
</script>

<style scoped>
.landing-page {
  --brand-primary: #37c993;
  --brand-primary-dark: #16986a;
  --brand-deep: #263445;
  --brand-ink: #17212d;
  --brand-muted: #667482;
  --brand-soft: #eafbf4;
  --brand-line: rgba(38, 52, 69, 0.1);
  --surface: rgba(255, 255, 255, 0.78);
  --shadow: 0 26px 70px rgba(30, 58, 74, 0.12);

  min-height: 100vh;
  color: var(--brand-deep);
  background:
    radial-gradient(circle at 16% 10%, rgba(100, 237, 172, 0.22), transparent 30%),
    radial-gradient(circle at 84% 8%, rgba(138, 104, 214, 0.12), transparent 28%),
    linear-gradient(180deg, #f7fffb 0%, #f3f8fb 52%, #ffffff 100%);
  font-family:
    "HarmonyOS Sans SC",
    "Microsoft YaHei",
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.landing-page::before {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  content: "";
  background-image:
    linear-gradient(rgba(38, 52, 69, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(38, 52, 69, 0.03) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.72), transparent 72%);
}

.skip-link {
  position: fixed;
  left: 18px;
  top: 12px;
  z-index: 50;
  padding: 9px 12px;
  border-radius: 6px;
  background: var(--brand-ink);
  color: #fff;
  opacity: 0;
  transform: translateY(-18px);
  transition: 0.2s ease;
}

.skip-link:focus {
  opacity: 1;
  transform: translateY(0);
}

.landing-header {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 72px !important;
  padding: 0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.72);
  background: rgba(247, 255, 251, 0.82);
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 34px rgba(38, 52, 69, 0.06);
}

.nav-shell,
.hero,
.preview-section,
.cta,
.footer-shell {
  max-width: 1180px;
  margin: 0 auto;
}

.nav-shell {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  color: var(--brand-ink);
  cursor: pointer;
  font-size: 18px;
  font-weight: 850;
}

.brand img {
  width: 36px;
  height: 36px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-button {
  color: var(--brand-muted);
  transition: transform 0.22s ease, color 0.22s ease, background 0.22s ease;
}

.nav-button.active,
.nav-button:hover {
  background: rgba(55, 201, 147, 0.11);
  color: var(--brand-primary-dark);
}

.brand-button {
  border: 0;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark));
  color: #fff;
  font-weight: 750;
  box-shadow: 0 14px 28px rgba(55, 201, 147, 0.22);
  transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
}

.brand-button:hover {
  filter: saturate(1.05);
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(55, 201, 147, 0.26);
}

.brand-button:active,
.preview-slide:active,
.text-link:active {
  transform: scale(0.98);
}

.brand:focus-visible,
.text-link:focus-visible,
.footer-meta button:focus-visible,
.preview-slide:focus-visible {
  outline: 3px solid rgba(55, 201, 147, 0.28);
  outline-offset: 4px;
}

.landing-main {
  padding: 0;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.98fr);
  gap: 62px;
  align-items: center;
  padding: 98px 24px 86px;
}

.hero-copy {
  max-width: 680px;
}

.eyebrow,
.section-title span,
.cta span {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 18px;
  padding: 7px 10px;
  border: 1px solid rgba(55, 201, 147, 0.22);
  border-radius: 6px;
  background: rgba(234, 251, 244, 0.9);
  color: var(--brand-primary-dark);
  font-size: 13px;
  font-weight: 800;
}

.hero h1 {
  max-width: 760px;
  margin-bottom: 24px;
  color: var(--brand-ink);
  font-size: clamp(42px, 5.2vw, 68px);
  line-height: 1.05;
  font-weight: 920;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.hero h1 span {
  display: block;
  color: var(--brand-primary-dark);
}

.hero p {
  max-width: 620px;
  color: var(--brand-muted);
  font-size: 18px;
  line-height: 1.9;
  text-wrap: pretty;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  margin-top: 34px;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: var(--brand-deep);
  cursor: pointer;
  font: inherit;
  font-weight: 760;
  transition: color 0.22s ease, transform 0.22s ease;
}

.text-link:hover {
  color: var(--brand-primary-dark);
  transform: translateX(3px);
}

.hero-showcase {
  position: relative;
  display: grid;
  min-height: 470px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 18px 18px 42px 18px;
  background:
    radial-gradient(circle at 34% 24%, rgba(100, 237, 172, 0.24), transparent 34%),
    radial-gradient(circle at 76% 70%, rgba(55, 201, 147, 0.16), transparent 36%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(238, 252, 246, 0.78));
  box-shadow: var(--shadow);
  overflow: hidden;
}

.hero-showcase::after {
  position: absolute;
  inset: auto -18% -22% 12%;
  height: 140px;
  content: "";
  background: linear-gradient(90deg, rgba(55, 201, 147, 0.18), rgba(138, 104, 214, 0.12));
  filter: blur(28px);
  transform: rotate(-8deg);
}

.metric-strip {
  position: absolute;
  left: 26px;
  right: 26px;
  bottom: 22px;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-strip div {
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.72);
}

.metric-strip strong,
.metric-strip span {
  display: block;
}

.metric-strip strong {
  color: var(--brand-ink);
  font-size: 18px;
  font-variant-numeric: tabular-nums;
}

.metric-strip span {
  margin-top: 3px;
  color: var(--brand-muted);
  font-size: 12px;
}

.preview-section {
  padding: 34px 24px 92px;
}

.section-title {
  max-width: 760px;
  margin-bottom: 32px;
}

.section-title h2,
.cta h2 {
  color: var(--brand-ink);
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.18;
  font-weight: 880;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.section-title p,
.cta p,
.privacy-content {
  color: var(--brand-muted);
  line-height: 1.8;
}

.section-title p {
  margin-top: 12px;
  max-width: 620px;
}

.preview-carousel {
  border-radius: 28px;
}

.preview-carousel :deep(.el-carousel__container) {
  overflow: visible;
}

.preview-slide {
  position: relative;
  display: grid;
  grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1.28fr);
  gap: 28px;
  height: 100%;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: var(--shadow);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.24s ease, box-shadow 0.24s ease;
}

.preview-slide:hover {
  box-shadow: 0 30px 80px rgba(30, 58, 74, 0.16);
}

.preview-slide::before {
  position: absolute;
  inset: -22% -10% auto auto;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  content: "";
  background: rgba(55, 201, 147, 0.16);
  filter: blur(2px);
}

.theme-chat::before {
  background: rgba(138, 104, 214, 0.16);
}

.theme-knowledge::before {
  background: rgba(79, 168, 255, 0.14);
}

.theme-emotion::before {
  background: rgba(255, 185, 104, 0.18);
}

.theme-dashboard::before {
  background: rgba(38, 52, 69, 0.12);
}

.preview-meta {
  position: relative;
  z-index: 1;
}

.preview-meta span {
  color: var(--brand-primary-dark);
  font-size: 13px;
  font-weight: 850;
  text-transform: uppercase;
}

.preview-meta h3 {
  margin: 8px 0 10px;
  color: var(--brand-ink);
  font-size: 30px;
}

.preview-meta p {
  max-width: 360px;
  color: var(--brand-muted);
  line-height: 1.72;
}

.screen-shot {
  position: relative;
  align-self: stretch;
  min-height: 420px;
  border: 1px solid rgba(38, 52, 69, 0.08);
  border-radius: 22px;
  background: #f8fffb;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72);
  overflow: hidden;
}

.screen-chat .screen-sidebar {
  background: rgba(138, 104, 214, 0.12);
}

.screen-chat .screen-title {
  width: 62%;
  background: #8a68d6;
}

.screen-chat .mini-grid {
  grid-template-columns: 1fr;
}

.screen-chat .mini-grid b {
  min-height: 82px;
  background: rgba(138, 104, 214, 0.16);
}

.screen-knowledge .screen-body {
  grid-template-columns: 1fr;
}

.screen-knowledge .screen-sidebar {
  display: none;
}

.screen-knowledge .mini-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.screen-knowledge .mini-grid b {
  min-height: 78px;
  background: rgba(65, 214, 255, 0.16);
}

.screen-emotion .screen-title {
  width: 40%;
  background: #f0a640;
}

.screen-emotion .mini-grid b {
  min-height: 96px;
  background: rgba(240, 166, 64, 0.16);
}

.screen-dashboard .screen-body {
  grid-template-columns: 70px 1fr;
}

.screen-dashboard .mini-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.screen-shot > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.screen-topbar {
  display: flex;
  gap: 7px;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  border-bottom: 1px solid rgba(38, 52, 69, 0.08);
  background: rgba(255, 255, 255, 0.76);
}

.screen-topbar span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #37c993;
}

.screen-topbar span:nth-child(2) {
  background: #92e4c6;
}

.screen-topbar span:nth-child(3) {
  background: #cfeee4;
}

.screen-body {
  display: grid;
  grid-template-columns: 86px 1fr;
  min-height: 236px;
}

.screen-sidebar {
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 18px 14px;
  background: rgba(234, 251, 244, 0.74);
}

.screen-sidebar i {
  height: 24px;
  border-radius: 8px;
  background: rgba(55, 201, 147, 0.2);
}

.screen-content {
  padding: 20px;
}

.screen-title {
  width: 46%;
  height: 28px;
  margin-bottom: 16px;
  border-radius: 8px;
  background: var(--brand-ink);
}

.screen-line {
  width: 62%;
  height: 10px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: rgba(102, 116, 130, 0.2);
}

.screen-line.long {
  width: 82%;
}

.mini-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.mini-grid b {
  min-height: 54px;
  border-radius: 12px;
  background: rgba(55, 201, 147, 0.14);
}

.preview-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  margin-top: 24px;
  border: 0;
  background: transparent;
  color: var(--brand-primary-dark);
  cursor: pointer;
  font: inherit;
  font-weight: 850;
}

.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 78px;
  padding: 42px 44px;
  border: 1px solid rgba(255, 255, 255, 0.86);
  border-radius: 18px;
  background:
    radial-gradient(circle at 88% 18%, rgba(100, 237, 172, 0.2), transparent 30%),
    rgba(255, 255, 255, 0.84);
  box-shadow: var(--shadow);
}

.cta p {
  margin-top: 10px;
}

.landing-footer {
  height: auto !important;
  padding: 0 !important;
  background: #17212d;
  color: #d9e4e2;
}

.footer-shell {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 32px 24px;
}

.footer-brand strong {
  display: block;
  margin-bottom: 8px;
  color: #fff;
  font-size: 18px;
}

.footer-brand p,
.footer-meta {
  color: #aab8b5;
  font-size: 13px;
}

.footer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  justify-content: flex-end;
}

.footer-meta button {
  border: 0;
  background: transparent;
  color: #d9e4e2;
  cursor: pointer;
  font: inherit;
  transition: color 0.2s ease;
}

.footer-meta button:hover {
  color: #64edac;
}

.privacy-content {
  display: grid;
  gap: 14px;
}

@media (max-width: 940px) {
  .landing-header {
    height: auto !important;
  }

  .nav-shell,
  .cta,
  .footer-shell {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-shell {
    gap: 12px;
    padding: 14px 18px;
  }

  .nav-links {
    flex-wrap: wrap;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 58px 18px 52px;
  }

  .hero-showcase {
    min-height: 420px;
  }

  .preview-slide {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .screen-shot {
    min-height: 280px;
  }

  .footer-meta {
    justify-content: flex-start;
  }
}

@media (max-width: 620px) {
  .hero h1 {
    font-size: 38px;
  }

  .hero-showcase {
    min-height: 380px;
  }

  .metric-strip {
    left: 12px;
    right: 12px;
    grid-template-columns: 1fr;
  }

  .metric-strip div:not(:first-child) {
    display: none;
  }

  .preview-section {
    padding-right: 16px;
    padding-left: 16px;
  }

  .cta {
    padding: 26px;
  }

  .preview-carousel {
    height: auto;
  }

  .preview-carousel :deep(.el-carousel__container) {
    height: 580px !important;
  }

  .screen-body {
    grid-template-columns: 64px 1fr;
  }
}
</style>
