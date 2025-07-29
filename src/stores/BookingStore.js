// stores/bookingStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
import { makeRequest } from "@/request/request";

export const useBookingStore = defineStore("bookingStore", () => {
  // State
  const bookings = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

const getBookings = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await makeRequest("bookings", "GET");

    const bookingsData = response?.data;
    if (Array.isArray(bookingsData)) {
      bookings.value = bookingsData.map((booking) => ({
        booking_id: booking.booking_id,
        created_at: booking.created_at,
        employee_name: booking.employee_name,
        payment_status: booking.payment_status,
        scheduled_date: booking.scheduled_date,
        service_name: booking.service_name,
        slot_time: booking.slot_time,
        status: booking.status,
        total_payment: booking.total_payment,
        user_name: booking.user_name,
      }));
      console.log("✅ Bookings fetched:", bookings.value);
    } else {
      console.warn("⚠️ Unexpected response structure:", response);
      bookings.value = [];
    }
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    error.value = err.message || "Failed to fetch bookings";
  } finally {
    isLoading.value = false;
  }
};
  return {
    // State
    bookings,
    isLoading,
    error,

    // Actions
    getBookings,
  };
});
