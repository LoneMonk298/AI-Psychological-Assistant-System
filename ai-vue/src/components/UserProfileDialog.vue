<template>
  <el-dialog
    v-model="visible"
    title="个人中心"
    width="720px"
    top="4vh"
    class="profile-dialog"
    append-to-body
    destroy-on-close
    @open="loadProfile"
    @closed="handleClosed"
  >
    <div class="profile-dialog-body">
      <section class="profile-card">
        <div class="profile-avatar">
          <el-avatar :size="72" :src="avatarPreview || form.avatar || defaultAvatar" />
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            :on-change="handleAvatarSelect"
          >
            <el-button plain size="small">更换头像</el-button>
          </el-upload>
        </div>

        <el-form :model="form" label-width="86px" class="profile-form">
          <el-divider content-position="left">基本资料</el-divider>
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入用户名" maxlength="30" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="80" />
          </el-form-item>
          <div class="inline-fields">
            <el-form-item label="年龄">
              <el-input-number v-model="form.age" :min="1" :max="120" controls-position="right" />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="form.gender" placeholder="请选择" clearable>
                <el-option label="女" value="female" />
                <el-option label="男" value="male" />
                <el-option label="保密" value="unknown" />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" :loading="savingProfile" @click="saveProfile">保存资料</el-button>
          </el-form-item>
        </el-form>
      </section>

      <section class="profile-card">
        <el-form :model="securityForm" label-width="86px" class="profile-form">
          <el-divider content-position="left">账号安全</el-divider>
          <el-form-item label="原密码">
            <el-input v-model="securityForm.oldPassword" type="password" show-password placeholder="输入原密码" />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="securityForm.newPassword" type="password" show-password placeholder="输入新密码" />
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="securityForm.confirmPassword" type="password" show-password placeholder="输入新密码" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="savingPassword" @click="changePassword">重置密码</el-button>
          </el-form-item>
        </el-form>

        <el-form :model="emailForm" label-width="86px" class="profile-form">
          <el-form-item label="新邮箱">
            <el-input v-model="emailForm.email" placeholder="请输入新邮箱" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="savingEmail" @click="changeEmail">换绑邮箱</el-button>
          </el-form-item>
        </el-form>
      </section>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getUserProfile,
  updateUserEmail,
  updateUserPassword,
  updateUserProfile,
  uploadUserAvatar,
} from '@/api/frontend'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleClosed = () => {
  window.location.reload()
}

const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const avatarPreview = ref('')
const savingProfile = ref(false)
const savingPassword = ref(false)
const savingEmail = ref(false)

const form = reactive({
  username: '',
  email: '',
  age: null,
  gender: '',
  avatar: '',
})

const securityForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const emailForm = reactive({
  email: '',
})

const getLocalUser = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo') || '{}')
  } catch {
    return {}
  }
}

const applyProfile = (profile = {}) => {
  const localUser = getLocalUser()
  const data = { ...localUser, ...profile }
  form.username = data.username || data.nickname || ''
  form.email = data.email || ''
  form.age = data.age ?? null
  form.gender = data.gender || ''
  form.avatar = data.avatar || ''
  emailForm.email = data.email || ''
}

const syncLocalUser = (patch = {}) => {
  const current = getLocalUser()
  localStorage.setItem('userInfo', JSON.stringify({ ...current, ...patch }))
}

const loadProfile = async () => {
  applyProfile()
  try {
    const res = await getUserProfile()
    applyProfile(res?.data || res || {})
  } catch {
    // 后端接口未完成时，继续展示本地登录信息。
  }
}

const saveProfile = async () => {
  savingProfile.value = true
  const payload = {
    username: form.username,
    email: form.email,
    age: form.age,
    gender: form.gender,
    avatar: form.avatar,
  }

  try {
    const res = await updateUserProfile(payload)
    const data = res?.data || payload
    syncLocalUser(data)
    ElMessage.success('资料已保存')
  } catch {
    syncLocalUser(payload)
  } finally {
    savingProfile.value = false
  }
}

const changePassword = async () => {
  if (!securityForm.oldPassword || !securityForm.newPassword) {
    ElMessage.warning('请填写原密码和新密码')
    return
  }

  if (securityForm.newPassword !== securityForm.confirmPassword) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }

  savingPassword.value = true
  try {
    await updateUserPassword({
      oldPassword: securityForm.oldPassword,
      newPassword: securityForm.newPassword,
    })
    securityForm.oldPassword = ''
    securityForm.newPassword = ''
    securityForm.confirmPassword = ''
    ElMessage.success('密码已更新')
  } catch {
    ElMessage.warning('后端重置密码接口暂不可用')
  } finally {
    savingPassword.value = false
  }
}

const changeEmail = async () => {
  if (!emailForm.email) {
    ElMessage.warning('请输入新邮箱')
    return
  }

  savingEmail.value = true
  try {
    await updateUserEmail({ email: emailForm.email })
    form.email = emailForm.email
    syncLocalUser({ email: emailForm.email })
    ElMessage.success('邮箱已更新')
  } catch {
    ElMessage.warning('后端换绑邮箱接口暂不可用')
  } finally {
    savingEmail.value = false
  }
}

const handleAvatarSelect = async (file) => {
  const raw = file.raw
  if (!raw) return false
  avatarPreview.value = URL.createObjectURL(raw)
  try {
    const res = await uploadUserAvatar(raw)
    const data = res?.data || res || {}
    form.avatar = data.url || data.fileUrl || data.filePath || form.avatar
    syncLocalUser({ avatar: form.avatar })
    ElMessage.success('头像已上传')
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.warning('头像已本地预览，但上传失败')
  }
  return false
}
</script>

<style scoped>
:global(.profile-dialog) {
  max-width: calc(100vw - 32px);
  border-radius: 16px;
  overflow: hidden;
}

:global(.profile-dialog .el-dialog__header) {
  margin-right: 0;
  padding: 18px 22px 12px;
  border-bottom: 1px solid rgba(138, 104, 214, 0.12);
}

:global(.profile-dialog .el-dialog__body) {
  max-height: 72vh;
  overflow-y: auto;
  padding: 18px 22px 22px;
}

.profile-dialog-body {
  display: grid;
  gap: 18px;
}

.profile-card {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 22px;
  padding: 18px;
  border: 1px solid rgba(138, 104, 214, 0.12);
  border-radius: 10px;
  background: #fbf9ff;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #706983;
  font-size: 12px;
  text-align: center;
}

.profile-form {
  min-width: 0;
}

.inline-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 720px) {
  :global(.profile-dialog) {
    width: calc(100vw - 24px) !important;
    margin-top: 3vh !important;
  }

  :global(.profile-dialog .el-dialog__body) {
    max-height: 78vh;
    padding: 14px;
  }

  .profile-card,
  .inline-fields {
    grid-template-columns: 1fr;
  }
}
</style>
