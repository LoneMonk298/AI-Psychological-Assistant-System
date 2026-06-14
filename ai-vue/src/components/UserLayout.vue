<template>
  <div class="user-layout">
    <!-- 顶部导航栏 - 不变 -->
    <el-header class="user-header">
      <UserNavbar />
    </el-header>

    <!-- 主体内容 - 切换 -->
    <el-main class="user-main">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <keep-alive :include="keepAliveNames">
            <component
              :is="Component"
              :key="route.meta.keepAlive ? route.name : route.fullPath"
            />
          </keep-alive>
        </transition>
      </router-view>
    </el-main>

    <!-- 底部 Footer - 不变 -->
    <el-footer class="user-footer">
      <div class="footer-outer">
        <div class="footer-brand">
          <span>心理健康AI助手</span>
          <p>让每一次情绪表达都被认真对待。</p>
          <p>欢迎你的使用</p>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 AI Psychological Assistant System. All rights reserved.</span>
      </div>
    </el-footer>
  </div>
</template>

<script setup>
import UserNavbar from './UserNavbar.vue'

const keepAliveNames = ['ChatView']
</script>

<style lang="scss" scoped>
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #fff7fb 0%, #f7f2ff 52%, #ffffff 100%);
}

.user-header {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 72px !important;
  padding: 0 !important;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 30px rgba(86, 72, 113, 0.08);
}

.user-main {
  flex: 1;
  padding: 0;
  background: transparent;
}

.user-footer {
  height: auto !important;
  padding: 0 !important;
  background: #26213e;
  color: #ded7f6;

  .footer-outer {
    max-width: 1160px;
    margin: 0 auto;
    padding: 42px 24px 30px;
  }

  .footer-brand {
    span {
      display: inline-block;
      margin-bottom: 12px;
      color: #fff;
      font-size: 20px;
      font-weight: 850;
    }

    p {
      color: #c8c0e6;
      margin: 4px 0;
    }
  }

  .footer-bottom {
    max-width: 1160px;
    margin: 0 auto;
    padding: 18px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    color: #b8aedc;
    font-size: 13px;
    text-align: center;
  }
}

// 页面切换过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
