import { createRouter, createWebHistory } from 'vue-router';

const websiteName = 'TradeTrove';

const routes = [
   {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: `Главная | ${websiteName}` },
   },
   {
      path: '/about',
      name: 'about',
      meta: { title: 'О нас' },
      component: () => import('../views/AboutView.vue'),
   },
   {
      path: '/login',
      name: 'login',
      meta: { title: 'Авторизация' },
      component: () => import('../views/LoginView.vue'),
   },
   {
      path: '/register',
      name: 'register',
      meta: { title: 'Регистрация' },
      component: () => import('../views/RegisterView.vue'),
   },
   {
      path: '/restore',
      name: 'restore',
      meta: { title: 'Восстановить пароль' },
      component: () => import('../views/RestoreView.vue'),
   },
   {
      path: '/post/create',
      name: 'post-create',
      meta: { title: 'Создать объявление' },
      component: () => import('../views/CreatePostView.vue'),
   },
];

const router = createRouter({
   history: createWebHistory(process.env.BASE_URL),
   routes,
});

export default router;
