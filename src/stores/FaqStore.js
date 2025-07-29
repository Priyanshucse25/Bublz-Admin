// stores/faqStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
import { makeRequest } from "@/request/request";

export const useFaqStore = defineStore("faqStore", () => {
  // State
  const faqs = ref([]);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const error = ref(null);
  const submitError = ref(null);
  const postResponse = ref(null);

  // GET: Fetch all FAQs
  const getFaqs = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await makeRequest("faqs", "GET");
      
      // ✅ FIX: Transform the raw API data to match the component's expected structure
      faqs.value = response.data.map(faq => ({
        id: faq.id,
        questions: [faq.question], // Convert string to array
        answers: [faq.answer],     // Convert string to array
        status: faq.is_active ? 'active' : 'inactive' // Convert boolean to string
      }));

      console.log("✅ FAQs fetched and transformed:", faqs.value);
    } catch (err) {
      console.error("❌ Error fetching FAQs:", err);
      error.value = err.message || "Failed to fetch FAQs";
    } finally {
      isLoading.value = false;
    }
  };

  // POST: Create a new FAQ
  const createFaq = async (payload) => {
    isSubmitting.value = true;
    submitError.value = null;

    // ✅ FIX: Transform component data to match the API's expected structure
    const apiPayload = {
        question: payload.questions[0], // Convert array to string
        answer: payload.answers[0],     // Convert array to string
        is_active: payload.status === 'active' // Convert string to boolean
    };

    try {
      const response = await makeRequest("faqs", "POST", apiPayload);
      postResponse.value = response.data;
      console.log("✅ FAQ created:", response);
    } catch (err) {
      console.error("❌ Error creating FAQ:", err);
      submitError.value = err.message || "Failed to create FAQ";
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    // States
    faqs,
    isLoading,
    isSubmitting,
    error,
    submitError,
    postResponse,

    // Actions
    getFaqs,
    createFaq,
  };
});