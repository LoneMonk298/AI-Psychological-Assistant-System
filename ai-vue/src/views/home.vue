<template>
  <div class="home-page">
    <section class="hero">
          <div class="hero-container">
            <div class="hero-content">
              <h1>
                一次温暖的记录
                <span>让情绪被看见</span>
              </h1>
              <p>
                围绕心理知识、情绪日志、咨询记录和后续 MaxKB
                接入，构建一个更易使用、 更便于管理的心理健康辅助系统。
              </p>
              <div class="hero-actions">
                <el-button
                  type="primary"
                  size="large"
                  :icon="ChatDotRound"
                  @click="go('/auth/login')"
                >
                  开始使用
                </el-button>
                <el-button
                  size="large"
                  :icon="Reading"
                  @click="go('/customer/knowledge')"
                >
                  查看知识库
                </el-button>
              </div>
            </div>

            <div class="hero-visual" aria-label="心理健康AI助手品牌标识">
              <div class="logo-showcase">
                <div class="logo-halo"></div>
                <img
                  src="@/assets/logo.png"
                  alt="心理健康AI助手品牌 Logo"
                  class="hero-logo"
                />
                <div class="brand-caption">
                  <strong>AI Psychological Assistant</strong>
                  <span>温柔记录，理性支持</span>
                </div>
              </div>
              <div class="visual-card visual-card-top">
                <el-icon><Notebook /></el-icon>
                <span>每日情绪记录</span>
              </div>
              <div class="visual-card visual-card-bottom">
                <el-icon><Lock /></el-icon>
                <span>隐私数据保护</span>
              </div>
            </div>
          </div>
        </section>

        <section class="features">
          <div class="section-head">
            <h2>为什么选择我们</h2>
            <p>把心理支持流程拆成清晰的模块，让学习、记录和管理都更轻松。</p>
          </div>

          <el-row :gutter="22">
            <el-col
              v-for="item in features"
              :key="item.title"
              :xs="24"
              :sm="12"
              :lg="6"
            >
              <el-card
                class="feature-card"
                shadow="hover"
                @click="go(item.path)"
              >
                <div class="feature-icon">
                  <el-icon><component :is="item.icon" /></el-icon>
                </div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
              </el-card>
            </el-col>
          </el-row>
        </section>

        <section class="stats">
          <div v-for="item in stats" :key="item.label" class="stat-item">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </section>

        <section class="cta">
          <div>
            <h2>开始你的心理健康管理之旅</h2>
            <p>
              先完成可靠的内容与记录闭环，后续再通过 MaxKB 扩展智能问答能力。
            </p>
          </div>
        </section>

    <el-dialog
      v-model="privacyVisible"
      title="隐私政策"
      width="640px"
      class="privacy-dialog"
      destroy-on-close
    >
      <div class="privacy-content">
        <p>
          心理健康AI助手重视用户隐私与心理健康数据安全。系统仅在提供心理知识浏览、
          情绪日志管理、咨询记录查看和后台分析时使用必要数据。
        </p>
        <p>
          部署到真实服务器前，应启用 HTTPS、完善 Token
          鉴权、密码加密、权限控制和操作日志，
          避免在页面中展示不必要的敏感信息。
        </p>
        <p>
          项目演示数据仅用于课程展示和功能验证，不应包含真实敏感心理咨询内容。
        </p>
      </div>
      <template #footer>
        <el-button type="primary" @click="privacyVisible = false"
          >我已了解</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  ChatDotRound,
  DataAnalysis,
  Lock,
  Notebook,
  Reading,
} from "@element-plus/icons-vue";

const router = useRouter();
const privacyVisible = ref(false);

const go = (path) => {
  router.push(path);
};

