import './index.css';
import { store } from './store/state';
import { renderNavbar, bindNavbarEvents } from './components/Navbar';
import { renderSidebar, bindSidebarEvents } from './components/Sidebar';
import { renderAuthView, bindAuthEvents } from './views/AuthView';
import { renderDashboardView, bindDashboardEvents } from './views/DashboardView';
import { renderTransactionsView, bindTransactionsEvents } from './views/TransactionsView';
import { renderBudgetsView, bindBudgetsEvents } from './views/BudgetsView';
import { renderGoalsView, bindGoalsEvents } from './views/GoalsView';
import { renderAnalyticsView, bindAnalyticsEvents } from './views/AnalyticsView';
import { renderAccountsView, bindAccountsEvents } from './views/AccountsView';
import { renderSettingsView, bindSettingsEvents } from './views/SettingsView';
import { initPWAInstallListener } from './components/PWAInstallModal';

// Register Service Worker for PWA
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('Vaulta SW registered:', reg.scope))
      .catch((err) => console.log('Vaulta SW registration failed:', err));
  });
}

function renderApp(): void {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const isAuthenticated = store.getIsAuthenticated();

  // If unauthenticated, show Auth View
  if (!isAuthenticated) {
    appContainer.innerHTML = renderAuthView();
    bindAuthEvents();
    return;
  }

  const activeTab = store.getActiveTab();

  // Render View Content based on Active Tab
  let viewContentHtml = '';
  switch (activeTab) {
    case 'dashboard':
      viewContentHtml = renderDashboardView();
      break;
    case 'transactions':
      viewContentHtml = renderTransactionsView();
      break;
    case 'budgets':
      viewContentHtml = renderBudgetsView();
      break;
    case 'goals':
      viewContentHtml = renderGoalsView();
      break;
    case 'analytics':
      viewContentHtml = renderAnalyticsView();
      break;
    case 'accounts':
      viewContentHtml = renderAccountsView();
      break;
    case 'settings':
      viewContentHtml = renderSettingsView();
      break;
    default:
      viewContentHtml = renderDashboardView();
  }

  appContainer.innerHTML = `
    <!-- Top Fixed Navbar -->
    ${renderNavbar()}

    <!-- Main Layout Container -->
    <div class="flex-1 flex max-w-7xl w-full mx-auto">
      
      <!-- Responsive Sidebar -->
      ${renderSidebar()}

      <!-- Main Content Area -->
      <main id="main-content" class="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
        <div>
          ${viewContentHtml}
        </div>

        <!-- Footer Developer Credit -->
        <footer class="mt-8 pt-4 border-t border-[#F2F1EC] dark:border-[#3E5C54]/30 text-center text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 font-medium">
          Developed & Designed by <span class="font-bold text-[#3E5C54] dark:text-[#E9EDC9]">Umme Asmia</span>
        </footer>
      </main>

    </div>

    <!-- Modal Root Containers -->
    <div id="modal-root"></div>
    <div id="pwa-modal-root"></div>
  `;

  // Bind Events for Active Components
  bindNavbarEvents();
  bindSidebarEvents();

  switch (activeTab) {
    case 'dashboard':
      bindDashboardEvents();
      break;
    case 'transactions':
      bindTransactionsEvents();
      break;
    case 'budgets':
      bindBudgetsEvents();
      break;
    case 'goals':
      bindGoalsEvents();
      break;
    case 'analytics':
      bindAnalyticsEvents();
      break;
    case 'accounts':
      bindAccountsEvents();
      break;
    case 'settings':
      bindSettingsEvents();
      break;
  }
}

// Subscribe App re-render on Store State changes
store.subscribe(() => {
  renderApp();
});

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  initPWAInstallListener();
});

// Fallback direct execution
renderApp();
initPWAInstallListener();
