<template>
  <div class="user-navbar">
    <div class="navbar-left">
      <button class="brand" type="button" @click="goBrandHome">
        <img src="@/assets/logo.svg" alt="心理健康AI助手" class="brand-logo" />
        <span>心理健康AI助手</span>
      </button>

      <nav class="nav-links" aria-label="用户端导航">
        <el-button
          v-for="item in navItems"
          :key="item.path"
          class="nav-btn"
          :class="{ active: isActive(item.path) }"
          text
          :icon="item.icon"
          @click="go(item.path)"
        >
          {{ item.label }}
        </el-button>
      </nav>
    </div>

    <div class="navbar-right">
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="34" :src="avatarUrl" />
          <span class="username">{{ userInfo?.nickname || userInfo?.username || '用户' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <UserProfileDialog v-model="profileVisible"  />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  ChatDotRound,
  House,
  Notebook,
  Reading,
} from '@element-plus/icons-vue'
import { logout } from '@/api/admin'
import UserProfileDialog from '@/components/UserProfileDialog.vue'
import { normalizeUserInfo, resolveUserAvatarUrl } from '@/utils/userAvatar'

const router = useRouter()
const route = useRoute()

const profileVisible = ref(false)

const navItems = [
  { label: '主页', path: '/customer/home', icon: House },
  { label: '知识库', path: '/customer/knowledge', icon: Reading },
  { label: 'AI 咨询', path: '/customer/chat', icon: ChatDotRound },
  { label: '情绪日志', path: '/customer/emotionDiary', icon: Notebook },
]

const userInfo = computed(() => {
  try {
    const info = localStorage.getItem('userInfo')
    return info ? normalizeUserInfo(JSON.parse(info)) : null
  } catch {
    return null
  }
})

const avatarUrl = computed(() => resolveUserAvatarUrl(userInfo.value || {}))

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`)

const go = (path) => {
  router.push(path)
}

const clearLoginState = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('privacyAccepted')
}

const goBrandHome = () => {
  router.push(localStorage.getItem('token') ? '/customer/home' : '/')
}

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        logout()
          .catch(() => {})
          .finally(() => {
            clearLoginState()
            router.replace('/auth/login')
          })
      })
      .catch(() => {})
  } else if (command === 'profile') {
    profileVisible.value = true
  }
}
</script>

<style lang="scss" scoped>
.user-navbar {
  --brand-primary: #8a68d6;
  --brand-accent: #ee9fc9;
  --brand-ink: #30284f;
  --brand-muted: #69627b;

  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 28px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(138, 104, 214, 0.08);

  .navbar-left {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 28px;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: max-content;
    padding: 8px 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--brand-ink);
    cursor: pointer;
    font-weight: 800;
    transition: background-color 0.2s ease;

    &:hover {
      background: #fff2f8;
    }

    .brand-logo {
      width: 34px;
      height: 34px;
    }

    span {
      font-size: 16px;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
  }

  .nav-btn {
    flex: 0 0 auto;
    color: var(--brand-muted);
    font-weight: 700;

    &:hover,
    &.active {
      color: var(--brand-primary);
      background: #fff2f8;
      border-radius: 8px;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 10px 26px rgba(86, 72, 113, 0.08);
    cursor: pointer;

    .username {
      max-width: 110px;
      overflow: hidden;
      color: var(--brand-ink);
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

@media (max-width: 860px) {
  .user-navbar {
    flex-direction: column;
    height: auto;
    align-items: stretch;
    padding: 12px 16px;

    .navbar-left {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .navbar-right {
      align-self: flex-end;
    }
  }
}
</style>
