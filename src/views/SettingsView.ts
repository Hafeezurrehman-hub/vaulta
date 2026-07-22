import { store } from '../store/state';
import { CurrencyCode } from '../types';
import { icons } from '../utils/icons';

const currencyList: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'PKR', symbol: 'Rs.', label: 'Pakistani Rupee (PKR - Rs.)' },
  { code: 'USD', symbol: '$', label: 'US Dollar (USD - $)' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR - €)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (GBP - £)' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham (AED)' },
  { code: 'SAR', symbol: 'SAR', label: 'Saudi Riyal (SAR)' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR - ₹)' },
];

export function renderSettingsView(): string {
  const settings = store.getSettings();
  const user = store.getUser();

  return `
    <div class="space-y-6 max-w-4xl mx-auto animate-fade-in pb-16 md:pb-6">
      
      <!-- Top Action Bar -->
      <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
        <h2 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9]">
          Settings & App Preferences
        </h2>
        <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
          Customize currency, appearance, profile details, and backup data
        </p>
      </div>

      <!-- User Profile Card -->
      <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
        <div class="flex items-center gap-4 mb-6 pb-6 border-b border-[#F2F1EC] dark:border-[#3E5C54]/30">
          <div class="w-16 h-16 rounded-2xl bg-[#3E5C54]/10 dark:bg-[#3E5C54]/30 text-[#3E5C54] dark:text-[#E9EDC9] font-bold font-heading text-xl flex items-center justify-center border border-[#3E5C54]/20 shadow-sm">
            ${user.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
          </div>

          <div>
            <h3 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9]">
              ${user.name}
            </h3>
            <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">${user.email}</p>
            <span class="inline-block px-2.5 py-0.5 rounded-md bg-[#3E5C54]/10 text-[#3E5C54] dark:text-[#E9EDC9] font-bold text-[10px] uppercase tracking-wider mt-1">
              Member Since ${user.memberSince}
            </span>
          </div>
        </div>

        <form id="form-user-profile" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Full Name</label>
            <input 
              type="text" 
              id="set-user-name" 
              value="${user.name}" 
              required 
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Email Address</label>
            <input 
              type="email" 
              id="set-user-email" 
              value="${user.email}" 
              required 
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div class="sm:col-span-2 text-right pt-2">
            <button type="submit" class="px-5 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer">
              Update Profile Details
            </button>
          </div>
        </form>
      </div>

      <!-- Preferences: Currency & Theme -->
      <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm space-y-6">
        
        <h3 class="font-heading font-extrabold text-base text-[#1B2623] dark:text-[#E9EDC9]">
          Display & Regional Preferences
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <!-- Currency Selection -->
          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Primary Display Currency</label>
            <select id="set-currency" class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-bold text-[#1B2623] dark:text-[#E9EDC9] focus:ring-2 focus:ring-[#3E5C54]">
              ${currencyList
                .map(
                  (c) =>
                    `<option value="${c.code}" data-symbol="${c.symbol}" ${
                      settings.currency === c.code ? 'selected' : ''
                    }>${c.label}</option>`
                )
                .join('')}
            </select>
            <span class="text-[11px] text-[#7A7D73] dark:text-[#E9EDC9]/70 mt-1 block">Default currency is set to PKR (Rs.)</span>
          </div>

          <!-- Theme Preference -->
          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Visual Theme Mode</label>
            <div class="grid grid-cols-2 gap-2 p-1 bg-[#F2F1EC] dark:bg-[#1B2623] rounded-2xl">
              <button 
                type="button" 
                id="btn-set-theme-light" 
                class="py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-white text-[#1B2623] shadow-sm'
                    : 'text-[#7A7D73] hover:text-[#1B2623]'
                }"
              >
                ${icons.sun}
                <span>Light Theme</span>
              </button>

              <button 
                type="button" 
                id="btn-set-theme-dark" 
                class="py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-[#3E5C54] text-white shadow-sm'
                    : 'text-[#7A7D73] dark:text-[#E9EDC9]/70 hover:text-[#E9EDC9]'
                }"
              >
                ${icons.moon}
                <span>Dark Theme</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      <!-- Data Backup, Export & Import -->
      <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm space-y-4">
        <h3 class="font-heading font-extrabold text-base text-[#1B2623] dark:text-[#E9EDC9]">
          Data Management & Backup
        </h3>
        <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
          Export your complete Vaulta database to JSON format or restore from a previous backup
        </p>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          
          <button id="btn-export-json" class="px-4 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 cursor-pointer">
            ${icons.download}
            <span>Export Full Data (JSON)</span>
          </button>

          <label class="px-4 py-2.5 bg-[#F2F1EC] dark:bg-[#1B2623] hover:bg-[#e3e1d8] text-[#1B2623] dark:text-[#E9EDC9] font-bold text-xs rounded-xl cursor-pointer flex items-center gap-2">
            <span>Import JSON Backup</span>
            <input type="file" id="input-import-json" accept=".json" class="hidden" />
          </label>

          <button id="btn-pwa-settings-trigger" class="px-4 py-2.5 bg-[#DDA15E]/15 hover:bg-[#DDA15E]/25 text-[#1B2623] dark:text-[#E9EDC9] font-bold text-xs rounded-xl border border-[#DDA15E]/30 cursor-pointer flex items-center gap-2">
            ${icons.mobileInstall}
            <span>Install PWA App</span>
          </button>

        </div>
      </div>

      <!-- Danger Zone / Sign Out & Reset -->
      <div class="p-6 rounded-3xl bg-[#BC6C25]/10 border border-[#BC6C25]/30 shadow-sm space-y-3">
        <h3 class="font-heading font-extrabold text-base text-[#BC6C25]">
          Danger Zone
        </h3>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div>
            <p class="text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9]">Reset Application to Factory Seed Data</p>
            <p class="text-[11px] text-[#7A7D73] dark:text-[#E9EDC9]/70">Clears custom edits and restores pre-populated PKR transactions</p>
          </div>

          <div class="flex items-center gap-3">
            <button id="btn-reset-data" class="px-4 py-2 bg-[#BC6C25] hover:bg-[#a0591c] text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm">
              Reset All Data
            </button>

            <button id="btn-logout" class="px-4 py-2 bg-[#1B2623] hover:bg-[#2b3a36] text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5">
              ${icons.logout}
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  `;
}

