import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import MissionPlanner from '../views/MissionPlanner.vue'
import AboutTeam from '../views/About.vue'
import Setting from '../views/Setting.vue'
import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{sidebar:false}
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{sidebar:false}
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/mission',
    name: 'Mission',
    component: MissionPlanner
  },
  
  {
    path: '/about',
    name: 'AboutTeam',
    component: AboutTeam
  },

  {
    path: '/setting',
    name: 'Setting',
    component: Setting
  },
 
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
