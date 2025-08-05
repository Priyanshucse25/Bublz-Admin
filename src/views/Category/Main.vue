<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-0 lg:p-0">
    <div class="mx-auto max-w-7xl">
      <div class=" sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Category</h1>
          <p class="text-sm text-gray-500">Manage your product or service categories.</p>
        </div>
        <button
          @click="openAddModal"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      <div class="overflow-x-auto bg-white">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Category</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoading">
                <td colspan="3" class="px-6 py-12 text-center text-gray-500">Loading categories...</td>
            </tr>
            <tr v-else-if="fetchError">
                <td colspan="3" class="px-6 py-12 text-center text-red-500">Error: {{ fetchError }}</td>
            </tr>
            <tr v-else-if="categories.length === 0">
                <td colspan="3" class="px-6 py-12 text-center text-gray-500">No categories have been added yet.</td>
            </tr>
            <tr v-else v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center">
                  <img :src="buildUrl(category.image_url)" :alt="category.name" class="h-10 w-10 flex-shrink-0 rounded-full object-cover">
                  <div class="ml-4 font-medium text-lg text-gray-900">{{ category.name }}</div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <button
                  @click="handleToggleStatus(category)"
                  :class="category.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="category.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-4">
                  <button @click="openEditModal(category)" class="text-blue-600 hover:text-blue-900" title="Edit">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button @click="viewImage(category.image_url)" class="text-green-600 hover:text-green-900" title="View Image">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button @click="handleDeleteCategory(category.id)" class="text-red-600 hover:text-red-900" title="Delete">
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
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Category' : 'Add New Category' }}</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-4">
              <p v-if="postError || updateError" class="text-sm text-red-600">{{ postError || updateError }}</p>
            <div>
              <label class="block text-sm font-medium text-gray-700">Category Image</label>
              <input type="file" @change="handleImageUpload" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100" />
              <div v-if="currentCategory.imagePreview" class="mt-4">
                <img :src="buildUrl(currentCategory.imagePreview)" alt="Image Preview" class="h-20 w-20 rounded-full object-cover" />
              </div>
            </div>
            <div>
              <label for="categoryName" class="block text-sm font-medium text-gray-700">Category Name</label>
              <input type="text" id="categoryName" v-model="currentCategory.name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <button
                  type="button"
                  @click="currentCategory.status = currentCategory.status === 'active' ? 'inactive' : 'active'"
                  :class="currentCategory.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="currentCategory.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
            </div>
            <div class="text-right">
              <button type="submit" :disabled="isPosting || isUpdating" class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isPosting || isUpdating ? 'Submitting...' : (isEditing ? 'Update Category' : 'Submit Category') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
        <div v-if="showViewModal" @click="showViewModal = false" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <img :src="buildUrl(viewingImage)" alt="Category Image" class="aspect-square w-auto h-auto max-h-[80vh] max-w-[80vw] object-cover rounded-lg shadow-xl">
        </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/CategoryStore';
import { storeToRefs } from 'pinia';
import { buildUrl } from '@/utils/buildUrl'

const categoryStore = useCategoryStore();
const { 
    categories,
    isLoading,
    fetchError,
    isPosting,
    postError,
    isUpdating,
    updateError
} = storeToRefs(categoryStore);
const {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = categoryStore;


const showModal = ref(false);
const showViewModal = ref(false);
const isEditing = ref(false);
const viewingImage = ref(null);

const defaultCategory = () => ({
  id: null,
  name: '',
  imageFile: null,
  image_url: null,
  imagePreview: null,
  status: 'active',
});

const currentCategory = ref(defaultCategory());

onMounted(() => {
  fetchCategories();
});

const closeModal = () => {
  showModal.value = false;
};

const openAddModal = () => {
  isEditing.value = false;
  currentCategory.value = defaultCategory();
  postError.value = null;
  updateError.value = null;
  showModal.value = true;
};

const openEditModal = (category) => {
  isEditing.value = true;
  currentCategory.value = { ...category, imagePreview: category.image_url, imageFile: null };
  postError.value = null;
  updateError.value = null;
  showModal.value = true;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    currentCategory.value.imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      currentCategory.value.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  if (!currentCategory.value.name) {
    alert("Please enter a category name.");
    return;
  }
  
  const formData = new FormData();
  formData.append("name", currentCategory.value.name);
  formData.append("status", currentCategory.value.status);

  if (currentCategory.value.imageFile) {
    formData.append("image", currentCategory.value.imageFile);
  }

  if (isEditing.value) {
    await updateCategory(currentCategory.value.id, formData);
    if (!updateError.value) {
        await fetchCategories();
        closeModal();
    }
  } else {
    if (!currentCategory.value.imageFile) {
        alert("Please upload an image for the new category.");
        return;
    }
    await createCategory(formData);
    if (!postError.value) {
        closeModal();
    }
  }
};

// --- TABLE ACTIONS ---
const viewImage = (imageUrl) => {
  viewingImage.value = imageUrl;
  showViewModal.value = true;
};

const handleDeleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    await deleteCategory(id);
  }
};

const handleToggleStatus = async (category) => {
  const newStatus = category.status === 'active' ? 'inactive' : 'active';
  
  const payload = new FormData();
  payload.append('name', category.name);
  payload.append('status', newStatus);

  await updateCategory(category.id, payload);

  if (!updateError.value) {
    const index = categories.value.findIndex(c => c.id === category.id);
    if (index !== -1) {
      categories.value[index].status = newStatus;
    }
  }
};
</script>

<style scoped>
/* Smooth transition for the modals */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>