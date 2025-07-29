import { defineStore } from "pinia";
import { ref } from "vue";
import { makeRequest } from "@/request/request";

export const useCategoryStore = defineStore("categoryStore", () => {
  const endpoint = "categories";
  const categories = ref([]);
  const isLoading = ref(false);
  const fetchError = ref(null);
  const postError = ref(null);
  const isPosting = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);
  const updateError = ref(null);
  const deleteError = ref(null);

  // ✅ GET: Fetch all categories
  const fetchCategories = async () => {
    isLoading.value = true;
    fetchError.value = null;

    try {
      const response = await makeRequest(endpoint, "GET");
      if (Array.isArray(response?.data)) {
        categories.value = response.data;
        console.log("✅ Categories fetched:", categories.value);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      fetchError.value = error.message || "Failed to fetch categories";
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ POST: Create a new category
  const createCategory = async (formData) => {
    isPosting.value = true;
    postError.value = null;

    try {
      const response = await makeRequest(endpoint, "POST", formData);
      console.log("✅ Category created:", response);
      await fetchCategories();
    } catch (error) {
      console.error("❌ Error creating category:", error);
      postError.value = error.message || "Failed to create category";
    } finally {
      isPosting.value = false;
    }
  };

  // ✅ PUT: Update a category
  const updateCategory = async (id, updatedData) => {
    isUpdating.value = true;
    updateError.value = null;

    try {
      const response = await makeRequest(`${endpoint}/${id}`, "PUT", updatedData);
      console.log(`✅ Category ${id} updated:`, response);
      await fetchCategories();
    } catch (error) {
      console.error(`❌ Error updating category ${id}:`, error);
      updateError.value = error.message || "Failed to update category";
    } finally {
      isUpdating.value = false;
    }
  };

  // ✅ DELETE: Remove a category
  const deleteCategory = async (id) => {
    isDeleting.value = true;
    deleteError.value = null;

    try {
      const response = await makeRequest(`${endpoint}/${id}`, "DELETE");
      console.log(`✅ Category ${id} deleted:`, response);
      await fetchCategories();
    } catch (error) {
      console.error(`❌ Error deleting category ${id}:`, error);
      deleteError.value = error.message || "Failed to delete category";
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    categories,
    isLoading,
    fetchError,
    fetchCategories,
    createCategory,
    postError,
    isPosting,
    updateCategory,
    isUpdating,
    updateError,
    deleteCategory,
    isDeleting,
    deleteError,
  };
});