const features = [
  {
    title: "AI 智能对话",
    desc: "预留 MaxKB 接入能力，后续可扩展为心理问答与陪伴式对话。",
    path: "/auth/login",
    icon: ChatDotRound,
  },
  {
    title: "情绪日志",
    desc: "记录每日情绪评分、睡眠质量、压力水平和触发因素。",
    path: "/user/emotion",
    icon: Notebook,
  },
  {
    title: "知识库",
    desc: "维护心理健康科普文章，支持分类、标签和发布状态管理。",
    path: "/customer/knowledge",
    icon: Reading,
  },
  {
    title: "数据分析",
    desc: "汇总知识、咨询和情绪数据，帮助管理端了解系统使用情况。",
    path: "/user/dashboard",
    icon: DataAnalysis,
  },
];

const stats = [
  { value: "4+", label: "核心功能模块" },
  { value: "24h", label: "随时记录与查看" },
  { value: "100%", label: "自主管理数据" },
  { value: "MaxKB", label: "后续智能接入" },
];
</script>

<style scoped>
.home-page {
  --brand-primary: #8a68d6;
  --brand-primary-deep: #30284f;
  --brand-accent: #ee9fc9;
  --brand-accent-soft: #fff2f8;
  --brand-bg: #fff7fb;
  --text-main: #30284f;
  --text-soft: #69627b;
  --panel-bg: #ffffff;
  --footer-bg: #26213e;

  min-height: 100vh;
  background: linear-gradient(
    180deg,
    var(--brand-bg) 0%,
    #f7f2ff 52%,
    #ffffff 100%
  );
  color: var(--text-main);
}

.home-layout {
  min-height: 100vh;
}

.home-header {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 72px !important;
  border-bottom: 0;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 30px rgba(86, 72, 113, 0.08);
}

.nav-shell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1160px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text-main);
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
}

.brand-logo {
  width: 34px;
  height: 34px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-btn {
  color: var(--text-soft);
  font-weight: 600;
}

.nav-btn.active {
  color: var(--brand-primary);
}

.logout-btn {
  border: 0;
  background: linear-gradient(
    135deg,
    var(--brand-primary) 0%,
    var(--brand-accent) 100%
  );
  color: #fff;
  font-weight: 700;
}

.home-main {
  padding: 0;
}

.hero {
  padding: 88px 24px 72px;
}

.hero-container {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 56px;
  align-items: center;
  max-width: 1160px;
  margin: 0 auto;
}

.hero-content {
  max-width: 640px;
}

.hero-content h1 {
  margin-bottom: 22px;
  color: var(--text-main);
  font-size: 56px;
  line-height: 1.12;
  font-weight: 900;
}

.hero-content h1 span {
  display: block;
  color: var(--brand-primary);
}

.hero-content p {
  color: var(--text-soft);
  font-size: 18px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 34px;
}

.hero-actions .el-button--primary,
.cta .el-button--primary,
.privacy-dialog :deep(.el-button--primary) {
  border: 0;
  background: linear-gradient(
    135deg,
    var(--brand-primary) 0%,
    var(--brand-accent) 100%
  );
}

.hero-visual {
  position: relative;
  display: flex;
  min-height: 430px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  background:
    radial-gradient(
      circle at 28% 24%,
      rgba(238, 159, 201, 0.25),
      transparent 30%
    ),
    radial-gradient(
      circle at 76% 72%,
      rgba(138, 104, 214, 0.22),
      transparent 34%
    ),
    linear-gradient(145deg, #ffffff 0%, #fbf4ff 100%);
  box-shadow: 0 28px 70px rgba(92, 74, 125, 0.18);
}

.logo-showcase {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 22px;
  text-align: center;
}

.logo-halo {
  position: absolute;
  top: 18px;
  width: 230px;
  height: 230px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(138, 104, 214, 0.18),
    rgba(238, 159, 201, 0.24)
  );
  filter: blur(4px);
}

.hero-logo {
  position: relative;
  z-index: 1;
  width: 168px;
  height: 168px;
  padding: 28px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 18px 45px rgba(78, 60, 112, 0.16);
}

.brand-caption {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 8px;
}

.brand-caption strong {
  color: var(--text-main);
  font-size: 20px;
}

.brand-caption span {
  color: var(--brand-primary);
  font-size: 15px;
  font-weight: 700;
}

.visual-card {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-main);
  font-weight: 700;
  box-shadow: 0 12px 30px rgba(70, 60, 90, 0.12);
}

