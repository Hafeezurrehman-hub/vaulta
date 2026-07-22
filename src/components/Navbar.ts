import { store } from '../store/state';
import { icons } from '../utils/icons';

export function renderNavbar(): string {
  const activeTab = store.getActiveTab();
  const user = store.getUser();
  const settings = store.getSettings();

  const tabTitles: Record<string, string> = {
    dashboard: 'Financial Overview',
    transactions: 'Income & Expense Log',
    budgets: 'Monthly Budget Planning',
    goals: 'Savings & Capital Goals',
    analytics: 'Financial Analytics & Trends',
    accounts: 'Accounts & Wallets',
    settings: 'App Preferences & Profile',
  };

  return `
    <header class="sticky top-0 z-30 bg-[#FDFCF9]/90 dark:bg-[#1B2623]/90 backdrop-blur-md border-b border-[#F2F1EC] dark:border-[#3E5C54]/30 px-4 sm:px-6 py-3 transition-colors duration-200">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <!-- Left: Logo & Mobile Title -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <div class="flex items-center gap-2 sm:gap-2.5 cursor-pointer" id="nav-brand-logo">
            <img src="${import.meta.env.BASE_URL}vaulta-logo.jpg" alt="Vaulta Logo" class="w-9 h-9 sm:w-10 sm:h-10 object-cover shrink-0 aspect-square rounded-xl shadow-sm border border-[#3E5C54]/20 bg-white" />
            <div class="hidden sm:block">
              <span class="font-heading font-extrabold text-xl tracking-tight text-[#3E5C54] dark:text-[#E9EDC9]">VAULTA</span>
              <span class="block text-[10px] tracking-widest text-[#BC6C25] dark:text-[#DDA15E] font-bold uppercase -mt-1">Budgeting</span>
            </div>
          </div>

          <div class="h-6 w-px bg-[#F2F1EC] dark:bg-[#3E5C54]/30 hidden sm:block"></div>

          <div>
            <h1 class="text-sm sm:text-base md:text-lg font-bold font-heading text-[#1B2623] dark:text-[#E9EDC9]">
              ${tabTitles[activeTab] || 'Vaulta'}
            </h1>
            <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 hidden md:block">
              Welcome back, <span class="font-semibold text-[#3E5C54] dark:text-[#DDA15E]">${user.name}</span>
            </p>
          </div>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          <!-- PWA Install Button (Visible on both mobile & desktop) -->
          <button id="btn-pwa-header" class="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 bg-[#DDA15E]/15 hover:bg-[#DDA15E]/25 text-[#1B2623] dark:text-[#E9EDC9] font-bold text-xs rounded-xl border border-[#DDA15E]/40 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0" title="Install Vaulta App">
            ${icons.mobileInstall}
            <span class="hidden sm:inline">Install App</span>
            <span class="sm:hidden text-[11px]">Install</span>
          </button>

          <!-- Add Transaction Quick Button -->
          <button id="btn-quick-add" class="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#3E5C54] hover:bg-[#2d453f] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-all duration-200 active:scale-95 cursor-pointer shrink-0">
            ${icons.plus}
            <span class="hidden sm:inline">Add Transaction</span>
            <span class="sm:hidden">Add</span>
          </button>

          <!-- Theme Toggle -->
          <button id="btn-theme-toggle" class="p-2 sm:p-2.5 rounded-xl bg-[#F2F1EC] dark:bg-[#253632] hover:bg-[#e6e4dc] dark:hover:bg-[#2d423e] text-[#1B2623] dark:text-[#E9EDC9] transition-colors cursor-pointer shrink-0" title="Toggle Light/Dark Theme">
            ${settings.theme === 'dark' ? icons.sun : icons.moon}
          </button>

          <!-- User Avatar Badge -->
          <div id="btn-user-profile" class="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#F2F1EC] dark:border-[#3E5C54]/30 cursor-pointer" title="Profile Settings">
            <div class="w-10 h-10 rounded-full bg-[#3E5C54] text-white font-bold font-heading text-sm flex items-center justify-center border-2 border-white dark:border-[#253632] shadow-sm">
              ${user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
          </div>

        </div>

      </div>
    </header>
  `;
}

export function bindNavbarEvents(): void {
  document.getElementById('nav-brand-logo')?.addEventListener('click', () => {
    store.setActiveTab('dashboard');
  });

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    store.toggleTheme();
  });

  document.getElementById('btn-user-profile')?.addEventListener('click', () => {
    store.setActiveTab('settings');
  });

  document.getElementById('btn-pwa-header')?.addEventListener('click', () => {
    const triggerBtn = document.getElementById('btn-pwa-banner-trigger');
    if (triggerBtn) {
      triggerBtn.click();
    } else {
      window.dispatchEvent(new Event('show-pwa-prompt'));
    }
  });
}
