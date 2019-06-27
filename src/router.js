import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
import Users from '@/views/users/User.vue'
import Right from '@/views/rights/right.vue'
import Role from '@/views/rights/role.vue'

Vue.use(VueRouter)

var router = new VueRouter({
  routes: [

    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/home',
      component: Home,
      redirect: {
        name: 'Welcome'
      },
      children: [
        {
          name: 'Welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'Users',
          path: 'users',
          component: Users
        },
        {
          name: 'Right',
          path: 'right',
          component: Right
        },
        {
          name: 'Role',
          path: 'role',
          component: Role
        }
      ]
    }
  ]
})

export default router
