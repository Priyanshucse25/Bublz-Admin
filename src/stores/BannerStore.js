import { defineStore } from "pinia";
import { ref } from "vue";
import { makeRequest } from "@/request/request";

export const useBannerStore = defineStore("bannerStore", () => {
  const endpoint = "banners";
  const banners = ref([]);
  const isLoading = ref(false);
  const fetchError = ref(null);
  const createError = ref(null);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);
  const updateError = ref(null);
  const deleteError = ref(null);

  // GET: Fetch all banners
  const fetchBanners = async () => {
    isLoading.value = true;
    fetchError.value = null;

    try {
      const response = await makeRequest(endpoint, "GET");
      if (response?.data?.items) {
        banners.value = response.data.items;
        console.log("📦 Banners fetched:", banners.value);
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

  // POST: Create a new banner
  const createBanner = async (bannerPayload) => {
    isCreating.value = true;
    createError.value = null;

    try {
      const response = await makeRequest(endpoint, "POST", bannerPayload);
      console.log("✅ Banner created successfully:", response);
      await fetchBanners();
    } catch (error) {
      console.error("❌ Error creating banner:", error);
      createError.value = error.message || "Failed to create banner";
    } finally {
      isCreating.value = false;
    }
  };

  // PUT: Update a banner by ID
  const updateBanner = async (id, updatedPayload) => {
    isUpdating.value = true;
    updateError.value = null;

    try {
      const response = await makeRequest(`${endpoint}/${id}`, "PUT", updatedPayload);
      console.log("✏️ Banner updated successfully:", response);
      await fetchBanners();
    } catch (error) {
      console.error("❌ Error updating banner:", error);
      updateError.value = error.message || "Failed to update banner";
    } finally {
      isUpdating.value = false;
    }
  };

  // DELETE: Delete a banner by ID
  const deleteBanner = async (id) => {
    isDeleting.value = true;
    deleteError.value = null;

    try {
      const response = await makeRequest(`${endpoint}/${id}`, "DELETE");
      console.log("🗑️ Banner deleted successfully:", response);
      await fetchBanners();
    } catch (error) {
      console.error("❌ Error deleting banner:", error);
      deleteError.value = error.message || "Failed to delete banner";
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    banners,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    fetchError,
    createError,
    updateError,
    deleteError,
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
  };
});
