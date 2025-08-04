<template>
  <div class="min-h-screen flex flex-col justify-center items-center px-4">
    <div class="w-full max-w-lg">
      <div class="flex flex-col items-center mb-10">
        <img src="@/assets/LOGO.png" alt="bubblz Logo" class="h-12 w-auto" />
      </div>
      <h2
        class="text-2xl md:font-extrabold font-semibold text-start mb-6 text-gray-800"
      >
        Welcome Back
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Log in to continue booking and managing your services.
      </p>
      <form @submit.prevent="handleLogin">
        <input
          v-model="loginData.email"
          type="text"
          placeholder="Email"
          class="w-full border rounded-md p-3 mb-6"
        />
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="loginData.password"
            placeholder="Password"
            class="w-full border rounded-md p-3 mb-2 pr-10"
          />
          <span
            class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </span>
        </div>
        <div class="flex items-center justify-between mb-8">
          <p class="text-sm text-gray-700">
            <label class="inline-flex items-center">
              <input type="checkbox" class="form-checkbox mr-2" />
              Remember Me
            </label>
          </p>
          <p class="text-sm">
            <router-link
              to="/forget-password"
              @click.prevent="$emit('switch', 'forgot')"
              class="text-[#2076E2] hover:underline"
            >
              Forgot Password?
            </router-link>
          </p>
        </div>

        <button
          class="w-full bg-[#2076E2] text-white py-2 rounded-md"
          type="submit"
          :disabled="loginStore.loading"
        >
          <span v-if="loginStore.loading">Logging in...</span>
          <span v-else>Login</span>
        </button>

        <p class="mt-2 text-md text-center">
          Create an account?
          <router-link to="/register" class="text-[#2076E2] hover:underline"
            >Register here</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "@/stores/login";

const router = useRouter();
const showPassword = ref(false);

const loginData = ref({
  identifier: "",
  password: "",
});

const loginStore = useLoginStore();

const handleLogin = async () => {
  const success = await loginStore.loginUser({
    email: loginData.value.email,
    password: loginData.value.password,
  });
  console.log(success);
  if (success) {
    alert("Login successful!");
    router.push("/");
  } else {
    alert(loginStore.error || "Login failed");
  }
};
</script>
