import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { 
    path: "/login", 
    component: () => import("../views/LoginView.vue"),
    meta: { guestOnly: true }, //  chưa đăng nhập
  },
  { 
    path: "/register", 
    component: () => import("../views/RegisterView.vue"),
    meta: { guestOnly: true }, //  chưa đăng nhập
  },
  {
    path: "/dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true }, // đã đăng nhập
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../components/common/NotFoundForm.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//  Navigation Guard  kiểm tra quyền truy cập
router.beforeEach((to) => {
  const authStore = useAuthStore();
  //nếu chưa đăng nhập thì sẽ chuyển về trang login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return "/login";
  }
  // nếu đã đăng nhập thì không thể về trang login đc
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return "/dashboard";
  }
});

export default router;
