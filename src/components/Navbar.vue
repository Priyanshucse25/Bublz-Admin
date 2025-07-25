<template>
    <nav class="navbar flex justify-end items-center p-4 px-6 bg-white shadow-md border-b border-gray-200">
        <div class="relative" ref="dropdownRef">
            <button @click="toggleDropdown" class="flex items-center gap-2 focus:outline-none">
                <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Profile"
                    class="w-10 h-10 rounded-full border"
                />
                <span class="font-medium">Profile</span>
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div
                v-if="dropdownOpen"
                class="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10"
            >
                <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                    Logout
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const dropdownOpen = ref(false)
const dropdownRef = ref(null)

function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value
}

function logout() {
    // Add your logout logic here
    alert('Logged out!')
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdownOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style lang="scss" scoped>
</style>