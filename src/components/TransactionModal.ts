import { store } from '../store/state';
import { CategoryType, PaymentMethod, TransactionType } from '../types';
import { icons } from '../utils/icons';

const categories: CategoryType[] = [
  'Housing & Rent',
  'Food & Dining',
  'Groceries',
  'Transportation & Fuel',
  'Utilities & Bills',
  'Shopping & Lifestyle',
  'Healthcare & Medical',
  'Education & Books',
  'Entertainment & Leisure',
  'Salary & Wage',
  'Freelance & Business',
  'Investment Return',
  'Gifts & Bonus',
  'Other Expenses',
  'Other Income',
];

const paymentMethods: PaymentMethod[] = [
  'Cash',
  'Bank Transfer',
  'Debit Card',
  'Credit Card',
  'Digital Wallet',
  'Direct Deposit',
];

export function openTransactionModal(defaultType: TransactionType = 'expense'): void {
  const container = document.getElementById('modal-root');
  if (!container) return;

  const accounts = store.getAccounts();
  const settings = store.getSettings();
  const todayStr = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-[#142722] w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative max-h-[90vh] overflow-y-auto">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-5">
          <div class="flex items-center gap-2">
            <div class="p-2.5 rounded-xl bg-[#0d4234]/10 dark:bg-emerald-400/10 text-[#0d4234] dark:text-emerald-400">
              ${icons.plus}
            </div>
            <div>
              <h3 class="font-heading font-extrabold text-lg text-stone-900 dark:text-stone-100">Add New Transaction</h3>
              <p class="text-xs text-stone-500 dark:text-stone-400">Record income or expense to keep budgets accurate</p>
            </div>
          </div>

          <button id="btn-modal-close" class="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer">
            ${icons.close}
          </button>
        </div>

        <form id="form-add-transaction" class="space-y-4">
          
          <!-- Income / Expense Type Selector -->
          <div class="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 dark:bg-stone-900/80 rounded-2xl">
            <button type="button" id="type-expense" class="py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
              defaultType === 'expense'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }">
              Expense (-)
            </button>
            <button type="button" id="type-income" class="py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
              defaultType === 'income'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }">
              Income (+)
            </button>
          </div>
          <input type="hidden" id="tx-type" value="${defaultType}" />

          <!-- Amount -->
          <div>
            <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Amount (${settings.currencySymbol}) *
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">
                ${settings.currencySymbol}
              </span>
              <input 
                type="number" 
                id="tx-amount" 
                required 
                min="1" 
                step="any" 
                placeholder="e.g. 5000"
                class="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl font-bold text-base text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#0d4234] focus:outline-none"
              />
            </div>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Category *</label>
            <select id="tx-category" required class="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-medium text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#0d4234] focus:outline-none">
              ${categories
                .map((cat) => `<option value="${cat}">${cat}</option>`)
                .join('')}
            </select>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Description / Notes</label>
            <input 
              type="text" 
              id="tx-description" 
              placeholder="e.g. Weekly Supermarket Grocery Shopping" 
              class="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#0d4234] focus:outline-none"
            />
          </div>

          <!-- Date & Payment Method -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Date *</label>
              <input 
                type="date" 
                id="tx-date" 
                value="${todayStr}" 
                required 
                class="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#0d4234] focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Payment Method</label>
              <select id="tx-payment-method" class="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#0d4234] focus:outline-none">
                ${paymentMethods
                  .map((pm) => `<option value="${pm}">${pm}</option>`)
                  .join('')}
              </select>
            </div>
          </div>

          <!-- Account / Wallet Selection -->
          <div>
            <label class="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Account / Wallet *</label>
            <select id="tx-account" required class="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-medium text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#0d4234] focus:outline-none">
              ${accounts
                .map(
                  (acc) =>
                    `<option value="${acc.id}">${acc.name} (${store.formatCurrency(acc.balance)})</option>`
                )
                .join('')}
            </select>
          </div>

          <!-- Actions -->
          <div class="pt-3 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
            <button type="button" id="btn-modal-cancel" class="px-4 py-2.5 text-sm font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2.5 bg-[#0d4234] hover:bg-[#082e24] text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer">
              Save Transaction
            </button>
          </div>

        </form>

      </div>
    </div>
  `;

  // Bind type buttons
  const btnExp = document.getElementById('type-expense');
  const btnInc = document.getElementById('type-income');
  const inputType = document.getElementById('tx-type') as HTMLInputElement;

  btnExp?.addEventListener('click', () => {
    inputType.value = 'expense';
    btnExp.className = 'py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 bg-rose-600 text-white shadow-md cursor-pointer';
    btnInc!.className = 'py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 text-stone-600 dark:text-stone-400 hover:text-stone-900 cursor-pointer';
  });

  btnInc?.addEventListener('click', () => {
    inputType.value = 'income';
    btnInc.className = 'py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 bg-emerald-600 text-white shadow-md cursor-pointer';
    btnExp!.className = 'py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 text-stone-600 dark:text-stone-400 hover:text-stone-900 cursor-pointer';
  });

  document.getElementById('btn-modal-close')?.addEventListener('click', closeModal);
  document.getElementById('btn-modal-cancel')?.addEventListener('click', closeModal);

  document.getElementById('form-add-transaction')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amountVal = parseFloat((document.getElementById('tx-amount') as HTMLInputElement).value);
    const categoryVal = (document.getElementById('tx-category') as HTMLSelectElement).value as CategoryType;
    const descVal = (document.getElementById('tx-description') as HTMLInputElement).value || categoryVal;
    const dateVal = (document.getElementById('tx-date') as HTMLInputElement).value;
    const pmVal = (document.getElementById('tx-payment-method') as HTMLSelectElement).value as PaymentMethod;
    const accountVal = (document.getElementById('tx-account') as HTMLSelectElement).value;

    if (!amountVal || isNaN(amountVal)) return;

    store.addTransaction({
      amount: amountVal,
      type: inputType.value as TransactionType,
      category: categoryVal,
      description: descVal,
      date: dateVal,
      paymentMethod: pmVal,
      accountId: accountVal,
    });

    closeModal();
  });
}

export function closeModal(): void {
  const container = document.getElementById('modal-root');
  if (container) {
    container.innerHTML = '';
  }
}