.visual-card .el-icon {
  color: var(--brand-primary);
  font-size: 20px;
}

.visual-card-top {
  top: 24px;
  left: 24px;
}

.visual-card-bottom {
  right: 24px;
  bottom: 24px;
}

.features {
  max-width: 1160px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.section-head {
  margin-bottom: 28px;
  text-align: center;
}

.section-head h2 {
  margin-bottom: 10px;
  color: var(--text-main);
  font-size: 34px;
  font-weight: 850;
}

.section-head p {
  color: var(--text-soft);
  font-size: 16px;
}

.feature-card {
  min-height: 230px;
  margin-bottom: 22px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
}

.feature-card :deep(.el-card__body) {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 26px;
}

.feature-icon {
  display: inline-flex;
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--brand-accent-soft);
  color: var(--brand-primary);
  font-size: 25px;
}

.feature-card h3 {
  color: var(--text-main);
  font-size: 19px;
  font-weight: 800;
}

.feature-card p {
  color: var(--text-soft);
  font-size: 14px;
  line-height: 1.75;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  max-width: 1160px;
  margin: 0 auto 64px;
  padding: 34px 24px;
  border-radius: 8px;
  background: var(--brand-primary-deep);
  color: #fff;
}

.stat-item {
  display: grid;
  gap: 8px;
  text-align: center;
}

.stat-item strong {
  font-size: 34px;
  font-weight: 900;
}

.stat-item span {
  color: #ded7f6;
  font-size: 14px;
}

.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: 1160px;
  margin: 0 auto 72px;
  padding: 42px 44px;
  border-radius: 8px;
  background: var(--panel-bg);
  box-shadow: 0 22px 55px rgba(85, 74, 110, 0.12);
}

.cta h2 {
  margin-bottom: 10px;
  color: var(--text-main);
  font-size: 30px;
  font-weight: 850;
}

.cta p {
  color: var(--text-soft);
  line-height: 1.75;
}

.home-footer {
  height: auto !important;
  padding: 0 !important;
  background: var(--footer-bg);
  color: #ded7f6;
}

.footer-shell {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  max-width: 1160px;
  margin: 0 auto;
  padding: 42px 24px 30px;
}

.footer-brand span {
  display: inline-block;
  margin-bottom: 12px;
  color: #fff;
  font-size: 20px;
  font-weight: 850;
}

.footer-brand p {
  color: #c8c0e6;
}



.footer-bottom {
  max-width: 1160px;
  margin: 0 auto;
  padding: 18px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: #b8aedc;
  font-size: 13px;
}

.privacy-content {
  display: grid;
  gap: 14px;
  color: #5f6472;
  line-height: 1.8;
}

@media (max-width: 860px) {
  .home-header {
    height: auto !important;
  }

  .nav-shell,
  .footer-shell,
  .cta {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-shell {
    gap: 14px;
    padding: 14px 18px;
  }

  .nav-links {
    width: 100%;
    flex-wrap: wrap;
  }

  .hero {
    padding: 52px 18px 42px;
  }

  .hero-container {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .hero-content h1 {
    font-size: 36px;
  }

  .hero-content p {
    font-size: 16px;
  }

  .hero-visual {
    min-height: 320px;
  }

  .hero-logo {
    width: 132px;
    height: 132px;
  }

  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 0 18px 52px;
    row-gap: 28px;
  }

  .cta {
    margin: 0 18px 56px;
    padding: 30px 24px;
  }

@media (max-width: 520px) {
  .brand span {
    font-size: 16px;
  }

  .hero-actions,
  .nav-links {
    align-items: stretch;
  }

  .hero-actions .el-button {
    width: 100%;
    margin-left: 0;
  }

  .stats {
    grid-template-columns: 1fr;
  }
  }
}
</style>
