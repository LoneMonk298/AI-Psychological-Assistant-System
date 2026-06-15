import { createRouter, createWebHistory } from "vue-router";
import BackEndLayout from "@/components/BackendLayout.vue";
import AuthLayout from "@/components/Authlayout.vue";
import UserLayout from "@/components/UserLayout.vue";

const clearAuthState = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("privacyAccepted");
};

const getRoleType = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return Number(userInfo.roleType ?? userInfo.userType);
  } catch {
    return NaN;
  }
};

const publicKnowledgeRoutes = [
  {
    path: "/knowledge",
    name: "PublicKnowledge",
    component: () => import("@/views/frontendKnowledge.vue"),
    meta: {
      title: "知识库",
      public: true,
    },
  },
  {
    path: "/knowledge/article/:id",
    name: "PublicKnowledgeArticle",
    component: () => import("@/views/articleDetail.vue"),
    props: true,
    meta: {
      title: "文章详情",
      public: true,
    },
  },
];

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
    name: "Index",
    component: () => import("@/views/index.vue"),
    meta: {
      public: true,
    },
  },
  ...publicKnowledgeRoutes,
];

const UserLayoutRoutes = [
  {
    path: "/customer",
    redirect: "/customer/home",
    component: UserLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "home",
        component: () => import("@/views/home.vue"),
        meta: {
          title: "用户首页",
          requiresAuth: true,
        },
      },
      {
        path: "chat",
        name: "CustomerChat",
        component: () => import("@/views/chat.vue"),
        meta: {
          title: "AI咨询",
          keepAlive: true,
          requiresAuth: true,
        },
      },
      {
        path: "knowledge",
        name: "CustomerKnowledge",
        component: () => import("@/views/frontendKnowledge.vue"),
        meta: {
          title: "知识库",
          keepAlive: true,
          requiresAuth: true,
        },
      },
      {
        path: "knowledge/article/:id",
        name: "CustomerKnowledgeArticle",
        component: () => import("@/views/articleDetail.vue"),
        props: true,
        meta: {
          title: "文章详情",
          requiresAuth: true,
        },
      },
      {
        path: "emotionDiary",
        component: () => import("@/views/emotionDiary.vue"),
        meta: {
          title: "情绪日志",
          keepAlive: true,
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...BackEndLayoutRoutes, ...UserLayoutRoutes],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (!token) {
    if (to.path.startsWith("/customer/knowledge")) {
      next({
        path: to.path.replace(/^\/customer\/knowledge/, "/knowledge"),
        query: to.query,
        hash: to.hash,
        replace: true,
      });
      return;
    }

    if (to.path.startsWith("/customer") || to.path.startsWith("/user")) {
      next({ path: "/auth/login", query: { redirect: to.fullPath }, replace: true });
      return;
    }

    next();
    return;
  }

  const roleType = getRoleType();
  if (Number.isNaN(roleType)) {
    clearAuthState();
    next({ path: "/auth/login", replace: true });
    return;
  }

  if (roleType === 2) {
    if (to.path.startsWith("/user") || to.path.startsWith("/knowledge") || to.path.startsWith("/customer/knowledge")) {
      next();
      return;
    }

    if (to.path.startsWith("/customer") || to.path.startsWith("/auth")) {
      next({ path: "/user/dashboard", replace: true });
      return;
    }

    next();
    return;
  }

  if (roleType === 1) {
    if (to.path.startsWith("/user")) {
      next({ path: "/customer/home", replace: true });
      return;
    }

    if (to.path === "/auth/login") {
      next({ path: "/customer/home", replace: true });
      return;
    }

    next();
    return;
  }

  clearAuthState();
  next({ path: "/auth/login", replace: true });
});

export default router;
