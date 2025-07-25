import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeLayout from '@/Layout/HomeLayout.vue'
import Main from '@/views/Baner/Main.vue'
import CategoryMain from '@/views/Category/Main.vue'
import ServiceMain from '@/views/Service/Main.vue'
import UserMain from '@/views/User/Main.vue'
import BookingMain from '@/views/Booking/Main.vue'
import EmployeesMain from '@/views/Employees/Main.vue'
import FaqMain from '@/views/FAQ/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeLayout,
      children:[
        {
        path: '/',
        name:'Baner',
        component: Main,
      },
       {
        path: '/category',
        name:'category',
        component:CategoryMain,
      },
       {
        path: '/service',
        name:'service',
        component: ServiceMain,
      },
       {
        path: '/users',
        name:'users',
        component:UserMain,
      },
       {
        path: '/bookings',
        name:'Booking',
        component: BookingMain,
      },
       {
        path: '/employees',
        name:'employees',
        component: EmployeesMain,
      },
       {
        path: '/faq',
        name:'FAQ',
        component: FaqMain,
      },
    ]
    },
 
  ],
})

export default router
