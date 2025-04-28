import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    component: () => import("../views/LoginView.vue"),
    meta: { guestOnly: true }, // chưa đăng nhập
  },
  {
    path: "/register",
    component: () => import("../views/RegisterView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/users",
    component: () => import("../views/UsersView.vue"),
    meta: { requiresAuth: true }, //  đã đăng nhập
  },
  {
    path: "/product",
    component: () => import("../views/ProductView.vue"),
    meta: { requiresAuth: true },
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

//  Navigation Guard kiểm tra quyền truy cập
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  // Khởi tạo trạng thái đăng nhập
  await auth.initializeAuth();
  // Kiểm tra route yêu cầu đăng nhập
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next("/login");
  }
  // Kiểm tra route chỉ dành cho khách
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return next("/users");
  }
  next();
});

export default router;
