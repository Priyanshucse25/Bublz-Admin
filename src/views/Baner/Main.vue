<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-0">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Add Banners</h1>
          <p class="text-sm text-gray-500">Manage your promotional banners here.</p>
        </div>
        <button
          @click="openAddModal"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Upload Banner
        </button>
      </div>

      <!-- Banners Table -->
      <div class="overflow-x-auto bg-white">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Slug URL</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th class="px-6 py-3 text-center font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="banners.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">No banners have been added yet.</td>
            </tr>
            <tr v-for="banner in banners" :key="banner.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{{ banner.name }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-500">{{ banner.slugUrl }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <!-- Toggle Switch -->
                <button
                  @click="toggleStatus(banner)"
                  :class="banner.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="banner.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-4">
                  <button @click="openEditModal(banner)" class="text-blue-600 hover:text-blue-900" title="Edit">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button @click="viewBanner(banner)" class="text-green-600 hover:text-green-900" title="View Image">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button @click="deleteBanner(banner.id)" class="text-red-600 hover:text-red-900" title="Delete">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Transition name="modal-fade">
      <div v-if="showUploadForm" @click.self="closeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-300/20 backdrop-blur-sm">
        <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Banner' : 'Upload New Banner' }}</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Banner Image</label>
              <input type="file" @change="handleFileUpload" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100" />
              <div v-if="currentBanner.imagePreview" class="mt-4">
                <img :src="currentBanner.imagePreview" alt="Image Preview" class="h-32 w-auto rounded-lg object-cover" />
              </div>
            </div>
            <div>
              <label for="slugUrl" class="block text-sm font-medium text-gray-700">Slug URL</label>
              <input type="text" id="slugUrl" v-model="currentBanner.slugUrl" placeholder="e.g., /special-offers" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <!-- Status Toggle in Modal -->
            <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <button
                  type="button"
                  @click="currentBanner.status = currentBanner.status === 'active' ? 'inactive' : 'active'"
                  :class="currentBanner.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="currentBanner.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
            </div>
            <div class="text-right">
              <button type="submit" class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700">
                {{ isEditing ? 'Update Banner' : 'Submit Banner' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- View Image Modal -->
    <Transition name="modal-fade">
        <div v-if="showViewModal" @click="showViewModal = false" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <img :src="viewingImageUrl" alt="Banner Image Preview" class="max-h-[80vh] max-w-[80vw] rounded-lg shadow-xl">
        </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBannerStore } from '@/stores/BannerStore'

const bannerStore = useBannerStore()
const { banners, fetchBanners } = bannerStore

onMounted(async () => {
  await fetchBanners()
})

const defaultBanner = () => ({
  id: null,
  name: '',
  imageFile: null,
  imagePreview: null,
  slugUrl: '',
  status: 'active'
})

const showUploadForm = ref(false)
const isEditing = ref(false)
const currentBanner = ref(defaultBanner())
const showViewModal = ref(false)
const viewingImageUrl = ref('')

const closeModal = () => {
  showUploadForm.value = false
}

const openAddModal = () => {
  isEditing.value = false
  currentBanner.value = defaultBanner()
  showUploadForm.value = true
}

const openEditModal = (banner) => {
  isEditing.value = true
  currentBanner.value = { ...banner }
  showUploadForm.value = true
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    currentBanner.value.imageFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      currentBanner.value.imagePreview = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = () => {
  alert('This form currently only updates UI. To persist, implement API calls.')
  closeModal()
}

const viewBanner = (banner) => {
  viewingImageUrl.value = banner.image_full_url || banner.imagePreview
  showViewModal.value = true
}

const deleteBanner = (id) => {
  alert(`Delete logic for banner ID ${id} not implemented yet.`)
}

const toggleStatus = (banner) => {
  alert(`Toggle status for ${banner.name} - implement API logic.`)
}
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