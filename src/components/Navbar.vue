<template>
  <nav class="navbar flex items-center justify-end p-3 px-6 bg-white shadow-md border-b border-gray-200">
    <!-- Hamburger Icon (Mobile Only) -->
     <div class="justify-between flex w-full lg:w-auto">
    <button @click="$emit('toggle-sidebar')" class="focus:outline-none lg:hidden">
      <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    </div>
    
    <!-- Spacer to push profile to the right on desktop -->
    <div class="hidden lg:flex-grow"></div>

    <!-- Profile Dropdown -->
    <div v-if="loginStore.token" class="relative" ref="dropdownRef">
      <button @click="toggleDropdown" class="flex items-center gap-2 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          class="w-10 h-10 rounded-full border-2 border-gray-200"
        />
        <span class="font-medium text-gray-700 hidden sm:block capitalize">{{ userRole }}</span>
        <svg class="w-5 h-5 ml-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg py-1 z-50"
        >
          <div class="px-4 py-3 border-b border-gray-200">
            <p class="font-semibold text-gray-800">Logged in as:</p>
            <p class="text-md text-gray-600 capitalize">{{ userRole }} </p>
          </div>
          
          <div class="py-1">
            <button
              @click="handleLogout"
              class="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              <svg class="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Logout
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/login';

// Define the event that this component can emit
defineEmits(['toggle-sidebar']);

const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const loginStore = useLoginStore();
const router = useRouter();

const userRole = computed(() => loginStore.role || 'admin');

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function handleLogout() {
  loginStore.logoutUser();
  router.push('/login');
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>