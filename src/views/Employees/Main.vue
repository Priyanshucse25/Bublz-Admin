<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-0 lg:p-0">
    <div class="mx-auto max-w-7xl">
      <div class=" sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Employee Management</h1>
          <p class="text-sm text-gray-500">View and manage your list of employees.</p>
        </div>
        <button
          @click="openAddModal"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      <div class="overflow-x-auto bg-white shadow-md">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Employee ID</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Password</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Phone</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Email</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Address</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Specialization</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Service Area</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Experience</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Rating</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Availability</th>
              <th class="px-6 py-3 text-right font-medium uppercase tracking-wider text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoading">
                <td colspan="12" class="px-6 py-12 text-center text-gray-500">Loading employees...</td>
            </tr>
            <tr v-else-if="fetchError">
                <td colspan="12" class="px-6 py-12 text-center text-red-500">Error: {{ fetchError }}</td>
            </tr>
            <tr v-else-if="employees.length === 0">
              <td colspan="12" class="px-6 py-12 text-center text-gray-500">No employees have been added yet.</td>
            </tr>
            <tr v-else v-for="employee in employees" :key="employee.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{{ employee.name }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-mono text-gray-700">EMP-{{ employee.user_id }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-mono text-gray-700">********</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ employee.phone }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ employee.email }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ employee.address }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ employee.specialization }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ employee.service_area }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-center text-gray-700">{{ employee.experience_years }} yrs</td>
              <td class="whitespace-nowrap px-6 py-4 text-center text-gray-700">
                <span class="font-semibold text-yellow-500">★</span> {{ employee.rating }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <button
                  @click="toggleStatus(employee)"
                  :class="employee.is_available ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="employee.is_available ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-4">
                  <button @click="openEditModal(employee)" class="text-blue-600 hover:text-blue-900" title="Edit">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button @click="handleDeleteEmployee(employee.id)" class="text-red-600 hover:text-red-900" title="Delete">
                    <i class="pi pi-trash"></i>
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
            <h2 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Employee' : 'Add New Employee' }}</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="h-[80vh] overflow-y-auto p-6">
            <div class="space-y-4">
              <p v-if="submitError || updateError" class="text-sm text-red-600">{{ submitError || updateError }}</p>
              <div>
                <label for="employeeName" class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="employeeName" v-model="currentEmployee.name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label for="employeePhone" class="block text-sm font-medium text-gray-700">Phone</label>
                <input type="text" id="employeePhone" v-model="currentEmployee.phone" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label for="employeeAddress" class="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="employeeAddress" v-model="currentEmployee.address" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label for="employeeSpecialization" class="block text-sm font-medium text-gray-700">Specialization</label>
                <input type="text" id="employeeSpecialization" v-model="currentEmployee.specialization" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label for="employeeServiceArea" class="block text-sm font-medium text-gray-700">Service Area</label>
                <input type="text" id="employeeServiceArea" v-model="currentEmployee.service_area" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="employeeExperience" class="block text-sm font-medium text-gray-700">Experience (Years)</label>
                    <input type="number" id="employeeExperience" v-model.number="currentEmployee.experience_years" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                  </div>
                  <div>
                    <label for="employeeRating" class="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                    <input type="number" id="employeeRating" v-model.number="currentEmployee.rating" required min="0" max="5" step="0.1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                  </div>
              </div>
              <div>
                  <label for="employeeEmail" class="block text-sm font-medium text-gray-700">Email</label>
                  <div class="mt-1 flex items-center space-x-2">
                      <input type="email" id="employeeEmail" v-model="currentEmployee.email" :disabled="isEditing || emailSent" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100" />
                      <button v-if="!isEditing" type="button" @click="handleSendOtp" :disabled="emailSent" class="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50">Verify</button>
                  </div>
              </div>
              <div v-if="!isEditing && emailSent" class="space-y-2">
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
                  <div class="flex justify-end">
                      <button type="button" @click="handleModalVerifyOtp" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">Verify OTP</button>
                  </div>
              </div>
              <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium text-gray-700">Available</label>
                  <button
                    type="button"
                    @click="currentEmployee.is_available = !currentEmployee.is_available"
                    :class="currentEmployee.is_available ? 'bg-green-500' : 'bg-gray-300'"
                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  >
                    <span
                      :class="currentEmployee.is_available ? 'translate-x-5' : 'translate-x-0'"
                      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    ></span>
                  </button>
              </div>
              <div class="pt-4 text-right">
                <button type="submit" :disabled="(!isEditing && !otpVerified) || isSubmitting || isUpdating" class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {{ isSubmitting || isUpdating ? 'Submitting...' : (isEditing ? 'Update Employee' : 'Submit Employee') }}
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
import { useEmployeeStore } from '@/stores/employeeStore'; 
import { storeToRefs } from 'pinia';

const employeeStore = useEmployeeStore();
// ✅ 1. Get all state and actions from the store
const { 
    employees, 
    isLoading, 
    fetchError, 
    isSubmitting, 
    submitError,
    isUpdating,
    updateError,
} = storeToRefs(employeeStore);
const { 
    sendOtp, 
    verifyOtp, 
    signupEmployee, 
    getEmployees,
    updateEmployee,
    deleteEmployee
} = employeeStore;

const defaultEmployee = () => ({
  id: null,
  name: '',
  phone: '',
  email: '',
  address: '',
  specialization: '',
  service_area: '',
  experience_years: 0,
  rating: 0,
  is_available: true,
});

const showModal = ref(false);
const isEditing = ref(false);
const currentEmployee = ref(defaultEmployee());

const emailSent = ref(false);
const otpVerified = ref(false);
const otp = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);

watch(() => currentEmployee.value.email, (newEmail, oldEmail) => {
    if (!isEditing.value && newEmail !== oldEmail) {
        emailSent.value = false;
        otpVerified.value = false;
        otp.value = ['', '', '', '', '', ''];
    }
});

onMounted(() => {
  getEmployees();
});

const closeModal = () => {
  showModal.value = false;
};

const openAddModal = () => {
  isEditing.value = false;
  currentEmployee.value = defaultEmployee();
  emailSent.value = false;
  otpVerified.value = false;
  otp.value = ['', '', '', '', '', ''];
  submitError.value = null; 
  updateError.value = null;
  showModal.value = true;
};

const openEditModal = (employee) => {
  isEditing.value = true;
  currentEmployee.value = { ...employee }; 
  submitError.value = null;
  updateError.value = null;
  showModal.value = true;
};

const handleSendOtp = async () => {
    if (!currentEmployee.value.email) {
        alert('Please enter an email address.');
        return;
    }
    await sendOtp(currentEmployee.value.email);
    if (!submitError.value) {
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
        alert('Please enter a valid 6-digit OTP.');
        return;
    }
    await verifyOtp({ email: currentEmployee.value.email, otp: fullOtp });
    if (!submitError.value) {
        otpVerified.value = true;
        alert('OTP has been verified successfully!');
    }
};

// ✅ 2. Update handleSubmit to call updateEmployee when editing
const handleSubmit = async () => {
  if (isEditing.value) {
    await updateEmployee(currentEmployee.value.id, { ...currentEmployee.value });
    if (!updateError.value) {
      closeModal();
      // The store's update action already refreshes the list
    }
  } else {
    if (!otpVerified.value) {
        alert('Please verify the email with OTP before submitting.');
        return;
    }
    
    await signupEmployee({ ...currentEmployee.value });

    if (!submitError.value) {
        await getEmployees(); // Refresh the list from the server
        closeModal();
    }
  }
};

// ✅ 3. Update deleteEmployee and toggleStatus to use store actions
const handleDeleteEmployee = async (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
        await deleteEmployee(id);
        // The store's delete action automatically refreshes the list
    }
};

const toggleStatus = async (employee) => {
    const updatedEmployee = { ...employee, is_available: !employee.is_available };
    await updateEmployee(employee.id, updatedEmployee);
};
</script>

<style scoped>
/* Smooth transition for the modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>