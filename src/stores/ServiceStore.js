// stores/serviceStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
import { makeRequest } from "@/request/request";

export const useServiceStore = defineStore("serviceStore", () => {
  // State
  const isSubmitting = ref(false);
  const submitError = ref(null);
  const postResponse = ref(null);
  const isLoading = ref(false);
  const services = ref([]);
  const fetchError = ref(null);

  // POST: Create a new Service
  const createService = async (payload) => {
    isSubmitting.value = true;
    submitError.value = null;

    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("price", payload.price);
    formData.append("category_id", payload.category_id);
    formData.append("description", payload.description);
    formData.append("advantages", payload.advantages);
    formData.append("disadvantages", payload.disadvantages);
    formData.append("offer_price", payload.offer_price);
    formData.append("status", payload.status);
    formData.append("tag", payload.tag);
    formData.append("color", payload.color);
    formData.append("service_charge", payload.service_charge);
    formData.append("image", payload.image);

    try {
      const response = await makeRequest("services", "POST", formData);
      postResponse.value = response.data;
      console.log("✅ Service created:", response.data);
    } catch (err) {
      console.error("❌ Error creating service:", err);
      submitError.value = err.message || "Failed to create service";
    } finally {
      isSubmitting.value = false;
    }
  };

  // GET: Fetch all Services
  const getServices = async () => {
    isLoading.value = true;
    fetchError.value = null;

    try {
      const response = await makeRequest("services", "GET");
      const raw = response.data;
      const serviceArray = Array.isArray(raw) ? raw : [raw];
      services.value = serviceArray.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        offer_price: service.offer_price,
        description: service.description,
        advantages: service.advantages,
        disadvantages: service.disadvantages,
        status: service.status,
        tag: service.tag,
        color: service.color,
        category_id: service.category_id,
        service_charge: service.service_charge,
        image_url: service.image_url,
        created_at: service.created_at,
        updated_at: service.updated_at,
      }));
      console.log("✅ Services fetched:", services.value);
    } catch (err) {
      console.error("❌ Error fetching services:", err);
      fetchError.value = err.message || "Failed to fetch services";
    } finally {
      isLoading.value = false;
    }
  };

  // PUT: Update Service by ID
  const updateService = async (id, payload) => {
    isSubmitting.value = true;
    submitError.value = null;

    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("price", payload.price);
    formData.append("category_id", payload.category_id);
    formData.append("description", payload.description);
    formData.append("advantages", payload.advantages);
    formData.append("disadvantages", payload.disadvantages);
    formData.append("offer_price", payload.offer_price);
    formData.append("status", payload.status);
    formData.append("tag", payload.tag);
    formData.append("color", payload.color);
    formData.append("service_charge", payload.service_charge);
    if (payload.image) {
      formData.append("image", payload.image);
    }

    try {
      const response = await makeRequest(`services/${id}`, "PUT", formData);
      postResponse.value = response.data;
      console.log(`✅ Service ${id} updated:`, response.data);
    } catch (err) {
      console.error(`❌ Error updating service ${id}:`, err);
      submitError.value = err.message || "Failed to update service";
    } finally {
      isSubmitting.value = false;
    }
  };

  // DELETE: Delete Service by ID
  const deleteService = async (id) => {
    isSubmitting.value = true;
    submitError.value = null;

    try {
      const response = await makeRequest(`services/${id}`, "DELETE");
      console.log(`🗑️ Service ${id} deleted:`, response.data);
      // Optionally refetch services list
      await getServices();
    } catch (err) {
      console.error(`❌ Error deleting service ${id}:`, err);
      submitError.value = err.message || "Failed to delete service";
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    // State
    isSubmitting,
    submitError,
    postResponse,
    isLoading,
    fetchError,
    services,

    // Actions
    createService,
    getServices,
    updateService,
    deleteService,
  };
});
