import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
import Users from '@/views/users/User.vue'
import Right from '@/views/rights/right.vue'
import Role from '@/views/rights/role.vue'
import Goods from '@/views/goods/goods.vue'
import List from '@/views/goods/list.vue'
import Add from '@/views/goods/add.vue'

Vue.use(VueRouter)

var router = new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: {
        name: 'Home'
      }
    },
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
          path: 'rights',
          component: Right
        },
        {
          name: 'Role',
          path: 'roles',
          component: Role
        },
        {
          name: 'Goods',
          path: 'goods',
          component: Goods,
          redirect: { name: 'List' },
          children: [
            {
              name: 'List',
              path: 'list',
              component: List
            },
            {
              name: 'Add',
              path: 'add',
              component: Add
            }
          ]
        }
      ]
    }

  ]
})

export default router
