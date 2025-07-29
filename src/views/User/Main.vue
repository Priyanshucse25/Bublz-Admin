<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-0 lg:p-0">
    <div class="mx-auto max-w-7xl">
      <div class="sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800">User Management</h1>
          <p class="text-sm text-gray-500">Add, edit, and view user details.</p>
        </div>
        <div class="flex items-center space-x-4">
            <button
              @click="openAddModal"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Add User
            </button>
        </div>
      </div>

      <div class="overflow-x-auto bg-white shadow-md">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Phone</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Email</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Address</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th class="px-6 py-3 text-right font-medium uppercase tracking-wider text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoadingUsers">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">Loading users...</td>
            </tr>
            <tr v-else-if="getUsersError">
                <td colspan="6" class="px-6 py-12 text-center text-red-500">Error fetching users: {{ getUsersError }}</td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">No users have been added yet.</td>
            </tr>
            <tr v-else v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{{ user.name }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ user.phone }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ user.email }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ user.address }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <button
                  @click="toggleStatus(user)"
                  :class="user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="user.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-4">
                  <button @click="openEditModal(user)" class="text-blue-600 hover:text-blue-900" title="Edit">
                    <i class="pi pi-pencil text-base"></i>
                  </button>
                  <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900" title="Delete">
                    <i class="pi pi-trash text-base"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="showModal" @click.self="closeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-300/20 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div class="mb-4 flex items-center justify-between border-b p-6">
            <h2 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit User' : 'Add New User' }}</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="h-[80vh] overflow-y-auto p-6">
            <div class="space-y-4">
                <p v-if="signupError" class="text-sm text-red-600">{{ signupError }}</p>
                <div>
                  <label for="userName" class="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="userName" v-model="currentUser.name" required class="mt-1 block w-full h-8 px-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label for="userPhone" class="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" id="userPhone" v-model="currentUser.phone" required class="mt-1 block w-full h-8 px-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label for="userAddress" class="block text-sm font-medium text-gray-700">Address</label>
                  <input type="text" id="userAddress" v-model="currentUser.address" required class="mt-1 block w-full h-8 px-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                    <label for="userEmail" class="block text-sm font-medium text-gray-700">Email</label>
                    <div class="mt-1 flex items-center space-x-2">
                        <input type="email" id="userEmail" v-model="currentUser.email" :disabled="isEditing || emailSent" required class="block w-full h-8 px-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100" />
                        <button v-if="!isEditing" type="button" @click="handleSendOtp" :disabled="emailSent || isSendingOtp" class="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50">
                            {{ isSendingOtp ? '...' : 'Verify' }}
                        </button>
                    </div>
                    <p v-if="sendOtpError" class="mt-2 text-sm text-red-600">{{ sendOtpError }}</p>
                </div>
                <div v-if="!isEditing && emailSent" class="space-y-4">
                  <label class="block text-sm font-medium text-gray-700">Enter OTP</label>
                  <div class="flex items-center justify-center space-x-2">
                    <input
                      v-for="(digit, index) in otp"
                      :key="index"
                      v-model="otp[index]"
                      :ref="el => otpInputs[index] = el"
                      @keydown="handleOtpKeydown($event, index)"
                      type="tel" maxlength="1"
                      class="h-12 w-10 rounded-md border-gray-300 text-center text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <p v-if="verifyOtpError" class="mt-2 text-sm text-red-600">{{ verifyOtpError }}</p>
                  <div class="flex justify-end">
                      <button type="button" @click="handleModalVerifyOtp" :disabled="isVerifyingOtp" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50">
                        {{ isVerifyingOtp ? 'Verifying...' : 'Verify OTP' }}
                      </button>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <button type="button" @click="currentUser.status = currentUser.status === 'active' ? 'inactive' : 'active'" :class="currentUser.status === 'active' ? 'bg-green-500' : 'bg-gray-300'" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                        <span :class="currentUser.status === 'active' ? 'translate-x-5' : 'translate-x-0'" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                </div>
                <div class="pt-4 text-right">
                    <button type="submit" :disabled="isSigningUp || (!isEditing && !otpVerified)" class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                        {{ isSigningUp ? 'Submitting...' : (isEditing ? 'Update User' : 'Submit User') }}
                    </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/UserManageStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

