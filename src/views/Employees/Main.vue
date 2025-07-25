<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-0">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
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

      <!-- Employee Table -->
      <div class="overflow-x-auto bg-white shadow-md">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Employee ID</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Password</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Number</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Email</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Address</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th class="px-6 py-3 text-right font-medium uppercase tracking-wider text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="employees.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-gray-500">No employees have been added yet.</td>
            </tr>
            <tr v-for="employee in employees" :key="employee.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{{ employee.name }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-mono text-gray-700">{{ employee.employeeId }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-mono text-gray-700">{{ employee.password }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ employee.number }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ employee.email }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ employee.address }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <!-- Status Toggle Switch -->
                <button
                  @click="toggleStatus(employee)"
                  :class="employee.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="employee.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-4">
                  <button @click="openEditModal(employee)" class="text-blue-600 hover:text-blue-900" title="Edit">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button @click="deleteEmployee(employee.id)" class="text-red-600 hover:text-red-900" title="Delete">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Employee Modal -->
    <Transition name="modal-fade">
      <div v-if="showModal" @click.self="closeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-300/20 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Employee' : 'Add New Employee' }}</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="employeeName" class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="employeeName" v-model="currentEmployee.name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="employeeNumber" class="block text-sm font-medium text-gray-700">Number</label>
              <input type="text" id="employeeNumber" v-model="currentEmployee.number" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="employeeEmail" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="employeeEmail" v-model="currentEmployee.email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label for="employeeAddress" class="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" id="employeeAddress" v-model="currentEmployee.address" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
             <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <button
                  type="button"
                  @click="currentEmployee.status = currentEmployee.status === 'active' ? 'inactive' : 'active'"
                  :class="currentEmployee.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="currentEmployee.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
            </div>
            <div class="text-right">
              <button type="submit" class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700">
                {{ isEditing ? 'Update Employee' : 'Submit Employee' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const defaultEmployee = () => ({
  id: null,
  name: '',
  number: '',
  email: '',
  address: '',
  employeeId: '',
  password: '',
  status: 'active', // Default status for new employees
});

const employees = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const currentEmployee = ref(defaultEmployee());

// --- HELPER FUNCTIONS ---
const generateEmployeeId = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `EMP-${randomNumber}`;
};

const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// --- LOCAL STORAGE FUNCTIONS ---
const saveEmployeesToLocalStorage = () => {
  localStorage.setItem('managedEmployees', JSON.stringify(employees.value));
};

const loadEmployeesFromLocalStorage = () => {
  const savedEmployees = localStorage.getItem('managedEmployees');
  if (savedEmployees) {
    employees.value = JSON.parse(savedEmployees);
  }
};

onMounted(() => {
  loadEmployeesFromLocalStorage();
});

// --- MODAL & FORM LOGIC ---
const closeModal = () => {
  showModal.value = false;
};

const openAddModal = () => {
  isEditing.value = false;
  currentEmployee.value = defaultEmployee();
  showModal.value = true;
};

const openEditModal = (employee) => {
  isEditing.value = true;
  currentEmployee.value = { ...employee }; 
  showModal.value = true;
};

const handleSubmit = () => {
  if (isEditing.value) {
    const index = employees.value.findIndex(emp => emp.id === currentEmployee.value.id);
    if (index !== -1) {
      employees.value[index] = { ...currentEmployee.value };
    }
  } else {
    employees.value.push({
      ...currentEmployee.value,
      id: Date.now(),
      employeeId: generateEmployeeId(),
      password: generatePassword(),
    });
  }
  saveEmployeesToLocalStorage();
  closeModal();
};

const deleteEmployee = (id) => {
  if (confirm('Are you sure you want to delete this employee?')) {
    employees.value = employees.value.filter(emp => emp.id !== id);
    saveEmployeesToLocalStorage();
  }
};

const toggleStatus = (employee) => {
    const index = employees.value.findIndex(emp => emp.id === employee.id);
    if (index !== -1) {
        employees.value[index].status = employees.value[index].status === 'active' ? 'inactive' : 'active';
        saveEmployeesToLocalStorage();
    }
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