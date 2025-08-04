// stores/faqStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
// Assuming makeRequest is in "@/request/request"
import { makeRequest } from "@/request/request";

export const useFaqStore = defineStore("faqStore", () => {
  // State
  const faqs = ref([]);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const error = ref(null);
  const submitError = ref(null);
  const postResponse = ref(null);
  const updateResponse = ref(null);
  const deleteResponse = ref(null);

  // ✅ GET: Fetch all FAQs
  const getFaqs = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await makeRequest("faqs", "GET");

      faqs.value = response.data.map((faq) => ({
        id: faq.id,
        questions: [faq.question], // Convert string to array
        answers: [faq.answer],     // Convert string to array
        status: faq.is_active ? "active" : "inactive",
      }));

      console.log("✅ FAQs fetched and transformed:", faqs.value);
    } catch (err) {
      console.error("❌ Error fetching FAQs:", err);
      error.value = err.message || "Failed to fetch FAQs";
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ POST: Create a new FAQ
  const createFaq = async (payload) => {
    isSubmitting.value = true;
    submitError.value = null;

    const apiPayload = {
      question: payload.questions[0],
      answer: payload.answers[0],
      is_active: payload.status === "active",
    };

    try {
      const response = await makeRequest("faqs", "POST", apiPayload);
      postResponse.value = response.data;
      console.log("✅ FAQ created:", response);
      await getFaqs(); // Refresh the list
    } catch (err) {
      console.error("❌ Error creating FAQ:", err);
      submitError.value = err.message || "Failed to create FAQ";
      throw err; // Re-throw error to be caught in component
    } finally {
      isSubmitting.value = false;
    }
  };

  // ✅ PUT: Update an existing FAQ
  const updateFaq = async (id, payload) => {
    isSubmitting.value = true;
    submitError.value = null;

    const apiPayload = {
      question: payload.questions[0],
      answer: payload.answers[0],
      is_active: payload.status === "active",
    };

    try {
      const response = await makeRequest(`faqs/${id}`, "PUT", apiPayload);
      updateResponse.value = response.data;
      console.log(`✅ FAQ with ID ${id} updated:`, response);
      await getFaqs(); // Refresh the list
    } catch (err) {
      console.error(`❌ Error updating FAQ with ID ${id}:`, err);
      submitError.value = err.message || "Failed to update FAQ";
      throw err; // Re-throw error to be caught in component
    } finally {
      isSubmitting.value = false;
    }
  };

  // ✅ DELETE: Remove an existing FAQ
  const deleteFaq = async (id) => {
    isSubmitting.value = true;
    submitError.value = null;

    try {
      const response = await makeRequest(`faqs/${id}`, "DELETE");
      deleteResponse.value = response.data;
      console.log(`✅ FAQ with ID ${id} deleted:`, response);
      await getFaqs(); // Refresh the list
    } catch (err) {
      console.error(`❌ Error deleting FAQ with ID ${id}:`, err);
      submitError.value = err.message || "Failed to delete FAQ";
      throw err; // Re-throw error to be caught in component
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    // State
    faqs,
    isLoading,
    isSubmitting,
    error,
    submitError,
    postResponse,
    updateResponse,
    deleteResponse,

    // Actions
    getFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
  };
});