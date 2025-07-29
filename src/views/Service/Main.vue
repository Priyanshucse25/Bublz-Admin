<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-0 lg:p-0">
    <div class="mx-auto max-w-7xl">
      <div class=" sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Service Management</h1>
          <p class="text-sm text-gray-500">Add, edit, and manage all your services.</p>
        </div>
        <button
          @click="openAddModal"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Add Service
        </button>
      </div>

      <div class="overflow-x-auto bg-white shadow-md">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Service</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Category</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Description</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Advantages</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Disadvantages</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Tags</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Price</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Offer Price</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Service Charge</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
             <tr v-if="isLoading">
                <td colspan="11" class="px-6 py-12 text-center text-gray-500">Loading services...</td>
            </tr>
            <tr v-else-if="fetchError">
                <td colspan="11" class="px-6 py-12 text-center text-red-500">Error: {{ fetchError }}</td>
            </tr>
            <tr v-else-if="services.length === 0">
              <td colspan="11" class="px-6 py-12 text-center text-gray-500">No services have been added yet.</td>
            </tr>
            <tr v-else v-for="service in services" :key="service.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center">
                  <img :src="service.image_url" :alt="service.name" class="h-10 w-10 flex-shrink-0 rounded-full object-cover">
                  <div class="ml-4 font-medium text-gray-900">{{ service.name }}</div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ getCategoryName(service.category_id) }}</td>
              <td class="max-w-xs truncate px-6 py-4 text-gray-700" :title="service.description">
                {{ service.description }}
              </td>
              <td class="max-w-xs truncate px-6 py-4 text-gray-700" :title="service.advantages">
                {{ service.advantages }}
              </td>
              <td class="max-w-xs truncate px-6 py-4 text-gray-700" :title="service.disadvantages">
                {{ service.disadvantages }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-2">
                  <span
                    :style="{ backgroundColor: service.color }"
                    class="rounded-full px-2 py-1 text-xs font-semibold text-white"
                  >
                    {{ service.tag }}
                  </span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-500">₹{{ service.price }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-semibold text-green-600">₹{{ service.offer_price }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ service.service_charge }}%</td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <button
                  @click="toggleStatus(service)"
                  :class="service.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="service.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-4">
                  <button @click="openEditModal(service)" class="text-blue-600 hover:text-blue-900" title="Edit">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button @click="handleDeleteService(service.id)" class="text-red-600 hover:text-red-900" title="Delete">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
        <div class="w-full max-w-lg rounded-lg bg-white shadow-xl">
          <form @submit.prevent="handleSubmit" class="flex h-[90vh] flex-col">
            <div class="flex items-center justify-between border-b p-4">
              <h2 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Service' : 'Add New Service' }}</h2>
              <button type="button" @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div class="flex-grow space-y-4 overflow-y-auto p-6">
              <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>
              <div>
                <label class="block text-sm font-medium text-gray-700">Service Image</label>
                <input type="file" @change="handleImageUpload" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100" />
                <img v-if="newService.imagePreview" :src="newService.imagePreview" alt="Preview" class="mt-4 h-24 w-24 rounded-lg object-cover" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" v-model="newService.name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="newService.category_id" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                    <option disabled :value="null">Select a category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Tag</label>
                 <input type="text" v-model="newService.tag" placeholder="Tag text" class="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
              </div>
               <div>
                <label class="block text-sm font-medium text-gray-700">Color</label>
                 <input type="color" v-model="newService.color" class="h-10 w-full cursor-pointer rounded-md border-gray-300" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea v-model="newService.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Advantages</label>
                 <input type="text" v-model="newService.advantages" class="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Disadvantages</label>
                 <input type="text" v-model="newService.disadvantages" class="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Price</label>
                  <input type="number" v-model.number="newService.price" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Offer Price</label>
                  <input type="number" v-model.number="newService.offer_price" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
              </div>
               <div>
                  <label class="block text-sm font-medium text-gray-700">Service Charge (%)</label>
                  <div class="relative mt-1">
                      <input type="number" v-model.number="newService.service_charge" required class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-8 shadow-sm sm:text-sm" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span class="text-gray-500 sm:text-sm">%</span>
                      </div>
                  </div>
                </div>
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <button
                  type="button"
                  @click="newService.status = newService.status === 'active' ? 'inactive' : 'active'"
                  :class="newService.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="newService.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </div>
            </div>

            <div class="flex justify-end border-t p-4">
              <button type="submit" :disabled="isSubmitting" class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                {{ isSubmitting ? 'Submitting...' : (isEditing ? 'Update Service' : 'Submit Service') }}
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
import { useServiceStore } from '@/stores/serviceStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { storeToRefs } from 'pinia';

// Service Store
const serviceStore = useServiceStore();
const { services, isLoading, fetchError, isSubmitting, submitError } = storeToRefs(serviceStore);
// ✅ 1. Destructure all needed actions
const { createService, getServices, updateService, deleteService } = serviceStore;

// Category Store
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const { fetchCategories } = categoryStore;

const defaultService = () => ({
  id: null,
  name: '',
  category_id: null,
  description: '',
  advantages: '',
  disadvantages: '',
  tag: '',
  color: '#3B82F6',
  image: null,
  imagePreview: null,
  price: 0,
  offer_price: 0,
  service_charge: 0,
  status: 'active',
});

const showModal = ref(false);
const isEditing = ref(false);
const newService = ref(defaultService());

onMounted(() => {
  fetchCategories();
  getServices();
});

const getCategoryName = (id) => {
    const category = categories.value.find(cat => cat.id === id);
    return category ? category.name : 'Unknown';
};

const openAddModal = () => {
  isEditing.value = false;
  newService.value = defaultService();
  submitError.value = null;
  showModal.value = true;
};

const openEditModal = (service) => {
  isEditing.value = true;
  newService.value = JSON.parse(JSON.stringify(service));
  newService.value.imagePreview = service.image_url;
  submitError.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newService.value.image = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      newService.value.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// ✅ 2. Update handleSubmit to call updateService when editing
const handleSubmit = async () => {
  if (isEditing.value) {
    await updateService(newService.value.id, { ...newService.value });
     if (!submitError.value) {
      await getServices(); // Refresh the list from the server
      closeModal();
    }
  } else {
    await createService({ ...newService.value });
    if (!submitError.value) {
      await getServices(); // Refresh the list from the server
      closeModal();
    }
  }
};

// ✅ 3. Update deleteService to use the store action
const handleDeleteService = async (id) => {
  if (confirm('Are you sure you want to delete this service?')) {
    await deleteService(id);
    // The list will automatically refresh because getServices() is called inside deleteService in the store
  }
};

// This action is still local as there's no specific store action for it
const toggleStatus = (service) => {
    // NOTE: An 'updateServiceStatus' action would be needed in the store for a full backend implementation
    const index = services.value.findIndex(s => s.id === service.id);
    if (index !== -1) {
        services.value[index].status = services.value[index].status === 'active' ? 'inactive' : 'active';
        console.log(`Locally toggling status for service ID: ${service.id}. Implement backend update.`);
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