export function bindSettingsEvents(): void {
  // Update Profile
  document.getElementById('form-user-profile')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('set-user-name') as HTMLInputElement).value;
    const email = (document.getElementById('set-user-email') as HTMLInputElement).value;
    if (name && email) {
      store.updateUserProfile(name, email);
      alert('Profile details updated successfully!');
    }
  });

  // Currency select
  document.getElementById('set-currency')?.addEventListener('change', (e) => {
    const select = e.target as HTMLSelectElement;
    const code = select.value as CurrencyCode;
    const opt = select.selectedOptions[0];
    const symbol = opt.getAttribute('data-symbol') || 'Rs.';

    store.updateSettings({
      currency: code,
      currencySymbol: symbol,
    });
  });

  // Theme
  document.getElementById('btn-set-theme-light')?.addEventListener('click', () => {
    store.updateSettings({ theme: 'light' });
    refreshView();
  });

  document.getElementById('btn-set-theme-dark')?.addEventListener('click', () => {
    store.updateSettings({ theme: 'dark' });
    refreshView();
  });

  // PWA Install Trigger from settings
  document.getElementById('btn-pwa-settings-trigger')?.addEventListener('click', () => {
    window.dispatchEvent(new Event('show-pwa-prompt'));
  });

  // JSON Export
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const backupData = {
      user: store.getUser(),
      transactions: store.getTransactions(),
      budgets: store.getBudgets(),
      goals: store.getGoals(),
      accounts: store.getAccounts(),
      transfers: store.getTransfers(),
      settings: store.getSettings(),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaulta_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // JSON Import
  document.getElementById('input-import-json')?.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target?.result as string);
          if (parsed.transactions && parsed.accounts) {
            localStorage.setItem('vaulta_transactions', JSON.stringify(parsed.transactions));
            localStorage.setItem('vaulta_accounts', JSON.stringify(parsed.accounts));
            if (parsed.budgets) localStorage.setItem('vaulta_budgets', JSON.stringify(parsed.budgets));
            if (parsed.goals) localStorage.setItem('vaulta_goals', JSON.stringify(parsed.goals));
            if (parsed.user) localStorage.setItem('vaulta_user', JSON.stringify(parsed.user));
            alert('Backup data restored successfully!');
            location.reload();
          } else {
            alert('Invalid Vaulta backup file structure.');
          }
        } catch {
          alert('Error parsing JSON backup file.');
        }
      };
      reader.readAsText(file);
    }
  });

  // Reset Data
  document.getElementById('btn-reset-data')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset Vaulta to original seed data? All custom transactions will be cleared.')) {
      store.resetAllData();
      alert('Data reset to defaults.');
      refreshView();
    }
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    store.logout();
  });
}

function refreshView(): void {
  const container = document.getElementById('main-content');
  if (container) {
    container.innerHTML = renderSettingsView();
    bindSettingsEvents();
  }
}
