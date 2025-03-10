import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const routes = [
  {path: "/", redirect: "/login"}, 
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
router.beforeEach((to) => {
  const authStore = useAuthStore(); // Lấy store trong mỗi lần điều hướng
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return "/login"; // Chuyển về trang login nếu chưa đăng nhập
  }
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return "/users"; // Nếu đã đăng nhập, chặn truy cập trang login/register
  }
});

export default router;
