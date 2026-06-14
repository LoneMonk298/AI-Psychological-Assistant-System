import { createRouter, createWebHistory } from "vue-router";
import BackEndLayout from "@/components/BackendLayout.vue";
import AuthLayout from "@/components/Authlayout.vue";
import UserLayout from "@/components/UserLayout.vue";

// 路由配置-嵌套路由
const BackEndLayoutRoutes = [
  {
    path: "/user",
    redirect: "/user/dashboard",
    component: BackEndLayout,
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard.vue"),
        meta: {
          title: "数据分析",
          icon: "PieChart",
        },
      },
      {
        path: "knowledge",
        component: () => import("@/views/knowledge.vue"),
        meta: {
          title: "知识文章",
          icon: "ChatLineSquare",
        },
      },
      {
        path: "consultations",
        component: () => import("@/views/consultations.vue"),
        meta: {
          title: "咨询记录",
          icon: "Message",
        },
      },
      {
        path: "emotion",
        component: () => import("@/views/emotion.vue"),
        meta: {
          title: "情绪日志",
          icon: "User",
        },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        component: () => import("@/views/login.vue"),
        meta: {
          title: "登录",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/views/index.vue"),
  },
];
const UserLayoutRoutes = [
  {
    path: "/customer",
    redirect: "/customer/home",
    component: UserLayout,
    children: [
      {
        path: "home",
        component: () => import("@/views/home.vue"),
        meta: {
          title: "用户首页",
        },
      },
      {
        path: "chat",
        name: "CustomerChat",
        component: () => import("@/views/chat.vue"),
        meta: {
          title: "AI咨询",
          keepAlive: true,
        },
      },
      {
        path: "knowledge",
        component: () => import("@/views/frontendKnowledge.vue"),
        meta: {
          title: "知识库",
          keepAlive: true,
        },
      },
      {
        path: 'knowledge/article/:id',
        component: () => import("@/views/articleDetail.vue"),
        props:true
      },
      {
        path: "emotionDiary",
        component: () => import("@/views/emotionDiary.vue"),
        meta: {
          title: "情绪日志",
          keepAlive: true,
        },
      }
    ],
  },
];

// 路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [...BackEndLayoutRoutes, ...UserLayoutRoutes],
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
      const roleType = parseInt(userInfo.roleType);
      if (!isNaN(roleType)) {
        if (roleType === 2) {
          // 管理员可以访问后台页面和前台知识库相关页面
          if (to.path.startsWith("/user") || to.path.startsWith("/customer/knowledge")) {
            next();
          } else if (to.path.startsWith("/customer")) {
            // 管理员访问其他前台页面时，重定向到后台
            next("/user/dashboard");
          } else {
            next("/user/dashboard");
          }
        } else if (roleType === 1) {
          // 普通用户可以访问前台页面
          if (to.path.startsWith("/user")) {
            next("/customer/home");
          } else {
            next();
          }
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          next("/auth/login");
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        next("/auth/login");
      }
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      next("/auth/login");
    }
  } else {
    if (to.path.startsWith("/user") || to.path == "/home") {
      next("/auth/login");
    } else {
      next();
    }
  }
});

export default router;
