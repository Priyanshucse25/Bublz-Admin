// stores/employeeStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
import { makeRequest } from "@/request/request";

export const useEmployeeStore = defineStore("employeeStore", () => {
  // State
  const isSubmitting = ref(false);
  const isLoading = ref(false);
  const submitError = ref(null);
  const fetchError = ref(null);
  const responseData = ref(null);
  const employees = ref([]);
  const updateError = ref(null);
  const deleteError = ref(null);
  const isUpdating = ref(false);
  const isDeleting = ref(false);

  // POST: Send OTP
  const sendOtp = async (email) => {
    isSubmitting.value = true;
    submitError.value = null;

    try {
      const response = await makeRequest("employee/send-otp", "POST", { email });
      responseData.value = response.data;
      console.log("✅ OTP sent:", response.data);
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      submitError.value = err.message || "Failed to send OTP";
    } finally {
      isSubmitting.value = false;
    }
  };

  // POST: Verify OTP
  const verifyOtp = async ({ email, otp }) => {
    isSubmitting.value = true;
    submitError.value = null;

    try {
      const response = await makeRequest("employee/verify-otp", "POST", {
        email,
        otp,
      });
      responseData.value = response.data;
      console.log("✅ OTP verified:", response.data);
    } catch (err) {
      console.error("❌ Error verifying OTP:", err);
      submitError.value = err.message || "Failed to verify OTP";
    } finally {
      isSubmitting.value = false;
    }
  };

  // POST: Signup
  const signupEmployee = async (payload) => {
    isSubmitting.value = true;
    submitError.value = null;

    try {
      const response = await makeRequest("employee/signup", "POST", payload);
      responseData.value = response.data;
      console.log("✅ Employee signed up:", response.data);
    } catch (err) {
      console.error("❌ Error signing up employee:", err);
      submitError.value = err.message || "Failed to signup employee";
    } finally {
      isSubmitting.value = false;
    }
  };

  // GET: Fetch all employees
  const getEmployees = async () => {
    isLoading.value = true;
    fetchError.value = null;

    try {
      const response = await makeRequest("employee", "GET");

      const items = response?.data?.items;
      if (Array.isArray(items)) {
        employees.value = items.map((item) => ({
          id: item.id,
          user_id: item.user_id,
          name: item.user?.name,
          email: item.user?.email,
          phone: item.user?.phone,
          address: item.user?.address,
          specialization: item.specialization,
          experience_years: item.experience_years,
          rating: item.rating,
          service_area: item.service_area,
          is_available: item.is_available,
          role: item.user?.role,
          status: item.user?.status,
        }));
        console.log("✅ Employees fetched:", employees.value);
      } else {
        console.warn("⚠️ Unexpected response structure:", response);
        employees.value = [];
      }
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
      fetchError.value = err.message || "Failed to fetch employees";
    } finally {
      isLoading.value = false;
    }
  };

  // PUT: Update employee by ID
  const updateEmployee = async (id, payload) => {
    isUpdating.value = true;
    updateError.value = null;

    try {
      const response = await makeRequest(`employee/${id}`, "PUT", payload);
      responseData.value = response.data;
      console.log("✏️ Employee updated:", response.data);
      await getEmployees();
    } catch (err) {
      console.error("❌ Error updating employee:", err);
      updateError.value = err.message || "Failed to update employee";
    } finally {
      isUpdating.value = false;
    }
  };

  // DELETE: Delete employee by ID
  const deleteEmployee = async (id) => {
    isDeleting.value = true;
    deleteError.value = null;

    try {
      const response = await makeRequest(`employee/${id}`, "DELETE");
      console.log("🗑️ Employee deleted:", response.data);
      await getEmployees();
    } catch (err) {
      console.error("❌ Error deleting employee:", err);
      deleteError.value = err.message || "Failed to delete employee";
    } finally {
      isDeleting.value = false;
    }
  };

  return {
    // State
    isSubmitting,
    isLoading,
    submitError,
    fetchError,
    responseData,
    employees,
    updateError,
    deleteError,
    isUpdating,
    isDeleting,

    // Actions
    sendOtp,
    verifyOtp,
    signupEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee,
  };
});
