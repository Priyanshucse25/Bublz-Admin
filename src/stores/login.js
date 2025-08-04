import { defineStore } from 'pinia';
import { ref } from 'vue';
import { makeRequest } from '@/request/request';

export const useLoginStore = defineStore('login', () => {
  // --- State ---
  // Initialize state from localStorage to persist login across page refreshes
  const loading = ref(false);
  const error = ref(null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('access_token') || null);

  // --- Actions ---
  const loginUser = async (credentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await makeRequest('/login', 'POST', credentials);
      
      if (response?.access_token) {
        token.value = response.access_token;
        user.value = response.user || null;

        // Save token and user details to localStorage
        localStorage.setItem('access_token', token.value);
        if (user.value) {
          localStorage.setItem('user', JSON.stringify(user.value));
        }

        return true;
      } else {
        error.value = response?.message || 'Login failed';
        return false;
      }
    } catch (err) {
      error.value = err?.response?.data?.message || err.message || 'Something went wrong';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // ✅ New logout action
  const logoutUser = () => {
    // Clear state
    user.value = null;
    token.value = null;

    // Clear from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  return {
    loading,
    error,
    user,
    token,
    loginUser,
    logoutUser, // Expose the new logout function
  };
});