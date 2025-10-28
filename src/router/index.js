import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import Dashboard from "../views/Dashboard.vue";
import { useAuthStore } from '../stores/auth'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'LoginRegister',
            component: LoginView
        },
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard
        }
    ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  authStore.initializeAuth()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})


export default router;