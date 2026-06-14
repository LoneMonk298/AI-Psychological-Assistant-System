<template>
    <div class="login-wrapper">
        <div class="login-page">
            <div class="container" :class="{ active: isRegister }">
                <!-- 左侧欢迎区域 -->
                <div class="welcome-box">
                    <h2>{{ isRegister ? 'HelloFriend!' : 'Welcome!' }}</h2>
                    <p>{{ isRegister ? '已有账号？点击下方按钮登录你的账号，享受更多功能。' : '还没有账号？点击下方按钮注册你的账号，加入我们，开始使用心理健康助手吧！' }}</p>
                    <button @click="toggleMode">
                        {{ isRegister ? 'Login' : 'Register' }}
                    </button>
                </div>

                <!-- 右侧表单区域 -->
                <div class="form-box">
                    <!-- 关闭按钮 -->
                    <div class="close-btn" @click="goHome">×</div>
                    
                    <!-- 表单切换区域 -->
                    <Transition name="fade" mode="out-in">
                        <!-- 登录表单 -->
                        <div class="form-content" v-if="!isRegister" key="login">
                            <h1>登录账号</h1>
                            <el-form
                                ref="loginFormRef"
                                :model="loginData"
                                :rules="loginRules"
                                label-position="top"
                                @submit.prevent="handleLogin"
                            >
                                <el-form-item prop="username">
                                    <el-input 
                                        v-model="loginData.username" 
                                        size="large" 
                                        placeholder="Account"
                                    />
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input 
                                        v-model="loginData.password" 
                                        size="large" 
                                        type="password" 
                                        show-password 
                                        placeholder="Password"
                                    />
                                </el-form-item>
                                <el-form-item>
                                    <div class="captcha-group">
                                        <el-input 
                                            v-model="loginData.captcha" 
                                            size="large" 
                                            placeholder="Verification Code"
                                        />
                                        <div class="captcha-img" @click="refreshCaptcha">
                                            {{ captchaCode }}
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item>
                                    <button type="submit" class="submit-btn" :disabled="loginLoading">
                                        {{ loginLoading ? '登录中...' : 'Login' }}
                                    </button>
                                </el-form-item>
                            </el-form>
                        </div>

                        <!-- 注册表单 -->
                        <div class="form-content" v-else key="register">
                            <h1>注册账号</h1>
                            <el-form
                                ref="registerFormRef"
                                :model="registerData"
                                :rules="registerRules"
                                label-position="top"
                                @submit.prevent="handleRegister"
                            >
                                <el-form-item prop="username">
                                    <el-input 
                                        v-model="registerData.username" 
                                        size="large" 
                                        placeholder="用户名"
                                    />
                                </el-form-item>
                                <el-form-item prop="email">
                                    <el-input 
                                        v-model="registerData.email" 
                                        size="large" 
                                        placeholder="邮箱"
                                    />
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input 
                                        v-model="registerData.password" 
                                        size="large" 
                                        type="password" 
                                        show-password 
                                        placeholder="密码"
                                    />
                                </el-form-item>
                                <el-form-item prop="confirmPassword">
                                    <el-input 
                                        v-model="registerData.confirmPassword" 
                                        size="large" 
                                        type="password" 
                                        show-password 
                                        placeholder="确认密码"
                                    />
                                </el-form-item>
                                <el-form-item>
                                    <div class="captcha-group">
                                        <el-input 
                                            v-model="registerData.captcha" 
                                            size="large" 
                                            placeholder="验证码"
                                        />
                                        <div class="captcha-img" @click="refreshCaptcha">
                                            {{ captchaCode }}
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item>
                                    <button type="submit" class="submit-btn" :disabled="registerLoading">
                                        {{ registerLoading ? '注册中...' : 'Register' }}
                                    </button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '@/api/admin'

const router = useRouter()

// 模式切换
const isRegister = ref(false)
const toggleMode = () => {
    isRegister.value = !isRegister.value
    refreshCaptcha()
}

// 登录表单
const loginFormRef = ref()
const loginLoading = ref(false)
const loginData = reactive({
    username: '',
    password: '',
    captcha: ''
})

const loginRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
})

// 注册表单
const registerFormRef = ref()
const registerLoading = ref(false)
const registerData = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: ''
})

const validateConfirmPassword = (rule, value, callback) => {
    if (value !== registerData.password) {
        callback(new Error('两次输入密码不一致'))
    } else {
        callback()
    }
}

const registerRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码至少6个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
})

// 验证码
const captchaCode = ref('')
const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTWXY23456789'
    let code = ''
    for(let i=0; i<4; i++){
        code += chars[Math.floor(Math.random() * chars.length)]
    }
    captchaCode.value = code
}
refreshCaptcha()

