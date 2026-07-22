import { store } from '../store/state';
import { CategoryType } from '../types';
import { icons } from '../utils/icons';

const allCategories: CategoryType[] = [
  'Housing & Rent',
  'Food & Dining',
  'Groceries',
  'Transportation & Fuel',
  'Utilities & Bills',
  'Shopping & Lifestyle',
  'Healthcare & Medical',
  'Education & Books',
  'Entertainment & Leisure',
  'Other Expenses',
];

export function renderBudgetsView(): string {
  const budgets = store.getBudgets();
  const settings = store.getSettings();

  // Find over-budget or close-to-limit categories
  const exceededBudgets = budgets.filter((b) => b.spentAmount >= b.limitAmount);
  const warningBudgets = budgets.filter((b) => b.spentAmount >= b.limitAmount * 0.8 && b.spentAmount < b.limitAmount);

  return `
    <div class="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
        <div>
          <h2 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9]">
            Monthly Category Budgets
          </h2>
          <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
            Set spending caps per category and prevent overspending
          </p>
        </div>

        <button id="btn-add-budget" class="px-4 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer">
          ${icons.plus}
          <span>Set Category Limit</span>
        </button>
      </div>

      <!-- Warning Alerts Banner if exceeded -->
      ${
        exceededBudgets.length > 0
          ? `
        <div class="p-4 rounded-2xl bg-[#BC6C25]/10 border border-[#BC6C25]/30 text-[#BC6C25] dark:text-[#e0893f] flex items-start gap-3 shadow-sm">
          <div class="p-2 rounded-xl bg-[#BC6C25]/20 text-[#BC6C25] shrink-0">
            ${icons.alertTriangle}
          </div>
          <div>
            <h4 class="font-heading font-bold text-sm">Budget Limit Alert</h4>
            <p class="text-xs mt-0.5 leading-relaxed">
              You have exceeded your monthly limit for <span class="font-bold underline">${exceededBudgets.map(b => b.category).join(', ')}</span>. Consider reviewing your upcoming expenses.
            </p>
          </div>
        </div>
      `
          : ''
      }

      <!-- Budget Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${budgets
          .map((b) => {
            const pct = Math.min(100, Math.round((b.spentAmount / (b.limitAmount || 1)) * 100));
            const remaining = b.limitAmount - b.spentAmount;
            const isExceeded = b.spentAmount >= b.limitAmount;
            const isNear = b.spentAmount >= b.limitAmount * 0.8 && !isExceeded;

            let barColor = 'bg-[#6B8E4E]';
            let badgeBg = 'bg-[#6B8E4E]/15 text-[#6B8E4E] dark:text-[#88b066]';
            let statusText = 'On Track';

            if (isExceeded) {
              barColor = 'bg-[#BC6C25]';
              badgeBg = 'bg-[#BC6C25]/15 text-[#BC6C25] dark:text-[#e0893f]';
              statusText = 'Exceeded!';
            } else if (isNear) {
              barColor = 'bg-[#DDA15E]';
              badgeBg = 'bg-[#DDA15E]/15 text-[#BC6C25] dark:text-[#DDA15E]';
              statusText = 'Near Limit (80%+)';
            }

            return `
              <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-heading font-extrabold text-base text-[#1B2623] dark:text-[#E9EDC9]">
                    ${b.category}
                  </h3>
                  <span class="px-2.5 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider ${badgeBg}">
                    ${statusText}
                  </span>
                </div>

                <div class="flex items-baseline justify-between mb-2">
                  <div>
                    <span class="text-xs text-[#7A7D73] uppercase tracking-wider font-semibold block">Spent</span>
                    <span class="font-heading font-extrabold text-xl ${isExceeded ? 'text-[#BC6C25] dark:text-[#e0893f]' : 'text-[#1B2623] dark:text-[#E9EDC9]'}">
                      ${store.formatCurrency(b.spentAmount)}
                    </span>
                  </div>

                  <div class="text-right">
                    <span class="text-xs text-[#7A7D73] uppercase tracking-wider font-semibold block">Limit</span>
                    <span class="font-heading font-bold text-sm text-[#7A7D73] dark:text-[#E9EDC9]/70">
                      ${store.formatCurrency(b.limitAmount)}
                    </span>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full h-3 bg-[#F2F1EC] dark:bg-[#1B2623] rounded-full overflow-hidden my-3">
                  <div class="h-full ${barColor} rounded-full transition-all duration-500 shadow-sm" style="width: ${pct}%"></div>
                </div>

                <div class="flex items-center justify-between text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
                  <span>${pct}% used</span>
                  <span class="font-semibold ${remaining < 0 ? 'text-[#BC6C25]' : 'text-[#6B8E4E] dark:text-[#88b066]'}">
                    ${remaining < 0 ? 'Over by ' + store.formatCurrency(Math.abs(remaining)) : store.formatCurrency(remaining) + ' remaining'}
                  </span>
                </div>

                <!-- Actions -->
                <div class="mt-4 pt-3 border-t border-[#F2F1EC] dark:border-[#3E5C54]/30 flex items-center justify-end gap-2">
                  <button 
                    data-edit-budget="${b.category}" 
                    data-limit="${b.limitAmount}"
                    class="text-xs font-bold text-[#3E5C54] dark:text-[#DDA15E] hover:underline cursor-pointer"
                  >
                    Adjust Limit
                  </button>
                  <button 
                    data-delete-budget="${b.id}" 
                    class="text-xs text-[#7A7D73] hover:text-[#BC6C25] cursor-pointer ml-3"
                  >
                    Remove
                  </button>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>

    </div>
  `;
}

export function bindBudgetsEvents(): void {
  document.getElementById('btn-add-budget')?.addEventListener('click', () => {
    openBudgetModal();
  });

  document.querySelectorAll('[data-edit-budget]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const cat = (e.currentTarget as HTMLElement).getAttribute('data-edit-budget');
      const limit = (e.currentTarget as HTMLElement).getAttribute('data-limit');
      if (cat) {
        openBudgetModal(cat as CategoryType, parseFloat(limit || '50000'));
      }
    });
  });

  document.querySelectorAll('[data-delete-budget]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-delete-budget');
      if (id && confirm('Remove this category budget cap?')) {
        store.deleteBudget(id);
      }
    });
  });
}

function openBudgetModal(defaultCategory?: CategoryType, defaultLimit: number = 35000): void {
  const container = document.getElementById('modal-root');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#1B2623]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-[#253632] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#F2F1EC] dark:border-[#3E5C54]/30 relative">
        <button id="btn-bgt-modal-close" class="absolute top-4 right-4 p-2 text-[#7A7D73] hover:text-[#1B2623] dark:hover:text-[#E9EDC9] cursor-pointer">
          ${icons.close}
        </button>

        <h3 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9] mb-1">
          ${defaultCategory ? 'Adjust Budget Limit' : 'Set Category Budget'}
        </h3>
        <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 mb-4">
          Establish monthly maximum target limit for spending
        </p>

        <form id="form-save-budget" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Category</label>
            <select id="bgt-category" required class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9]">
              ${allCategories
                .map(
                  (c) =>
                    `<option value="${c}" ${defaultCategory === c ? 'selected' : ''}>${c}</option>`
                )
                .join('')}
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Monthly Limit Amount (${store.getSettings().currencySymbol})</label>
            <input 
              type="number" 
              id="bgt-limit" 
              required 
              min="1000" 
              value="${defaultLimit}"
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl font-bold text-base text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div class="pt-3 flex justify-end gap-3 border-t border-[#F2F1EC] dark:border-[#3E5C54]/30">
            <button type="button" id="btn-bgt-cancel" class="px-4 py-2 text-sm font-semibold text-[#7A7D73] hover:text-[#1B2623] cursor-pointer">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-sm rounded-xl shadow cursor-pointer">
              Save Budget Limit
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('btn-bgt-modal-close')?.addEventListener('click', () => { container.innerHTML = ''; });
  document.getElementById('btn-bgt-cancel')?.addEventListener('click', () => { container.innerHTML = ''; });

  document.getElementById('form-save-budget')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = (document.getElementById('bgt-category') as HTMLSelectElement).value as CategoryType;
    const limit = parseFloat((document.getElementById('bgt-limit') as HTMLInputElement).value);

    if (category && limit > 0) {
      store.saveBudget(category, limit);
      container.innerHTML = '';
    }
  });
}
