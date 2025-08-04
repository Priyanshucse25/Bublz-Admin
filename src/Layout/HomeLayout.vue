<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Static Sidebar for Desktop (hidden on mobile) -->
    <Sidebar class="hidden lg:flex" />

    <!-- Mobile Sidebar (appears as an overlay) -->
    <Transition name="slide">
      <div v-if="isSidebarOpen" class="fixed inset-0 z-50 lg:hidden">
        <!-- Listens for the 'link-clicked' event to close itself -->
        <Sidebar @link-clicked="closeSidebar" />
      </div>
    </Transition>
    
    <!-- Backdrop for Mobile Sidebar (closes sidebar on click) -->
    <div v-if="isSidebarOpen" @click="closeSidebar" class="fixed inset-0 z-40 bg-black/30 lg:hidden"></div>

    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Listens for the 'toggle-sidebar' event from the Navbar -->
      <Navbar @toggle-sidebar="toggleSidebar" />

      <main class="flex-1 overflow-y-auto p-0">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import { RouterView } from 'vue-router';

// State to control the mobile sidebar's visibility
const isSidebarOpen = ref(false);

// Function to open/close the sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Function to ensure the sidebar closes
const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<style scoped>
/* Transition for the mobile sidebar sliding in and out */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>