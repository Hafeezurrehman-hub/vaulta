import { store } from '../store/state';
import { icons } from '../utils/icons';
import { openTransactionModal } from '../components/TransactionModal';

let searchQuery = '';
let selectedTypeFilter = 'all';
let selectedCategoryFilter = 'all';

export function renderTransactionsView(): string {
  let transactions = store.getTransactions();
  const accounts = store.getAccounts();

  // Filtering
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    transactions = transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.accountName && t.accountName.toLowerCase().includes(q))
    );
  }

  if (selectedTypeFilter !== 'all') {
    transactions = transactions.filter((t) => t.type === selectedTypeFilter);
  }

  if (selectedCategoryFilter !== 'all') {
    transactions = transactions.filter((t) => t.category === selectedCategoryFilter);
  }

  const allCategories = Array.from(new Set(store.getTransactions().map((t) => t.category)));

  return `
    <div class="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
        <div>
          <h2 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9]">
            Income & Expense Log
          </h2>
          <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
            Search, filter, and track every transaction
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- CSV Export Button -->
          <button id="btn-export-csv" class="px-3.5 py-2.5 bg-[#F2F1EC] dark:bg-[#1B2623] hover:bg-[#e6e4dc] dark:hover:bg-[#20302c] text-[#1B2623] dark:text-[#E9EDC9] font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer">
            ${icons.download}
            <span class="hidden sm:inline">Export CSV</span>
          </button>

          <!-- Add Button -->
          <button id="btn-tx-add-new" class="px-4 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer">
            ${icons.plus}
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <!-- Search Input -->
        <div class="relative">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7D73]">
            ${icons.search}
          </span>
          <input 
            type="text" 
            id="input-search-tx" 
            value="${searchQuery}"
            placeholder="Search transactions..." 
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm text-[#1B2623] dark:text-[#E9EDC9] focus:ring-2 focus:ring-[#3E5C54] focus:outline-none"
          />
        </div>

        <!-- Type Filter -->
        <div>
          <select id="select-type-filter" class="w-full px-3.5 py-2.5 bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9] focus:ring-2 focus:ring-[#3E5C54] focus:outline-none">
            <option value="all" ${selectedTypeFilter === 'all' ? 'selected' : ''}>All Types (Income & Expenses)</option>
            <option value="income" ${selectedTypeFilter === 'income' ? 'selected' : ''}>Income Only (+)</option>
            <option value="expense" ${selectedTypeFilter === 'expense' ? 'selected' : ''}>Expenses Only (-)</option>
          </select>
        </div>

        <!-- Category Filter -->
        <div>
          <select id="select-category-filter" class="w-full px-3.5 py-2.5 bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9] focus:ring-2 focus:ring-[#3E5C54] focus:outline-none">
            <option value="all" ${selectedCategoryFilter === 'all' ? 'selected' : ''}>All Categories</option>
            ${allCategories
              .map(
                (cat) =>
                  `<option value="${cat}" ${selectedCategoryFilter === cat ? 'selected' : ''}>${cat}</option>`
              )
              .join('')}
          </select>
        </div>

      </div>

      <!-- Transactions List / Table -->
      <div class="bg-white dark:bg-[#253632] rounded-3xl border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm overflow-hidden">
        ${
          transactions.length === 0
            ? `
          <div class="p-12 text-center">
            <div class="w-16 h-16 rounded-full bg-[#F2F1EC] dark:bg-[#1B2623] text-[#7A7D73] flex items-center justify-center mx-auto mb-3">
              ${icons.transactions}
            </div>
            <h3 class="font-heading font-bold text-lg text-[#1B2623] dark:text-[#E9EDC9]">No Transactions Found</h3>
            <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 max-w-sm mx-auto mt-1">
              Try adjusting your search filters or add a new transaction record.
            </p>
          </div>
        `
            : `
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-[#FDFCF9] dark:bg-[#1B2623] text-[#7A7D73] dark:text-[#E9EDC9]/70 text-xs uppercase font-bold tracking-wider border-b border-[#F2F1EC] dark:border-[#3E5C54]/30">
                <tr>
                  <th class="py-3.5 px-6">Transaction</th>
                  <th class="py-3.5 px-4">Category</th>
                  <th class="py-3.5 px-4">Account</th>
                  <th class="py-3.5 px-4">Date</th>
                  <th class="py-3.5 px-6 text-right">Amount</th>
                  <th class="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#F2F1EC] dark:divide-[#3E5C54]/20">
                ${transactions
                  .map((tx) => {
                    const isInc = tx.type === 'income';
                    return `
                      <tr class="hover:bg-[#FDFCF9] dark:hover:bg-[#1B2623]/60 transition-colors">
                        <td class="py-4 px-6 font-semibold text-[#1B2623] dark:text-[#E9EDC9]">
                          <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isInc
                                ? 'bg-[#6B8E4E]/15 text-[#6B8E4E] dark:text-[#88b066]'
                                : 'bg-[#BC6C25]/15 text-[#BC6C25] dark:text-[#e0893f]'
                            }">
                              ${isInc ? icons.arrowUp : icons.arrowDown}
                            </div>
                            <div>
                              <span class="block">${tx.description}</span>
                              <span class="text-[11px] text-[#7A7D73] dark:text-[#E9EDC9]/60 font-normal">${tx.paymentMethod}</span>
                            </div>
                          </div>
                        </td>

                        <td class="py-4 px-4 font-medium text-xs">
                          <span class="px-2.5 py-1 rounded-md bg-[#F2F1EC] dark:bg-[#1B2623] text-[#1B2623] dark:text-[#E9EDC9] font-semibold">
                            ${tx.category}
                          </span>
                        </td>

                        <td class="py-4 px-4 text-[#7A7D73] dark:text-[#E9EDC9]/80 text-xs font-medium">
                          ${tx.accountName || 'Primary Account'}
                        </td>

                        <td class="py-4 px-4 text-[#7A7D73] dark:text-[#E9EDC9]/80 text-xs font-medium">
                          ${tx.date}
                        </td>

                        <td class="py-4 px-6 text-right font-heading font-extrabold text-sm ${
                          isInc ? 'text-[#6B8E4E] dark:text-[#88b066]' : 'text-[#BC6C25] dark:text-[#e0893f]'
                        }">
                          ${isInc ? '+' : '-'}${store.formatCurrency(tx.amount)}
                        </td>

                        <td class="py-4 px-4 text-center">
                          <button 
                            data-delete-tx="${tx.id}" 
                            class="p-2 text-[#7A7D73] hover:text-[#BC6C25] rounded-lg hover:bg-[#BC6C25]/10 transition-colors cursor-pointer"
                            title="Delete Transaction"
                          >
                            ${icons.trash}
                          </button>
                        </td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        `
        }
      </div>

    </div>
  `;
}

export function bindTransactionsEvents(): void {
  document.getElementById('btn-tx-add-new')?.addEventListener('click', () => {
    openTransactionModal();
  });

  const searchInput = document.getElementById('input-search-tx') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    refreshView();
  });

  document.getElementById('select-type-filter')?.addEventListener('change', (e) => {
    selectedTypeFilter = (e.target as HTMLSelectElement).value;
    refreshView();
  });

  document.getElementById('select-category-filter')?.addEventListener('change', (e) => {
    selectedCategoryFilter = (e.target as HTMLSelectElement).value;
    refreshView();
  });

  document.querySelectorAll('[data-delete-tx]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-delete-tx');
      if (id && confirm('Are you sure you want to delete this transaction record?')) {
        store.deleteTransaction(id);
      }
    });
  });

  // CSV Export
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const txs = store.getTransactions();
    let csv = 'ID,Date,Type,Category,Description,Amount,PaymentMethod,Account\n';
    txs.forEach((t) => {
      csv += `"${t.id}","${t.date}","${t.type}","${t.category}","${t.description.replace(/"/g, '""')}",${t.amount},"${t.paymentMethod}","${t.accountName || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaulta_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

function refreshView(): void {
  const container = document.getElementById('main-content');
  if (container) {
    container.innerHTML = renderTransactionsView();
    bindTransactionsEvents();
  }
}
