<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-0">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="sticky top-0 z-10 rounded-t-lg border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Booking Management</h1>
          <p class="text-sm text-gray-500">Oversee and manage all customer bookings.</p>
        </div>
      </div>

      <!-- Bookings Table -->
      <div class="overflow-x-auto bg-white shadow-md">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Service</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Date</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Time</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Slot Time</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Assigned Person</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Active/Inactive</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Payment</th>
              <th class="px-6 py-3 text-right font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="bookings.length === 0">
              <td colspan="10" class="px-6 py-12 text-center text-gray-500">No bookings found.</td>
            </tr>
            <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{{ booking.name }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ booking.service }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ booking.date }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ booking.time }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ booking.slotTime }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">
                <button @click="openAssignModal(booking)" class="rounded-md bg-gray-200 px-3 py-1 font-semibold text-gray-700 hover:bg-gray-300">
                  {{ booking.assignedPerson || 'Assign' }}
                </button>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <button
                  @click="toggleActivityStatus(booking)"
                  :class="booking.activityStatus === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="booking.activityStatus === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span :class="getStatusClass(booking.status)">{{ booking.status }}</span>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span :class="booking.payment === 'Paid' ? 'text-green-600' : 'text-gray-500'" class="font-medium">{{ booking.payment }}</span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-4">
                  <button @click="editBooking(booking)" class="text-blue-600 hover:text-blue-900" title="Edit">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button @click="deleteBooking(booking.id)" class="text-red-600 hover:text-red-900" title="Delete">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Assign Person Modal -->
    <Transition name="modal-fade">
      <div v-if="showAssignModal" @click.self="closeAssignModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-300/20 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Assign Person</h2>
          <form @submit.prevent="handleAssignment">
            <div>
              <label class="block text-sm font-medium text-gray-700">Select Employee</label>
              <select v-model="selectedEmployee" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                <option disabled value="">Please select one</option>
                <option v-for="employee in employees" :key="employee.id" :value="employee.name">
                  {{ employee.name }}
                </option>
              </select>
            </div>
            <div class="mt-6 text-right">
              <button type="button" @click="closeAssignModal" class="mr-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">Cancel</button>
              <button type="submit" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Assign</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// --- STATE ---
const bookings = ref([]);
const employees = ref([
  { id: 1, name: 'Devesh' },
  { id: 2, name: 'Aryan' },
  { id: 3, name: 'Shubham' },
  { id: 4, name: 'Avneesh' },
]);
const showAssignModal = ref(false);
const currentBooking = ref(null);
const selectedEmployee = ref('');

// --- LOCAL STORAGE FUNCTIONS ---
const saveBookingsToLocalStorage = () => {
  localStorage.setItem('managedBookings', JSON.stringify(bookings.value));
};

const loadBookingsFromLocalStorage = () => {
  const saved = localStorage.getItem('managedBookings');
  if (saved) {
    bookings.value = JSON.parse(saved);
  } else {
    // Load initial mock data if nothing is saved
    bookings.value = [
      { id: 1, name: 'Shubham', service: 'car washing', date: '2025-08-15', time: '02:00 PM', slotTime: '60 min', location: 'Purani basti', assignedPerson: 'Devesh', status: 'Confirmed', payment: 'Paid', activityStatus: 'active' },
      { id: 2, name: 'Shruti', service: 'car detailing and polishing', date: '2025-08-16', time: '11:00 AM', slotTime: '90 min', location: 'telibandha', assignedPerson: 'Aryan', status: 'Pending', payment: 'Pending', activityStatus: 'active' },
      { id: 3, name: 'Priyanshu', service: 'tyre change and alignment', date: '2025-08-16', time: '04:30 PM', slotTime: '45 min', location: 'car shringar', assignedPerson: 'Shubham', status: 'Confirmed', payment: 'Paid', activityStatus: 'inactive' },
      { id: 4, name: 'Anjali', service: 'engine oil change', date: '2025-08-17', time: '01:00 PM', slotTime: '30 min', location: 'Vip road', assignedPerson: '', status: 'Cancelled', payment: 'Refunded', activityStatus: 'active' },
    ];
  }
};

onMounted(() => {
  loadBookingsFromLocalStorage();
});

// --- MODAL & ASSIGNMENT LOGIC ---
const openAssignModal = (booking) => {
  currentBooking.value = booking;
  selectedEmployee.value = booking.assignedPerson || '';
  showAssignModal.value = true;
};

const closeAssignModal = () => {
  showAssignModal.value = false;
  currentBooking.value = null;
  selectedEmployee.value = '';
};

const handleAssignment = () => {
  if (currentBooking.value) {
    const index = bookings.value.findIndex(b => b.id === currentBooking.value.id);
    if (index !== -1) {
      bookings.value[index].assignedPerson = selectedEmployee.value;
      saveBookingsToLocalStorage();
    }
  }
  closeAssignModal();
};

// --- TABLE ACTIONS ---
const toggleActivityStatus = (booking) => {
    const index = bookings.value.findIndex(b => b.id === booking.id);
    if (index !== -1) {
        bookings.value[index].activityStatus = bookings.value[index].activityStatus === 'active' ? 'inactive' : 'active';
        saveBookingsToLocalStorage();
    }
};

const editBooking = (booking) => {
  alert(`Editing booking ID: ${booking.id}. (Add your edit modal logic here)`);
};

const deleteBooking = (id) => {
  if (confirm('Are you sure you want to delete this booking?')) {
    bookings.value = bookings.value.filter(b => b.id !== id);
    saveBookingsToLocalStorage();
  }
};

// --- UI HELPERS ---
const getStatusClass = (status) => {
  const baseClass = 'rounded-full px-2 py-1 text-xs font-semibold leading-tight';
  if (status === 'Confirmed') return `${baseClass} bg-green-100 text-green-800`;
  if (status === 'Pending') return `${baseClass} bg-yellow-100 text-yellow-800`;
  if (status === 'Cancelled') return `${baseClass} bg-red-100 text-red-800`;
  return baseClass;
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