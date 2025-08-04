<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-0 lg:p-0">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="sticky top-0 z-10 rounded-t-lg border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Transaction History</h1>
          <p class="text-sm text-gray-500">Review all payments and transaction records.</p>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="overflow-x-auto bg-white shadow-md">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Invoice ID</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Customer Name</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Date</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">For Service</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">Loading transactions...</td>
            </tr>
            <tr v-else-if="transactions.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">No transactions found.</td>
            </tr>
            <tr
              v-else
              v-for="transaction in transactions"
              :key="transaction.invoiceId"
              class="hover:bg-gray-50"
            >
            
              <td class="whitespace-nowrap px-6 py-4 font-mono text-gray-700">{{ transaction.invoiceId }}</td>
              <td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{{ transaction.customerName }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ transaction.date }}</td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  :class="[
                    'rounded-full px-2 py-1 text-xs font-semibold leading-tight',
                    transaction.status === 'Paid' ? 'bg-green-100 text-green-800' : '',
                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : '',
                    transaction.status === 'Failed' ? 'bg-red-100 text-red-800' : ''
                  ]"
                >
                  {{ transaction.status }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-gray-700">{{ transaction.forService }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="error" class="p-4 text-red-600">Error: {{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
// fixed import to match typical lowercase filename
import { useTransactionStore } from '@/stores/TransactionStore';

const store = useTransactionStore();

const isLoading = computed(() => store.isLoadingPayments);
const error = computed(() => store.getPaymentsError);

// Debug: log raw payments whenever they change
watch(
  () => store.payments,
  (v) => {
    console.log("🔁 store.payments updated:", v);
  },
  { deep: true }
);

// Transform API payment objects into UI-friendly transactions
const transactions = computed(() =>
  (store.payments || []).map((p) => {
    let statusLabel = p.status;
    if (p.status === 'COMPLETED') statusLabel = 'Paid';
    else if (p.status === 'INITIATED') statusLabel = 'Pending';

    let dateStr = '';
    try {
      const d = new Date(p.created_at);
      dateStr = d.toISOString().split('T')[0];
    } catch {
      dateStr = p.created_at;
    }

    return {
      invoiceId: p.transaction_id || `txn-${p.id}`,
      customerName: `User #${p.user_id}`,
      date: dateStr,
      status: statusLabel,
      forService: `Booking ${p.booking_id}`,
    };
  })
);

onMounted(async () => {
  await store.getPayments();
});
</script>

<style scoped>
/* You can add any additional component-specific styles here if needed */
</style>
