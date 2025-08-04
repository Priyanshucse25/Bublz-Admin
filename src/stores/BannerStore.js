import { defineStore } from "pinia";
import { ref } from "vue";
import { makeRequest } from "@/request/request";

export const useBannerStore = defineStore("bannerStore", () => {
  // --- STATE FOR BANNERS ---
  const bannerEndpoint = "banners";
  const banners = ref([]);
  const isLoading = ref(false); // For banner fetching
  const fetchError = ref(null); // For banner fetching
  const createError = ref(null);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);
  const updateError = ref(null);
  const deleteError = ref(null);

  // --- STATE FOR SERVICE SLUGS ---
  const slugsEndpoint = "services/slugs";
  const slugs = ref([]);
  const isSlugsLoading = ref(false); // Separate loading state for slugs
  const slugsFetchError = ref(null); // Separate error state for slugs

  // --- ACTIONS FOR BANNERS ---

  // GET: Fetch all banners
  const fetchBanners = async () => {
    isLoading.value = true;
    fetchError.value = null;

    try {
      const response = await makeRequest(bannerEndpoint, "GET");
      if (response?.data?.items) {
        banners.value = response.data.items;
        console.log("📦 Banners fetched:", banners.value);
      } else {
        throw new Error("Unexpected response format for banners");
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
      const response = await makeRequest(bannerEndpoint, "POST", bannerPayload);
      console.log("✅ Banner created successfully:", response);
      await fetchBanners(); // Refresh the banner list
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
      const response = await makeRequest(`${bannerEndpoint}/${id}`, "PUT", updatedPayload);
      console.log("✏️ Banner updated successfully:", response);
      await fetchBanners(); // Refresh the banner list
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
      const response = await makeRequest(`${bannerEndpoint}/${id}`, "DELETE");
      console.log("🗑️ Banner deleted successfully:", response);
      await fetchBanners(); // Refresh the banner list
    } catch (error) {
      console.error("❌ Error deleting banner:", error);
      deleteError.value = error.message || "Failed to delete banner";
    } finally {
      isDeleting.value = false;
    }
  };

  // --- ACTIONS FOR SERVICE SLUGS ---

  /**
   * Fetches service slugs from the API based on a search query.
   * @param {string} searchQuery - The term to search for.
   */
  const fetchServiceSlugs = async (searchQuery) => {
    isSlugsLoading.value = true;
    slugsFetchError.value = null;
    slugs.value = [];

    if (!searchQuery) {
      isSlugsLoading.value = false;
      return;
    }

    try {
      const fullEndpoint = `${slugsEndpoint}?search=${searchQuery}`;
      const response = await makeRequest(fullEndpoint, "GET");

      if (response?.data) {
        slugs.value = response.data;
        console.log("📦 Service slugs fetched:", slugs.value);
      } else {
        throw new Error("Unexpected response format for slugs");
      }
    } catch (error) {
      console.error("❌ Error fetching service slugs:", error);
      slugsFetchError.value = error.message || "Failed to fetch service slugs";
    } finally {
      isSlugsLoading.value = false;
    }
  };


  // --- RETURN ---
  return {
    // Banner related
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

    // Service Slug related
    slugs,
    isSlugsLoading,
    slugsFetchError,
    fetchServiceSlugs,
  };
});