// 登录处理
const handleLogin = async () => {
    if (!loginFormRef.value) return
    
    await loginFormRef.value.validate((valid) => {
        if (!valid) return
        
        // 验证码校验（本地）
        if (loginData.captcha.toUpperCase() !== captchaCode.value.toUpperCase()) {
            alert('验证码错误')
            refreshCaptcha()
            return
        }
        
        loginLoading.value = true
        
        login(loginData).then(res => {
            let token = null
            let userInfo = null
            
            if (res && (res.code === 200 || res.code === '200')) {
                if (res.data && res.data.token) {
                    token = res.data.token
                    userInfo = res.data.userInfo || res.data
                } else if (res.token) {
                    token = res.token
                    userInfo = res.userInfo || res
                }
            }
            
            if (token) {
                localStorage.setItem('token', token)
                localStorage.setItem('userInfo', JSON.stringify(userInfo || {}))
                
                if (userInfo && (userInfo.userType === 2 || userInfo.roleType === 2 || userInfo.roleType === '2')) {
                    router.push('/user/dashboard')
                } else {
                    router.push('/customer/home')
                }
            } else {
                alert('登录失败：未获取到 token')
            }
        }).catch(err => {
            console.error('登录错误:', err)
            alert('登录失败')
        }).finally(() => {
            loginLoading.value = false
        })
    })
}

// 注册处理
const handleRegister = async () => {
    if (!registerFormRef.value) return
    
    await registerFormRef.value.validate((valid) => {
        if (!valid) return
        
        // 验证码校验（本地）
        if (registerData.captcha.toUpperCase() !== captchaCode.value.toUpperCase()) {
            alert('验证码错误')
            refreshCaptcha()
            return
        }
        
        registerLoading.value = true
        
        register({
            username: registerData.username,
            email: registerData.email,
            password: registerData.password
        }).then(res => {
            alert('注册成功！请登录')
            isRegister.value = false
            loginData.username = registerData.username
            registerData.username = ''
            registerData.email = ''
            registerData.password = ''
            registerData.confirmPassword = ''
            registerData.captcha = ''
        }).catch(err => {
            console.error('注册错误:', err)
            alert('注册失败')
        }).finally(() => {
            registerLoading.value = false
        })
    })
}

// 返回首页
const goHome = () => {
    router.push('/')
}
</script>

<style lang="scss" scoped>
.login-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(200deg, #f3e7e9, #e3eeff);
    background-image: url('@/assets/bg.png');
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.login-page {
    width: 900px;
    height: 580px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(136, 96, 208, 0.15);
    border: 1px solid rgba(255,255,255,0.5);
    overflow: hidden;
    position: relative;
}

.container {
    width: 100%;
    height: 100%;
    display: flex;
}

/* 左侧欢迎栏 */
.welcome-box {
    width: 450px;
    height: 100%;
    background: url('@/assets/login-bg.jpg') no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    padding: 2rem;
    transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
    position: relative;
}

.welcome-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(162, 143, 207, 0.7);
}

.welcome-box h2 {
    font-size: 2.5rem;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
    margin-top: 45px;
    position: relative;
    z-index: 1;
    /* 文字跳动动画 */
    text-shadow: 0 0 10px rgba(255, 180, 255, 0.6), 0 0 20px rgba(255,120,255,0.4);
    animation: textBounce 2s ease-in-out infinite;
}

.welcome-box p {
    font-size: 1rem;
    letter-spacing: 1px;
    text-align: center;
    margin-bottom: 2rem;
    line-height: 1.6;
    position: relative;
    z-index: 1;
    text-shadow: 0 0 8px rgba(255,255,255,0.5);
    animation: textBounce 2s ease-in-out infinite 0.3s;
}

.welcome-box button {
    padding: 12px 40px;
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 25px;
    background: rgba(255,255,255,0.2);
    color: #fff;
    font-size: 1rem;
    letter-spacing: 1px;
    cursor: pointer;
    transition: 0.3s;
    position: relative;
    z-index: 1;
    animation: textBounce 2s ease-in-out infinite 0.6s;
}

.welcome-box button:hover {
    background: rgba(255,255,255,0.3);
    transform: scale(1.05);
}

/* 右侧表单栏 */
.form-box {
    width: 450px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: #f0f4ff;
    position: relative;
    transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.form-box h1 {
    font-size: 2rem;
    color: #332a2a;
    margin-bottom: 2rem;
    letter-spacing: 2px;
    text-align: center;
}

.form-content {
    width: 100%;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 表单输入框 */
:deep(.el-form-item) {
    margin-bottom: 1.2rem;
}

:deep(.el-input__wrapper) {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    padding: 4px 15px;
}

:deep(.el-input__inner) {
    height: 44px;
    font-size: 0.95rem;
}

/* 验证码行 */
.captcha-group {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
}

.captcha-group :deep(.el-input) {
    flex: 1;
}

.captcha-img {
    padding: 10px 14px;
    background: #f5e6e8;
    border-radius: 10px;
    font-size: 1.1rem;
    letter-spacing: 2px;
    user-select: none;
    transition: 0.3s;
    cursor: pointer;
    color: #9b59b6;
    min-width: 70px;
    text-align: center;
}

.captcha-img:hover {
    transform: scale(1.05);
    background: #f0d4d8;
}

/* 提交按钮 */
.submit-btn {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 30px;
    background: linear-gradient(45deg, #a88beb, #f8ceec);
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 1px;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 4px 12px rgba(168, 139, 235, 0.3);
    margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(168, 139, 235, 0.4);
    background: linear-gradient(45deg, #a888f1, #f5b8e8);
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* 关闭按钮 */
.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ccc;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: 0.3s;
}

.close-btn:hover {
    background: #999;
    transform: rotate(90deg);
}

/* 切换动画样式 */
.container.active .welcome-box {
    transform: translateX(100%);
}

.container.active .form-box {
    transform: translateX(-100%);
}

/* 文字跳动动画 */
@keyframes textBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

</style>
