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
]
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
  // 当前是否登录
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo.roleType == 2) {
      if (to.path.startsWith("/user")) {
        next();
      } else {
        next("/user/dashboard");
      }
    } else if (userInfo.roleType == 1) {
      if (to.path.startsWith("/user")) {
        next("/auth/login");
      } else {
        next();
      }
    } else {
      // roleType 不明确时，清除 token 防止死循环
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      next("/auth/login");
    }
  } else {
    if (to.path.startsWith("/user") || to.path == "/home") {
      // 如果访问后台页面，且没有token，重定向到登录页
      next("/auth/login");
    } else {
      next();
    }
  }
});

export default router;
