import { store } from '../store/state';
import { icons } from '../utils/icons';

let timeFilter = 'this-month';

export function renderAnalyticsView(): string {
  const transactions = store.getTransactions();
  const metrics = store.getMetrics();

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  let totalExpenses = 0;

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      totalExpenses += t.amount;
    });

  const sortedCatList = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1]);

  const topCategory: [string, number] = sortedCatList.length > 0 ? sortedCatList[0] : ['None', 0];
  const avgDailySpend = Math.round(totalExpenses / 22); // ~22 active days in month

  // Chart SVG Slices calculation
  const colors = ['#3E5C54', '#DDA15E', '#6B8E4E', '#BC6C25', '#2E4740', '#A3B18A', '#E9EDC9'];

  return `
    <div class="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      <!-- Top Action Bar with Filter -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
        <div>
          <h2 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9]">
            Reports & Analytics
          </h2>
          <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
            Deep insights into spending distribution, income trends, and category habits
          </p>
        </div>

        <select id="select-analytics-filter" class="px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] focus:ring-2 focus:ring-[#3E5C54] focus:outline-none">
          <option value="this-month" ${timeFilter === 'this-month' ? 'selected' : ''}>July 2026 (Current Month)</option>
          <option value="all-time" ${timeFilter === 'all-time' ? 'selected' : ''}>All Recorded History</option>
        </select>
      </div>

      <!-- Quick Financial Health Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
          <span class="text-xs text-[#7A7D73] uppercase tracking-wider font-bold block mb-1">Top Expense Category</span>
          <p class="font-heading font-extrabold text-xl text-[#BC6C25] dark:text-[#e0893f]">
            ${topCategory[0]}
          </p>
          <span class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 font-medium">
            ${store.formatCurrency(topCategory[1])} (${totalExpenses > 0 ? Math.round((topCategory[1] / totalExpenses) * 100) : 0}% of total)
          </span>
        </div>

        <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
          <span class="text-xs text-[#7A7D73] uppercase tracking-wider font-bold block mb-1">Average Daily Spend</span>
          <p class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9]">
            ${store.formatCurrency(avgDailySpend)}
          </p>
          <span class="text-xs text-[#6B8E4E] dark:text-[#88b066] font-medium">
            Controlled budget pace
          </span>
        </div>

        <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
          <span class="text-xs text-[#7A7D73] uppercase tracking-wider font-bold block mb-1">Net Cash Surplus</span>
          <p class="font-heading font-extrabold text-xl text-[#6B8E4E] dark:text-[#88b066]">
            +${store.formatCurrency(metrics.netSavings)}
          </p>
          <span class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 font-medium">
            37.2% income savings rate
          </span>
        </div>

      </div>

      <!-- Main Analytics Layout: Donut Breakdown + Detailed List -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Category Distribution Chart Card -->
        <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 class="font-heading font-extrabold text-base text-[#1B2623] dark:text-[#E9EDC9] mb-1 w-full text-left">
            Expense Allocation
          </h3>
          <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 mb-6 w-full text-left">Percentage share by category</p>

          <!-- SVG Donut Representation -->
          <div class="relative w-48 h-48 my-2 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-[#F2F1EC] dark:text-[#1B2623]" stroke-width="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              ${
                sortedCatList.map(([cat, amt], idx) => {
                  const pct = (amt / (totalExpenses || 1)) * 100;
                  const strokeColor = colors[idx % colors.length];
                  return `<path stroke="${strokeColor}" stroke-dasharray="${pct}, 100" stroke-width="4.5" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />`;
                }).join('')
              }
            </svg>

            <div class="absolute text-center">
              <span class="text-[10px] text-[#7A7D73] font-bold uppercase tracking-wider block">Total Spent</span>
              <span class="font-heading font-extrabold text-base text-[#1B2623] dark:text-[#E9EDC9]">
                ${store.formatCurrency(totalExpenses)}
              </span>
            </div>
          </div>

          <!-- Color Legend -->
          <div class="w-full mt-6 grid grid-cols-2 gap-2 text-left text-xs">
            ${sortedCatList.slice(0, 6).map(([cat, amt], idx) => {
              const pct = Math.round((amt / (totalExpenses || 1)) * 100);
              const color = colors[idx % colors.length];
              return `
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${color}"></span>
                  <span class="truncate font-medium text-[#1B2623] dark:text-[#E9EDC9] text-[11px]">${cat} (${pct}%)</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Detailed Category Ranking Table -->
        <div class="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
          <h3 class="font-heading font-extrabold text-base text-[#1B2623] dark:text-[#E9EDC9] mb-1">
            Category Breakdown Log
          </h3>
          <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 mb-4">Ranked by total expenditure</p>

          <div class="space-y-4">
            ${sortedCatList
              .map(([cat, amt], idx) => {
                const pct = Math.round((amt / (totalExpenses || 1)) * 100);
                const color = colors[idx % colors.length];

                return `
                  <div class="p-3.5 rounded-2xl bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/30">
                    <div class="flex items-center justify-between mb-1.5">
                      <div class="flex items-center gap-2.5">
                        <span class="w-3 h-3 rounded-full" style="background-color: ${color}"></span>
                        <span class="font-bold text-sm text-[#1B2623] dark:text-[#E9EDC9]">${cat}</span>
                      </div>
                      <span class="font-heading font-extrabold text-sm text-[#1B2623] dark:text-[#E9EDC9]">
                        ${store.formatCurrency(amt)} <span class="text-xs text-[#7A7D73] font-normal">(${pct}%)</span>
                      </span>
                    </div>

                    <div class="w-full h-2 bg-[#F2F1EC] dark:bg-[#253632] rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background-color: ${color}"></div>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

      </div>

    </div>
  `;
}

export function bindAnalyticsEvents(): void {
  document.getElementById('select-analytics-filter')?.addEventListener('change', (e) => {
    timeFilter = (e.target as HTMLSelectElement).value;
    const container = document.getElementById('main-content');
    if (container) {
      container.innerHTML = renderAnalyticsView();
      bindAnalyticsEvents();
    }
  });
}
