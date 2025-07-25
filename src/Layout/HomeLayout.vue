<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <div class="flex flex-1 flex-col overflow-hidden">
      
      <Navbar />

      <main class="flex-1 overflow-y-auto p-0">
        <RouterView />
      </main>
      
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import { RouterView } from 'vue-router';
</script>

<style  scoped>
/* Your component-specific styles can go here */
</style>