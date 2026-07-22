import { store } from '../store/state';
import { AccountType } from '../types';
import { icons } from '../utils/icons';

export function renderAccountsView(): string {
  const accounts = store.getAccounts();
  const transfers = store.getTransfers();

  return `
    <div class="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
        <div>
          <h2 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9]">
            Accounts & Wallets
          </h2>
          <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
            Manage your bank accounts, physical cash, and digital wallets
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Transfer Funds Button -->
          <button id="btn-transfer-funds" class="px-3.5 py-2.5 bg-[#DDA15E] hover:bg-[#c98e4c] text-[#1B2623] font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer">
            ${icons.transfer}
            <span>Transfer Funds</span>
          </button>

          <!-- Add Account Button -->
          <button id="btn-add-account" class="px-4 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer">
            ${icons.plus}
            <span>Add Account</span>
          </button>
        </div>
      </div>

      <!-- Accounts Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${accounts
          .map((acc) => {
            let iconSvg = icons.wallet;
            let typeLabel = 'Account';

            if (acc.type === 'bank') {
              iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v4"/><path d="M12 14v4"/><path d="M16 14v4"/></svg>`;
              typeLabel = 'Bank Account';
            } else if (acc.type === 'cash') {
              iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/></svg>`;
              typeLabel = 'Cash Wallet';
            } else if (acc.type === 'wallet') {
              iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/></svg>`;
              typeLabel = 'Digital Wallet';
            }

            return `
              <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md" style="background-color: ${acc.color || '#3E5C54'}">
                      ${iconSvg}
                    </div>

                    <span class="px-2.5 py-1 rounded-md bg-[#F2F1EC] dark:bg-[#1B2623] text-[#1B2623] dark:text-[#E9EDC9] font-semibold text-xs">
                      ${typeLabel}
                    </span>
                  </div>

                  <h3 class="font-heading font-extrabold text-lg text-[#1B2623] dark:text-[#E9EDC9]">
                    ${acc.name}
                  </h3>
                  <p class="text-xs text-[#7A7D73] font-mono mb-4">
                    ${acc.accountNumber || acc.bankName || 'Personal Wallet'}
                  </p>

                  <div class="space-y-1">
                    <span class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 font-medium">Available Balance</span>
                    <p class="font-heading font-extrabold text-2xl text-[#1B2623] dark:text-[#E9EDC9]">
                      ${store.formatCurrency(acc.balance)}
                    </p>
                  </div>
                </div>

                <div class="mt-6 pt-3 border-t border-[#F2F1EC] dark:border-[#3E5C54]/30 flex items-center justify-end">
                  <button 
                    data-delete-acc="${acc.id}" 
                    class="text-xs text-[#7A7D73] hover:text-[#BC6C25] transition-colors cursor-pointer"
                  >
                    Delete Account
                  </button>
                </div>

              </div>
            `;
          })
          .join('')}
      </div>

      <!-- Transfer History Log -->
      ${
        transfers.length > 0
          ? `
        <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
          <h3 class="font-heading font-extrabold text-base text-[#1B2623] dark:text-[#E9EDC9] mb-4">
            Recent Account Transfers
          </h3>

          <div class="divide-y divide-[#F2F1EC] dark:divide-[#3E5C54]/20">
            ${transfers
              .map(
                (trf) => `
              <div class="py-3 flex items-center justify-between text-sm">
                <div class="flex items-center gap-3">
                  <div class="p-2.5 rounded-xl bg-[#DDA15E]/15 text-[#DDA15E]">
                    ${icons.transfer}
                  </div>
                  <div>
                    <span class="font-bold text-[#1B2623] dark:text-[#E9EDC9] block">
                      ${trf.fromAccountName} ➔ ${trf.toAccountName}
                    </span>
                    <span class="text-xs text-[#7A7D73]">${trf.date} ${trf.note ? '• ' + trf.note : ''}</span>
                  </div>
                </div>

                <span class="font-heading font-extrabold text-[#DDA15E]">
                  ${store.formatCurrency(trf.amount)}
                </span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }

    </div>
  `;
}

export function bindAccountsEvents(): void {
  document.getElementById('btn-add-account')?.addEventListener('click', openAddAccountModal);
  document.getElementById('btn-transfer-funds')?.addEventListener('click', openTransferModal);

  document.querySelectorAll('[data-delete-acc]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-delete-acc');
      if (id && confirm('Delete this account wallet?')) {
        store.deleteAccount(id);
      }
    });
  });
}

function openAddAccountModal(): void {
  const container = document.getElementById('modal-root');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#1B2623]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-[#253632] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#F2F1EC] dark:border-[#3E5C54]/30 relative">
        <button id="btn-acc-close" class="absolute top-4 right-4 p-2 text-[#7A7D73] hover:text-[#1B2623] cursor-pointer">
          ${icons.close}
        </button>

        <h3 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9] mb-1">
          Add New Account
        </h3>
        <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 mb-4">
          Add bank account, cash wallet, or digital mobile wallet
        </p>

        <form id="form-add-acc" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Account Name *</label>
            <input 
              type="text" 
              id="acc-name" 
              required 
              placeholder="e.g. Standard Chartered Savings" 
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Account Type</label>
            <select id="acc-type" class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9]">
              <option value="bank">Bank Account</option>
              <option value="cash">Cash Wallet</option>
              <option value="wallet">Digital Wallet (Easypaisa / JazzCash / Nayapay)</option>
              <option value="savings">Savings Account</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Initial Opening Balance (${store.getSettings().currencySymbol}) *</label>
            <input 
              type="number" 
              id="acc-balance" 
              required 
              min="0" 
              placeholder="e.g. 50000" 
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl font-bold text-base text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Account / IBAN Number (Optional)</label>
            <input 
              type="text" 
              id="acc-number" 
              placeholder="e.g. PK82 MEZN **** 1234" 
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div class="pt-3 flex justify-end gap-3 border-t border-[#F2F1EC] dark:border-[#3E5C54]/30">
            <button type="button" id="btn-acc-cancel" class="px-4 py-2 text-sm font-semibold text-[#7A7D73] cursor-pointer">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-sm rounded-xl shadow cursor-pointer">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('btn-acc-close')?.addEventListener('click', () => { container.innerHTML = ''; });
  document.getElementById('btn-acc-cancel')?.addEventListener('click', () => { container.innerHTML = ''; });

  document.getElementById('form-add-acc')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('acc-name') as HTMLInputElement).value;
    const type = (document.getElementById('acc-type') as HTMLSelectElement).value as AccountType;
    const balance = parseFloat((document.getElementById('acc-balance') as HTMLInputElement).value);
    const accountNumber = (document.getElementById('acc-number') as HTMLInputElement).value;

    const colors = ['#3E5C54', '#DDA15E', '#6B8E4E', '#BC6C25'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (name && !isNaN(balance)) {
      store.addAccount({
        name,
        type,
        balance,
        accountNumber,
        color: randomColor,
      });
      container.innerHTML = '';
    }
  });
}

function openTransferModal(): void {
  const container = document.getElementById('modal-root');
  if (!container) return;

  const accounts = store.getAccounts();

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#1B2623]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-[#253632] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#F2F1EC] dark:border-[#3E5C54]/30 relative">
        <button id="btn-trf-close" class="absolute top-4 right-4 p-2 text-[#7A7D73] hover:text-[#1B2623] cursor-pointer">
          ${icons.close}
        </button>

        <h3 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9] mb-1">
          Transfer Funds Between Accounts
        </h3>
        <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 mb-4">
          Move money seamlessly from one account or wallet to another
        </p>

        <form id="form-trf" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">From Account (Source)</label>
            <select id="trf-from" required class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9]">
              ${accounts
                .map(
                  (a) =>
                    `<option value="${a.id}">${a.name} (${store.formatCurrency(a.balance)})</option>`
                )
                .join('')}
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">To Account (Destination)</label>
            <select id="trf-to" required class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9]">
              ${accounts
                .map(
                  (a, idx) =>
                    `<option value="${a.id}" ${idx === 1 ? 'selected' : ''}>${a.name} (${store.formatCurrency(a.balance)})</option>`
                )
                .join('')}
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Transfer Amount (${store.getSettings().currencySymbol}) *</label>
            <input 
              type="number" 
              id="trf-amount" 
              required 
              min="1" 
              placeholder="e.g. 10000" 
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl font-bold text-base text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Note (Optional)</label>
            <input 
              type="text" 
              id="trf-note" 
              placeholder="e.g. ATM Cash Withdrawal" 
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div class="pt-3 flex justify-end gap-3 border-t border-[#F2F1EC] dark:border-[#3E5C54]/30">
            <button type="button" id="btn-trf-cancel" class="px-4 py-2 text-sm font-semibold text-[#7A7D73] cursor-pointer">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-sm rounded-xl shadow cursor-pointer">
              Execute Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('btn-trf-close')?.addEventListener('click', () => { container.innerHTML = ''; });
  document.getElementById('btn-trf-cancel')?.addEventListener('click', () => { container.innerHTML = ''; });

  document.getElementById('form-trf')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fromId = (document.getElementById('trf-from') as HTMLSelectElement).value;
    const toId = (document.getElementById('trf-to') as HTMLSelectElement).value;
    const amount = parseFloat((document.getElementById('trf-amount') as HTMLInputElement).value);
    const note = (document.getElementById('trf-note') as HTMLInputElement).value;

    if (fromId === toId) {
      alert('Source and destination accounts must be different!');
      return;
    }

    if (amount > 0) {
      const success = store.transferBetweenAccounts(fromId, toId, amount, note);
      if (!success) {
        alert('Insufficient balance in source account!');
      } else {
        container.innerHTML = '';
      }
    }
  });
}
