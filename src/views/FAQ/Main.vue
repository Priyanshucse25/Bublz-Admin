<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-0 lg:p-0">
    <div class="mx-auto max-w-7xl">
      <div class=" sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Frequently Asked Questions</h1>
          <p class="text-sm text-gray-500">Create and manage your FAQ entries.</p>
        </div>
        <button
          @click="openAddModal"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Add FAQ
        </button>
      </div>

      <div class="space-y-4 bg-white p-6 shadow-md">
        <div v-if="isLoading" class="py-12 text-center text-gray-500">Loading FAQs...</div>
        <div v-else-if="error" class="py-12 text-center text-red-500">Error: {{ error }}</div>
        <div v-else-if="faqs.length === 0" class="py-12 text-center text-gray-500">
            No FAQs have been added yet.
        </div>
        <div v-else v-for="faq in faqs" :key="faq.id" class="rounded-lg border border-gray-200">
          <div class="flex w-full items-center justify-between p-4 text-left font-semibold text-gray-800">
            <button @click="toggleFaq(faq.id)" class="flex-grow text-left">
              <span>{{ faq.questions?.[0] }}</span>
            </button>
            <div class="flex items-center space-x-4">
              <button
                @click="toggleStatus(faq)"
                :class="faq.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                title="Toggle Status"
              >
                <span
                  :class="faq.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                ></span>
              </button>
              <button @click="openEditModal(faq)" class="text-blue-500 hover:text-blue-700" title="Edit">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
               <button @click="deleteFaq(faq.id)" class="text-red-500 hover:text-red-700" title="Delete">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <button @click="toggleFaq(faq.id)">
                  <svg class="h-5 w-5 transform transition-transform" :class="{ 'rotate-180': openFaqId === faq.id }">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
              </button>
            </div>
          </div>
          <Transition name="collapse">
            <div v-if="openFaqId === faq.id" class="px-4 pb-4">
              <div v-for="(answer, index) in faq.answers" :key="index" class="prose prose-sm max-w-none border-t pt-2 mt-2 text-gray-600 first:mt-0 first:border-t-0 first:pt-0">
                <p>{{ answer }}</p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="showModal" @click.self="closeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-300/20 backdrop-blur-sm">
        <div class="w-full max-w-2xl rounded-lg bg-white shadow-xl">
          <form @submit.prevent="handleSubmit" class="flex h-[90vh] flex-col">
            <div class="flex items-center justify-between border-b p-4">
              <h2 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit FAQ' : 'Add New FAQ' }}</h2>
              <button type="button" @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div class="flex-grow space-y-6 overflow-y-auto p-6">
              <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>
              <div>
                <label class="block text-sm font-medium text-gray-700">Question</label>
                <div v-for="(question, index) in newFaq.questions" :key="index" class="mt-1 flex items-center gap-2">
                  <input type="text" v-model="newFaq.questions[index]" required class="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                  <button type="button" @click="removeQuestionField(index)" v-if="newFaq.questions.length > 1" class="text-red-500 hover:text-red-700">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                </div>
                <button type="button" @click="addQuestionField" class="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800">+ Add Question</button>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Answer</label>
                <div v-for="(answer, index) in newFaq.answers" :key="index" class="mt-1 flex items-center gap-2">
                  <textarea v-model="newFaq.answers[index]" required rows="3" class="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"></textarea>
                  <button type="button" @click="removeAnswerField(index)" v-if="newFaq.answers.length > 1" class="text-red-500 hover:text-red-700">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                </div>
                 <button type="button" @click="addAnswerField" class="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800">+ Add Answer</button>
              </div>

              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <button
                  type="button"
                  @click="newFaq.status = newFaq.status === 'active' ? 'inactive' : 'active'"
                  :class="newFaq.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    :class="newFaq.status === 'active' ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </div>
            </div>

            <div class="flex justify-end border-t p-4">
              <button type="submit" :disabled="isSubmitting" class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                {{ isSubmitting ? 'Submitting...' : (isEditing ? 'Update FAQ' : 'Submit FAQ') }}
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
import { useFaqStore } from '@/stores/FaqStore';
import { storeToRefs } from 'pinia';

const faqStore = useFaqStore();
const { faqs, isLoading, isSubmitting, error, submitError } = storeToRefs(faqStore);
const { getFaqs, createFaq } = faqStore;

const defaultFaq = () => ({
  id: null,
  questions: [''],
  answers: [''],
  status: 'active',
});

const showModal = ref(false);
const newFaq = ref(defaultFaq());
const openFaqId = ref(null);
const isEditing = ref(false);

onMounted(() => {
  getFaqs();
});

const openAddModal = () => {
  isEditing.value = false;
  newFaq.value = defaultFaq();
  submitError.value = null;
  showModal.value = true;
};

const openEditModal = (faq) => {
  isEditing.value = true;
  newFaq.value = JSON.parse(JSON.stringify(faq));
  submitError.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const addQuestionField = () => { newFaq.value.questions.push(''); };
const removeQuestionField = (index) => { newFaq.value.questions.splice(index, 1); };
const addAnswerField = () => { newFaq.value.answers.push(''); };
const removeAnswerField = (index) => { newFaq.value.answers.splice(index, 1); };

const handleSubmit = async () => {
  if (isEditing.value) {
    // NOTE: An 'updateFaq' action would be needed here
    const index = faqs.value.findIndex(f => f.id === newFaq.value.id);
    if (index !== -1) {
      faqs.value[index] = { ...newFaq.value };
    }
    closeModal();
  } else {
    await createFaq({ ...newFaq.value });
    if (!submitError.value) {
      await getFaqs();
      closeModal();
    }
  }
};

const toggleFaq = (id) => {
  openFaqId.value = openFaqId.value === id ? null : id;
};

const deleteFaq = (id) => {
    // NOTE: A 'deleteFaq' action would be needed here
    if (confirm('Are you sure you want to delete this FAQ?')) {
        faqs.value = faqs.value.filter(f => f.id !== id);
    }
};

const toggleStatus = (faq) => {
    // NOTE: An 'updateFaqStatus' action would be needed here
    const index = faqs.value.findIndex(f => f.id === faq.id);
    if (index !== -1) {
        const currentStatus = faqs.value[index].status;
        faqs.value[index].status = currentStatus === 'active' ? 'inactive' : 'active';
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

/* Smooth transition for the accordion collapse */
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
}
.prose :where(p):not(:where([class~="not-prose"] *)) {
    margin-top: 0;
    margin-bottom: 0;
}
</style>