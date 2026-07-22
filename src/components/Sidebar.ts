import { store } from '../store/state';
import { ActiveTab } from '../types';
import { icons } from '../utils/icons';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
  { id: 'transactions', label: 'Transactions', icon: icons.transactions },
  { id: 'budgets', label: 'Budgets', icon: icons.budgets },
  { id: 'goals', label: 'Savings Goals', icon: icons.goals },
  { id: 'analytics', label: 'Analytics', icon: icons.analytics },
  { id: 'accounts', label: 'Accounts', icon: icons.accounts },
  { id: 'settings', label: 'Settings', icon: icons.settings },
];

export function renderSidebar(): string {
  const activeTab = store.getActiveTab();

  // Desktop Sidebar
  const desktopSidebar = `
    <aside class="hidden md:flex flex-col w-64 bg-[#3E5C54] text-[#E9EDC9] p-4 shrink-0 transition-colors duration-200">
      
      <!-- Vaulta Brand Header in Sidebar -->
      <div class="px-3 py-3 mb-4 rounded-2xl bg-[#ffffff0a] border border-[#ffffff15] text-white shadow-sm relative overflow-hidden group">
        <div class="flex items-center gap-3 relative z-10">
          <img src="${import.meta.env.BASE_URL}vaulta-logo.jpg" alt="Vaulta Logo" class="w-10 h-10 object-cover shrink-0 aspect-square bg-white rounded-xl shadow border border-[#DDA15E]/30" />
          <div>
            <h2 class="font-heading font-extrabold text-xl text-white leading-tight tracking-tight">VAULTA</h2>
            <p class="text-[10px] text-[#E9EDC9]/70 font-bold tracking-widest uppercase">Financial Control</p>
          </div>
        </div>
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 space-y-1.5">
        ${navItems
          .map((item) => {
            const isActive = activeTab === item.id;
            return `
              <button 
                data-nav-tab="${item.id}"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#ffffff15] text-white shadow-sm font-bold'
                    : 'text-[#E9EDC9]/70 hover:bg-[#ffffff08] hover:text-white'
                }"
              >
                <span class="${isActive ? 'text-[#DDA15E]' : 'opacity-70'}">
                  ${item.icon}
                </span>
                <span>${item.label}</span>
              </button>
            `;
          })
          .join('')}
      </nav>

      <!-- Sidebar Footer / PWA Box -->
      <div class="mt-auto pt-4 border-t border-[#ffffff15]">
        <div class="p-4 rounded-2xl bg-[#ffffff08] border border-[#ffffff10]">
          <p class="text-[10px] text-[#E9EDC9] opacity-60 font-bold uppercase tracking-wider mb-1">INSTALL VAULTA</p>
          <p class="text-xs text-white/90 mb-3 font-medium">Access your finances offline anytime.</p>
          <button id="btn-pwa-sidebar" class="w-full bg-[#DDA15E] hover:bg-[#c99050] text-[#3E5C54] py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer">
            Add to Home Screen
          </button>
        </div>
      </div>

    </aside>
  `;

  // Mobile Bottom Navigation Bar
  const mobileNav = `
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#3E5C54]/95 text-[#E9EDC9] backdrop-blur-lg border-t border-[#ffffff15] px-2 py-1.5 shadow-2xl">
      <div class="flex items-center justify-around">
        ${navItems
          .slice(0, 5) // Top 5 for mobile bottom bar
          .map((item) => {
            const isActive = activeTab === item.id;
            return `
              <button 
                data-nav-tab="${item.id}"
                class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer min-w-[56px] min-h-[48px] ${
                  isActive
                    ? 'text-white bg-[#ffffff15] font-bold'
                    : 'text-[#E9EDC9]/70 hover:text-white'
                }"
              >
                <div class="${isActive ? 'scale-110 text-[#DDA15E]' : ''} transition-transform">
                  ${item.icon}
                </div>
                <span class="text-[10px] mt-1 leading-none tracking-tight">${item.label}</span>
              </button>
            `;
          })
          .join('')}
        
        <!-- Mobile More Menu Trigger for Accounts & Settings -->
        <button 
          data-nav-tab="settings"
          class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer min-w-[56px] min-h-[48px] ${
            activeTab === 'accounts' || activeTab === 'settings'
              ? 'text-white bg-[#ffffff15] font-bold'
              : 'text-[#E9EDC9]/70'
          }"
        >
          <div>
            ${icons.settings}
          </div>
          <span class="text-[10px] mt-1 leading-none tracking-tight">More</span>
        </button>
      </div>
    </nav>
  `;

  return desktopSidebar + mobileNav;
}

export function bindSidebarEvents(): void {
  document.querySelectorAll('[data-nav-tab]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetTab = (e.currentTarget as HTMLElement).getAttribute('data-nav-tab') as ActiveTab;
      if (targetTab) {
        store.setActiveTab(targetTab);
      }
    });
  });

  document.getElementById('btn-pwa-sidebar')?.addEventListener('click', () => {
    window.dispatchEvent(new Event('show-pwa-prompt'));
  });
}
