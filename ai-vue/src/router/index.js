import { createRouter, createWebHistory } from 'vue-router'  
import BackEndLayout from '@/components/backendlayout.vue'

// 路由配置
const BackEndLayoutRoutes = [
    {
        path:'/user',
        component:BackEndLayout,
        children:[
        ]
    }
]  

const router = createRouter({
    history:createWebHistory(),
    routes:BackEndLayoutRoutes
})

export default router


