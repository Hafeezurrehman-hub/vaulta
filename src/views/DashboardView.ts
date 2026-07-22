import { store } from '../store/state';
import { icons } from '../utils/icons';
import { openTransactionModal } from '../components/TransactionModal';

export function renderDashboardView(): string {
  const metrics = store.getMetrics();
  const transactions = store.getTransactions().slice(0, 5); // top 5
  const budgets = store.getBudgets();
  const goals = store.getGoals();
  const user = store.getUser();

  // Financial Health Calculation
  const savingsRate = metrics.totalIncome > 0 ? ((metrics.netSavings / metrics.totalIncome) * 100) : 0;
  let healthScore = Math.min(98, Math.max(40, Math.round(50 + savingsRate * 0.8)));
  let healthLabel = 'Good Control';

  if (healthScore >= 80) {
    healthLabel = 'Excellent Control';
  } else if (healthScore >= 60) {
    healthLabel = 'Balanced Budget';
  } else {
    healthLabel = 'High Spending Warning';
  }

  // Categories spending breakdown for chart
  const categoryTotals: Record<string, number> = {};
  store.getTransactions()
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalExpenseVal = metrics.totalExpenses || 1;

  return `
    <div class="space-y-8 animate-fade-in pb-16 md:pb-6">
      
      <!-- Header Greeting & User Info -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-heading text-[#1B2623] dark:text-[#E9EDC9]">
            Good Day, ${user.name}
          </h1>
          <p class="text-sm text-[#7A7D73] dark:text-[#E9EDC9]/70 mt-0.5">
            Here's what's happening with your money today.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-semibold text-[#1B2623] dark:text-[#E9EDC9]">${user.name}</p>
            <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/60">Personal Account</p>
          </div>
          <div class="w-12 h-12 bg-[#3E5C54] rounded-full flex items-center justify-center text-white font-bold border-4 border-white dark:border-[#253632] shadow-sm">
            ${user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
        </div>
      </header>

      <!-- Stats Grid (Natural Tones 32px rounded cards) -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Total Balance -->
        <div class="bg-white dark:bg-[#253632] p-6 rounded-[32px] shadow-sm border border-[#F2F1EC] dark:border-[#3E5C54]/30 flex flex-col justify-between">
          <div>
            <p class="text-sm text-[#7A7D73] dark:text-[#E9EDC9]/70 font-medium mb-1">Total Balance</p>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-[#3E5C54] dark:text-[#E9EDC9]">
              ${store.formatCurrency(metrics.totalBalance)}
            </h2>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <span class="px-2 py-0.5 bg-[#6B8E4E]/15 text-[#6B8E4E] dark:text-[#88b066] text-xs font-bold rounded-lg">+12.5%</span>
            <span class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/60">vs last month</span>
          </div>
        </div>

        <!-- Monthly Income -->
        <div class="bg-white dark:bg-[#253632] p-6 rounded-[32px] shadow-sm border border-[#F2F1EC] dark:border-[#3E5C54]/30 flex flex-col justify-between">
          <div>
            <p class="text-sm text-[#7A7D73] dark:text-[#E9EDC9]/70 font-medium mb-1">Monthly Income</p>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-[#6B8E4E] dark:text-[#88b066]">
              ${store.formatCurrency(metrics.totalIncome)}
            </h2>
          </div>
          <div class="mt-4 text-xs text-[#7A7D73] dark:text-[#E9EDC9]/60 font-medium">
            Active cash inflow log
          </div>
        </div>

        <!-- Monthly Expenses -->
        <div class="bg-white dark:bg-[#253632] p-6 rounded-[32px] shadow-sm border border-[#F2F1EC] dark:border-[#3E5C54]/30 flex flex-col justify-between">
          <div>
            <p class="text-sm text-[#7A7D73] dark:text-[#E9EDC9]/70 font-medium mb-1">Monthly Expenses</p>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-[#BC6C25] dark:text-[#e0893f]">
              ${store.formatCurrency(metrics.totalExpenses)}
            </h2>
          </div>
          <div class="mt-4 w-full bg-[#F2F1EC] dark:bg-[#1B2623] h-2 rounded-full overflow-hidden">
            <div class="bg-[#BC6C25] h-full rounded-full transition-all duration-500" style="width: ${Math.min(100, Math.round((metrics.totalExpenses / (metrics.totalIncome || 1)) * 100))}%"></div>
          </div>
        </div>

        <!-- Net Savings / Health -->
        <div class="bg-white dark:bg-[#253632] p-6 rounded-[32px] shadow-sm border border-[#F2F1EC] dark:border-[#3E5C54]/30 flex flex-col justify-between">
          <div>
            <p class="text-sm text-[#7A7D73] dark:text-[#E9EDC9]/70 font-medium mb-1">Net Savings Surplus</p>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-[#DDA15E]">
              +${store.formatCurrency(metrics.netSavings)}
            </h2>
          </div>
          <div class="mt-4 flex items-center justify-between text-xs">
            <span class="text-[#7A7D73] dark:text-[#E9EDC9]/60">Savings Rate:</span>
            <span class="font-bold text-[#3E5C54] dark:text-[#E9EDC9]">${savingsRate.toFixed(1)}%</span>
          </div>
        </div>

      </section>

      <!-- Action Buttons Row -->
      <div class="flex flex-wrap items-center gap-4">
        <button id="dash-add-income" class="flex-1 min-w-[150px] py-3.5 px-5 bg-[#6B8E4E] hover:bg-[#597840] text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95">
          ${icons.plus}
          <span>+ Add Income</span>
        </button>

        <button id="dash-add-expense" class="flex-1 min-w-[150px] py-3.5 px-5 bg-[#BC6C25] hover:bg-[#a65d1d] text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95">
          ${icons.plus}
          <span>+ Add Expense</span>
        </button>

        <button id="btn-view-analytics-dash" class="py-3.5 px-5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95">
          ${icons.analytics}
          <span>View Analytics</span>
        </button>
      </div>

      <!-- Main Content Grid: Recent Transactions + Savings Goals -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Recent Transactions Column (2 cols) -->
        <div class="lg:col-span-2 bg-white dark:bg-[#253632] rounded-[32px] p-6 shadow-sm border border-[#F2F1EC] dark:border-[#3E5C54]/30 flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-lg font-bold font-heading text-[#1B2623] dark:text-[#E9EDC9]">Recent Transactions</h3>
              <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/60">Your latest income and spending records</p>
            </div>
            <button id="btn-view-all-tx" class="text-sm font-bold text-[#3E5C54] dark:text-[#DDA15E] hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div class="space-y-3.5 flex-1">
            ${transactions
              .map((tx) => {
                const isInc = tx.type === 'income';
                return `
                  <div class="flex items-center justify-between p-4 bg-[#FDFCF9] dark:bg-[#1B2623] rounded-2xl border border-[#F2F1EC]/60 dark:border-[#3E5C54]/20">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isInc ? 'bg-[#6B8E4E]/15 text-[#6B8E4E] dark:text-[#88b066]' : 'bg-[#BC6C25]/15 text-[#BC6C25] dark:text-[#e0893f]'
                      }">
                        ${isInc ? icons.arrowUp : icons.arrowDown}
                      </div>
                      <div>
                        <p class="font-bold text-sm text-[#1B2623] dark:text-[#E9EDC9]">${tx.description}</p>
                        <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/60">${tx.date} • ${tx.category}</p>
                      </div>
                    </div>
                    <p class="font-extrabold font-heading text-sm sm:text-base ${
                      isInc ? 'text-[#6B8E4E] dark:text-[#88b066]' : 'text-[#BC6C25] dark:text-[#e0893f]'
                    }">
                      ${isInc ? '+' : '-'}${store.formatCurrency(tx.amount)}
                    </p>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- Savings Goals Card (1 col - Natural Tones Forest Green Card) -->
        <div class="bg-[#3E5C54] text-white rounded-[32px] p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold font-heading text-white">Savings Goals</h3>
              <button id="btn-add-goal-dash" class="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-xl font-light leading-none cursor-pointer transition-colors" title="Create New Goal">
                +
              </button>
            </div>

            <div class="space-y-6">
              ${goals
                .slice(0, 3)
                .map((goal) => {
                  const pct = Math.min(100, Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100));
                  return `
                    <div>
                      <div class="flex justify-between text-sm mb-2">
                        <span class="text-[#E9EDC9] font-medium">${goal.title}</span>
                        <span class="font-bold text-[#DDA15E]">${pct}%</span>
                      </div>
                      <div class="w-full bg-white/15 h-2.5 rounded-full overflow-hidden">
                        <div class="bg-[#DDA15E] h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                      </div>
                      <p class="text-xs mt-1.5 text-white/60">
                        ${store.formatCurrency(goal.currentAmount)} / ${store.formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>

          <div class="mt-8 pt-4 border-t border-white/15">
            <div class="bg-white/10 rounded-2xl p-4">
              <p class="text-xs italic font-serif text-[#E9EDC9] leading-relaxed">
                "Smart money management is the first step towards true freedom."
              </p>
              <p class="text-[10px] mt-1.5 text-white/50 font-sans uppercase tracking-wider">— Vaulta Insights</p>
            </div>
          </div>
        </div>

      </section>

    </div>
  `;
}

export function bindDashboardEvents(): void {
  document.getElementById('dash-add-income')?.addEventListener('click', () => {
    openTransactionModal('income');
  });

  document.getElementById('dash-add-expense')?.addEventListener('click', () => {
    openTransactionModal('expense');
  });

  document.getElementById('btn-view-all-tx')?.addEventListener('click', () => {
    store.setActiveTab('transactions');
  });

  document.getElementById('btn-view-analytics-dash')?.addEventListener('click', () => {
    store.setActiveTab('analytics');
  });

  document.getElementById('btn-add-goal-dash')?.addEventListener('click', () => {
    store.setActiveTab('goals');
  });
}
