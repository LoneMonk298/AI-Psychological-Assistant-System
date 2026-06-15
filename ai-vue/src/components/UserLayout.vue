<template>
  <div class="user-layout">
    <el-header class="user-header">
      <UserNavbar />
    </el-header>

    <el-main class="user-main">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <keep-alive :include="keepAliveNames">
            <component
              :is="Component"
              :key="route.meta.keepAlive && route.name ? route.name : route.fullPath"
            />
          </keep-alive>
        </transition>
      </router-view>
    </el-main>

    <el-footer class="user-footer">
      <div class="footer-outer">
        <div class="footer-brand">
          <span>心理健康AI助手</span>
          <p>让每一次情绪表达都被认真对待。</p>
        </div>
        <div class="footer-note">
          <span>© 2026 AI Psychological Assistant System</span>
        </div>
      </div>
    </el-footer>

    <el-dialog
      v-model="privacyVisible"
      title="隐私政策确认"
      width="620px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="privacy-dialog"
    >
      <div class="privacy-copy">
        <p>
          为了继续使用心理健康 AI 助手，我们需要保存你的登录状态、基础资料、情绪日志和咨询入口使用记录。
          这些数据仅用于本系统的功能展示、学习记录和后台统计，不会用于无关用途。
        </p>
        <p>
          你可以选择了解并继续使用；如果拒绝，我们会退出当前登录并返回登录页。
        </p>
      </div>
      <template #footer>
        <el-button @click="rejectPrivacy">拒绝</el-button>
        <el-button type="primary" @click="acceptPrivacy">我已了解</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import UserNavbar from './UserNavbar.vue'

const keepAliveNames = ['ChatView']
const router = useRouter()
const privacyVisible = ref(false)

const clearLoginState = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('privacyAccepted')
}

const checkAuthAndPrivacy = () => {
  if (!localStorage.getItem('token')) {
    router.replace('/auth/login')
    return
  }

  if (localStorage.getItem('privacyAccepted') !== 'true') {
    privacyVisible.value = true
  }
}

const acceptPrivacy = () => {
  localStorage.setItem('privacyAccepted', 'true')
  privacyVisible.value = false
}

const rejectPrivacy = () => {
  clearLoginState()
  privacyVisible.value = false
  router.replace('/auth/login')
}

onMounted(checkAuthAndPrivacy)
</script>

<style lang="scss" scoped>
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 12% 4%, rgba(238, 159, 201, 0.16), transparent 28%),
    radial-gradient(circle at 88% 12%, rgba(138, 104, 214, 0.16), transparent 32%),
    linear-gradient(180deg, #fff7fb 0%, #f7f2ff 52%, #ffffff 100%);
}

.user-header {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 72px !important;
  padding: 0 !important;
  background: transparent;
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
    display: flex;
    max-width: 1160px;
    justify-content: space-between;
    gap: 24px;
    margin: 0 auto;
    padding: 26px 24px;
  }

  .footer-brand span {
    display: inline-block;
    margin-bottom: 6px;
    color: #fff;
    font-size: 18px;
    font-weight: 850;
  }

  .footer-brand p,
  .footer-note {
    color: #c8c0e6;
    font-size: 13px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.privacy-copy {
  color: #4b455f;
  line-height: 1.8;
}

.privacy-copy p + p {
  margin-top: 12px;
}

@media (max-width: 860px) {
  .user-header {
    height: auto !important;
  }

  .user-footer .footer-outer {
    flex-direction: column;
  }
}
</style>
