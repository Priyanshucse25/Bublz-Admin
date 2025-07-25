// stores/bannerStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { makeRequest } from "@/request/request";

export const useBannerStore = defineStore("bannerStore", () => {
  const endpoint = "banners"; // GET endpoint
  const banners = ref([]);
  const isLoading = ref(false);
  const fetchError = ref(null);

  const fetchBanners = async () => {
    isLoading.value = true;
    fetchError.value = null;

    try {
      const response = await makeRequest(endpoint, "GET");
      if (response?.data?.items) {
        banners.value = response.data.items;
        console.log("✅ Banners fetched:", banners.value);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("❌ Error fetching banners:", error);
      fetchError.value = error.message || "Failed to fetch banners";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    banners,
    isLoading,
    fetchError,
    fetchBanners,
  };
});
