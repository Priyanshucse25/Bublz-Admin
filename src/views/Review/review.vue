<template>
  <div class="min-h-screen bg-gray-50 p-0 ">
    <!-- Page Header -->
    <div class="mb-6 sticky top-0 bg-white shadow-sm z-10 px-4 p-3  border-b border-gray-200">
      <h1 class="text-xl font-bold text-gray-800 ">Customer Reviews</h1>
      <p class="text-gray-600 mt-1">All feedback and ratings submitted by users</p>
    </div>

    <!-- Loading and Error States -->
    <div v-if="reviewStore.isLoading" class="py-12 text-center text-gray-500">Loading reviews...</div>
    <div v-else-if="reviewStore.fetchError" class="text-red-500">
      {{ reviewStore.fetchError }}
    </div>

    <!-- Review Table -->
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
          <tr>
            <th class="px-6 py-3">#</th>
            <th class="px-6 py-3">User ID</th>
            <th class="px-6 py-3">Booking ID</th>
            <th class="px-6 py-3">Message</th>
            <th class="px-6 py-3">Rating</th>
            <th class="px-6 py-3">Photo</th>
            <th class="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm text-gray-800">
          <tr v-for="(review, index) in reviewStore.reviews" :key="review.id">
            <td class="px-6 py-4">{{ index + 1 }}</td>
            <td class="px-6 py-4">{{ review.user_id }}</td>
            <td class="px-6 py-4">{{ review.booking_id }}</td>
            <td class="px-6 py-4">{{ review.message }}</td>
            <td class="px-6 py-4">{{ review.rating }}/5</td>
            <td class="px-6 py-4">
              <span v-if="review.photo_filename" class="text-blue-500 hover:underline cursor-pointer">
                View Photo
              </span>
              <span v-else class="text-gray-400 italic">No photo</span>
            </td>
            <td class="px-6 py-4">{{ formatDate(review.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useReviewStore } from '@/stores/reviewStore'

const reviewStore = useReviewStore()

onMounted(() => {
  reviewStore.getReviews()
})

/**
 * Format date into readable form (e.g., "Jul 25, 2025")
 */
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
