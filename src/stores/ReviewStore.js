// stores/reviewStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { makeRequest } from '@/request/request'

export const useReviewStore = defineStore('reviewStore', () => {
  const reviews = ref([])
  const isLoading = ref(false)
  const fetchError = ref(null)

  const getReviews = async () => {
    isLoading.value = true
    fetchError.value = null

    try {
      const response = await makeRequest('reviews', 'GET')

      // Assuming response format is: { data: [...], message: '...', status: 'success' }
      reviews.value = response.data || []
    } catch (error) {
      fetchError.value = error?.response?.data?.message || 'Failed to fetch reviews'
    } finally {
      isLoading.value = false
    }
  }

  return {
    reviews,
    isLoading,
    fetchError,
    getReviews
  }
})
