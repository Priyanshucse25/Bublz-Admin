// stores/transactionStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
import { makeRequest } from "@/request/request";

export const useTransactionStore = defineStore("transactionStore", () => {
  // State
  const payments = ref([]);
  const isLoadingPayments = ref(false);
  const getPaymentsError = ref(null);

  // GET: Fetch all transactions
  const getPayments = async () => {
    isLoadingPayments.value = true;
    getPaymentsError.value = null;

    try {
      const response = await makeRequest("payments", "GET");
      
      // --- FIX IS HERE ---
      // Your response object is { data: [...], ... }
      // The array is in `response.data`, not `response.data.data`
      payments.value = response.data || [];

      console.log("✅ Payments fetched and assigned to store:", payments.value);
    } catch (error) {
      console.error("❌ Error fetching payments:", error);
      getPaymentsError.value = error.message || "Failed to fetch payments";
    } finally {
      isLoadingPayments.value = false;
    }
  };

  return {
    payments,
    isLoadingPayments,
    getPaymentsError,
    getPayments,
  };
});