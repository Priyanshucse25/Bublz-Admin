<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-0 lg:p-0">
    <div class="sticky z-10 top-0   mb-6  border border-gray-200 bg-white p-4 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-800">Customer Reviews</h1>
      <p class="mt-1 text-sm text-gray-500">All feedback and ratings submitted by users.</p>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white shadow-md">
      <div v-if="reviewStore.isLoading" class="p-4">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
            <div class="h-10 w-10 rounded-full bg-gray-200"></div>
            <div class="flex-1 space-y-2 py-1">
              <div class="h-4 w-3/4 rounded bg-gray-200"></div>
              <div class="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="reviewStore.fetchError" class="m-4 rounded-lg border-l-4 border-red-400 bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              Failed to load reviews. Error: <span class="font-medium">{{ reviewStore.fetchError }}</span>
            </p>
          </div>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th class="px-6 py-3">#</th>
              <th class="px-6 py-3">User</th>
              <th class="px-6 py-3">Booking ID</th>
              <th class="px-6 py-3">Message</th>
              <th class="px-6 py-3">Rating</th>
              <th class="px-6 py-3">Photo</th>
              <th class="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white text-sm text-gray-700">
            <tr v-for="(review, index) in reviewStore.reviews" :key="review.id" class="transition-colors hover:bg-gray-50">
              <td class="px-6 py-4 text-gray-500">{{ index + 1 }}</td>
              <td class="px-6 py-4 font-medium text-gray-900">{{ review.user_id }}</td>
              <td class="px-6 py-4 font-mono text-gray-500">{{ review.booking_id }}</td>
              <td class="max-w-sm truncate px-6 py-4" :title="review.message">{{ review.message }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <svg v-for="i in 5" :key="i" class="h-5 w-5" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </td>
              <td class="px-6 py-4">
                <button v-if="review.photo_filename" @click="openPhotoModal(review.photo_filename)" class="text-blue-600 hover:text-blue-800 hover:underline">
                  View Photo
                </button>
                <span v-else class="italic text-gray-400">No photo</span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-500">{{ formatDate(review.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="showPhotoModal" @click.self="closePhotoModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="relative max-h-[90vh] max-w-4xl rounded-lg bg-white p-4 shadow-xl">
          <button @click="closePhotoModal" class="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white transition hover:bg-black">
            &times;
          </button>
          <img :src="photoToShow" alt="User Review Photo" class="h-full w-full rounded-md object-contain" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useReviewStore } from '@/stores/ReviewStore'

const reviewStore = useReviewStore()
const showPhotoModal = ref(false)
const photoToShow = ref('')

onMounted(() => {
  reviewStore.getReviews()
})

/**
 * Builds the full URL for a given photo filename.
 * Replace the base URL with your actual backend/storage URL.
 */
function buildUrl(filename) {
  if (!filename) return ''
  // IMPORTANT: Replace with your actual image base URL from your .env or config
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return `${baseUrl}/uploads/${filename}`
}

/**
 * Opens the photo viewer modal.
 */
function openPhotoModal(filename) {
  photoToShow.value = buildUrl(filename)
  showPhotoModal.value = true
}

/**
 * Closes the photo viewer modal.
 */
function closePhotoModal() {
  showPhotoModal.value = false
  photoToShow.value = ''
}

/**
 * Format date into readable form (e.g., "Aug 05, 2025")
 */
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>