<template>
  <div class="user-navbar">
    <div class="navbar-left">
      <button class="brand" type="button" @click="go('/')">
        <img src="@/assets/logo.svg" alt="心理健康AI助手" class="brand-logo" />
        <span>心理健康AI助手</span>
      </button>

      <nav class="nav-links" aria-label="主页导航">
        <el-button
          class="nav-btn"
          :class="{ active: route.path === '/customer/home' }"
          text
          :icon="House"
          @click="go('/customer/home')"
        >主页</el-button>
        <el-button
          class="nav-btn"
          :class="{ active: route.path === '/customer/knowledge' }"
          text
          :icon="Reading"
          @click="go('/customer/knowledge')"
        >知识库</el-button>
        <el-button
          class="nav-btn"
          :class="{ active: route.path === '/customer/chat' }"
          text
          :icon="AIchat"
          @click="go('/customer/chat')"
        >AI咨询</el-button>
      </nav>
    </div>

    <div class="navbar-right">
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="userInfo?.avatar || defaultAvatar" />
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { House, Reading, ArrowDown } from '@element-plus/icons-vue'
import { logout } from '@/api/admin'

const router = useRouter()
const route = useRoute()

const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const userInfo = computed(() => {
  try {
    const info = localStorage.getItem('userInfo')
    return info ? JSON.parse(info) : null
  } catch {
    return null
  }
})

const go = (path) => {
  router.push(path)
}

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      logout().catch(() => {}).finally(() => {
        router.push('/auth/login')
      })
    }).catch(() => {})
  } else if (command === 'profile') {
    router.push('/user/profile')
  }
}
</script>

<style lang="scss" scoped>
.user-navbar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .brand-logo {
      width: 32px;
      height: 32px;
    }

    span {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 8px;

    .nav-btn {
      font-size: 14px;
      color: #606266;

      &:hover {
        color: #409eff;
      }

      &.is-active, &.active {
        color: #409eff;
        background-color: rgba(64, 158, 255, 0.1);
        border-radius: 4px;
      }
    }
  }

  .navbar-right {
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      .username {
        font-size: 14px;
        color: #303133;
      }
    }
  }
}
</style>
