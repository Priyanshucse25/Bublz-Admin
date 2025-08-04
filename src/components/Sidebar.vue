<template>
  <div class="flex h-full w-63 flex-col border-r border-gray-200 bg-white pt-6 shadow-md">
    <div class="w-full border-b border-gray-200 px-6 pb-5">
      <img src="@/assets/LOGO.png" alt="Logo" class="mx-auto block h-auto w-30" />
    </div>

    <ul class="flex-grow list-none p-0 px-3 pt-4">
      <li v-for="item in navItems" :key="item.name">
        <RouterLink
          :to="item.to"
          @click="$emit('link-clicked')"
          class="mb-2 flex items-center rounded-lg px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-200 hover:text-black"
          :class="{ 'bg-blue-500 font-semibold text-white shadow-sm': isActive(item.to) }"
        >
          <i :class="item.icon" class="mr-2 text-sm"></i>
          <span>{{ item.name }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

// Define the event that this component can emit
defineEmits(['link-clicked']);

const route = useRoute()

const navItems = [
  { name: 'Banner Management', to: '/', icon: 'pi pi-images' },
  { name: 'Category', to: '/category', icon: 'pi pi-tags' },
  { name: 'Service Management', to: '/service', icon: 'pi pi-briefcase' },
  { name: 'User Management', to: '/users', icon: 'pi pi-users' },
  { name: 'Booking Management', to: '/bookings', icon: 'pi pi-calendar-plus' },
  { name: 'Employee Management', to: '/employees', icon: 'pi pi-id-card' },
  { name: 'FAQ', to: '/faq', icon: 'pi pi-question-circle' },
  { name: 'Review Management', to: '/review', icon: 'pi pi-comment' },
  { name: 'Transaction', to: '/transaction', icon: 'pi pi-money-bill' },
]

const isActive = (path) => {
  return route.path === path
}
</script>