// ✅ Destructure all necessary state and actions
const {
    users, // Use users from the store
    isLoadingUsers,
    getUsersError,
    isSendingOtp,
    isVerifyingOtp,
    sendOtpError,
    verifyOtpError,
    isSigningUp,
    signupError,
} = storeToRefs(userStore);
const { sendOtp, verifyOtp, signup, getUsers } = userStore;

const defaultUser = () => ({
  id: null,
  name: '',
  phone: '',
  email: '',
  address: '',
  status: 'active',
});

const showModal = ref(false);
const isEditing = ref(false);
const currentUser = ref(defaultUser());

const emailSent = ref(false);
const otpVerified = ref(false);
const otp = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);

watch(() => currentUser.value.email, (newEmail, oldEmail) => {
    if (!isEditing.value && newEmail !== oldEmail) {
        emailSent.value = false;
        otpVerified.value = false;
        otp.value = ['', '', '', '', '', ''];
    }
});

// ✅ Fetch users when the component is mounted
onMounted(() => {
  getUsers();
});

// --- ADD/EDIT MODAL LOGIC ---
const closeModal = () => {
  showModal.value = false;
};

const openAddModal = () => {
  isEditing.value = false;
  currentUser.value = defaultUser();
  emailSent.value = false;
  otpVerified.value = false;
  otp.value = ['', '', '', '', '', ''];
  signupError.value = null;
  sendOtpError.value = null;
  verifyOtpError.value = null;
  showModal.value = true;
};

const openEditModal = (user) => {
  isEditing.value = true;
  currentUser.value = { ...user };
  showModal.value = true;
};

const handleSendOtp = async () => {
  if (!currentUser.value.email) {
    alert('Please enter an email address.');
    return;
  }
  await sendOtp({ email: currentUser.value.email });
  if (!sendOtpError.value) {
    emailSent.value = true;
    setTimeout(() => otpInputs.value[0]?.focus(), 0);
  }
};

const handleOtpKeydown = (event, index) => {
    const input = event.target;
    if (event.key >= 0 && event.key <= 9) {
        input.value = '';
        setTimeout(() => {
            if (index < 5) otpInputs.value[index + 1].focus();
        }, 0);
    }
    else if (event.key === 'Backspace' && input.value === '') {
        if (index > 0) otpInputs.value[index - 1].focus();
    }
};

const handleModalVerifyOtp = async () => {
    const fullOtp = otp.value.join('');
    if (fullOtp.length < 6) {
        alert('Please enter the full 6-digit OTP.');
        return;
    }
    await verifyOtp({
        email: currentUser.value.email,
        otp: fullOtp,
    });
    if (!verifyOtpError.value) {
        otpVerified.value = true;
        alert(`Email ${currentUser.value.email} has been verified!`);
    }
};

const handleSubmit = async () => {
  if (isEditing.value) {
    // NOTE: An 'updateUser' action in the store would be needed for a full backend implementation
    const index = users.value.findIndex(u => u.id === currentUser.value.id);
    if (index !== -1) users.value[index] = { ...currentUser.value };
    closeModal();
  } else {
    if (!otpVerified.value) {
        alert('Please verify your email address before submitting.');
        return;
    }
    await signup({ ...currentUser.value });
    if (!signupError.value) {
        // ✅ Refresh the user list from the server after adding a new user
        await getUsers();
        closeModal();
    }
  }
};

// --- TABLE ACTIONS ---
const deleteUser = (id) => {
  // NOTE: A 'deleteUser' action in the store would be needed for a full backend implementation
  if (confirm('Are you sure you want to delete this user?')) {
    users.value = users.value.filter(u => u.id !== id);
  }
};

const toggleStatus = (user) => {
    // NOTE: An 'updateUserStatus' action in the store would be needed for a full backend implementation
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users.value[index].status = users.value[index].status === 'active' ? 'inactive' : 'active';
    }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>