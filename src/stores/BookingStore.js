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
          is_available: booking.is_available,
          payment_status: booking.payment_status,
          scheduled_date: booking.scheduled_date,
          service_name: booking.service_name,
          slot_time: booking.slot_time,
          status: booking.status,
          total_payment: booking.total_payment,
          user_name: booking.user_name,
          user_id: booking.user_id,
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

  // ✅ PUT: Update a booking by ID
  const updateBooking = async (id, updatedData) => {
    try {
      const response = await makeRequest(`bookings/${id}`, "PUT", updatedData);
      console.log("✅ Booking updated:", response);

      const index = bookings.value.findIndex((b) => b.booking_id === id);
      if (index !== -1) {
        bookings.value[index] = {
          ...bookings.value[index],
          ...updatedData,
        };
      }

      return response;
    } catch (err) {
      console.error("❌ Error updating booking:", err);
      throw err;
    }
  };

  // ✅ PUT: Assign booking by ID
  const assignBooking = async (id, assignData) => {
    try {
      const response = await makeRequest(`bookings/assign/${id}`, "PUT", assignData);
      console.log("✅ Booking assigned:", response);
      return response;
    } catch (err) {
      console.error("❌ Error assigning booking:", err);
      throw err;
    }
  };

  // ✅ DELETE: Delete a booking by ID
  const deleteBooking = async (id) => {
    try {
      const response = await makeRequest(`bookings/${id}`, "DELETE");
      console.log("🗑️ Booking deleted:", response);
      return response;
    } catch (err) {
      console.error("❌ Error deleting booking:", err);
      throw err;
    }
  };

  return {
    // State
    bookings,
    isLoading,
    error,

    // Actions
    getBookings,
    updateBooking,
    assignBooking,
    deleteBooking,
  };
});
