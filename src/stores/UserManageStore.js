// stores/userStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
import { makeRequest } from "@/request/request";

export const useUserStore = defineStore("userStore", () => {
  // Common state
  const isSendingOtp = ref(false);
  const isVerifyingOtp = ref(false);
  const sendOtpError = ref(null);
  const verifyOtpError = ref(null);
  const otpResponse = ref(null);
  const verifyResponse = ref(null);

  const isSigningUp = ref(false);
  const signupError = ref(null);
  const signupResponse = ref(null);

  const users = ref([]);
  const isLoadingUsers = ref(false);
  const getUsersError = ref(null);
  const isUpdatingUser = ref(false);
  const updateUserError = ref(null);

  const sendOtp = async (payload) => {
    isSendingOtp.value = true;
    sendOtpError.value = null;

    try {
      const response = await makeRequest("send-otp", "POST", payload);
      otpResponse.value = response.data;
      console.log("✅ OTP sent:", response);
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      sendOtpError.value = error.message || "Failed to send OTP";
    } finally {
      isSendingOtp.value = false;
    }
  };

  const verifyOtp = async (payload) => {
    isVerifyingOtp.value = true;
    verifyOtpError.value = null;

    try {
      const response = await makeRequest("verify-otp", "POST", payload);
      verifyResponse.value = response.data;
      console.log("✅ OTP verified:", response);
    } catch (error) {
      console.error("❌ Error verifying OTP:", error);
      verifyOtpError.value = error.message || "Failed to verify OTP";
    } finally {
      isVerifyingOtp.value = false;
    }
  };

  const signup = async (payload) => {
    isSigningUp.value = true;
    signupError.value = null;

    try {
      const response = await makeRequest("signup", "POST", payload);
      signupResponse.value = response.data;
      console.log("✅ Signup successful:", response);
    } catch (error) {
      console.error("❌ Error during signup:", error);
      signupError.value = error.message || "Signup failed";
    } finally {
      isSigningUp.value = false;
    }
  };

  const getUsers = async () => {
    isLoadingUsers.value = true;
    getUsersError.value = null;

    try {
      const response = await makeRequest("users", "GET");
      users.value = response.data;
      console.log("✅ Users fetched:", response);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      getUsersError.value = error.message || "Failed to fetch users";
    } finally {
      isLoadingUsers.value = false;
    }
  };

  // ✅ Updated PUT: Update user profile using `users/:id`
  const updateUserProfile = async (id, payload) => {
    isUpdatingUser.value = true;
    updateUserError.value = null;
    try {
      const response = await makeRequest(`users/${id}`, "PUT", payload);
      console.log("✅ User profile updated:", response);
    } catch (error) {
      console.error("❌ Error updating user profile:", error);
      updateUserError.value = error.message || "Failed to update user";
    } finally {
      isUpdatingUser.value = false;
    }
  };

  // ✅ Updated DELETE: Delete user profile using `users/:id`
  const deleteUserProfile = async (id) => {
    try {
      const response = await makeRequest(`users/${id}`, "DELETE");
      console.log("✅ User profile deleted:", response);
    } catch (error) {
      console.error("❌ Error deleting user profile:", error);
    }
  };

  return {
    // States
    isSendingOtp,
    isVerifyingOtp,
    sendOtpError,
    verifyOtpError,
    otpResponse,
    verifyResponse,

    isSigningUp,
    signupError,
    signupResponse,

    users,
    isLoadingUsers,
    getUsersError,
    isUpdatingUser,
    updateUserError,

    // Actions
    sendOtp,
    verifyOtp,
    signup,
    getUsers,
    updateUserProfile,
    deleteUserProfile,
  };
});
