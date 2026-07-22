import { store } from '../store/state';
import { icons } from '../utils/icons';

export function renderGoalsView(): string {
  const goals = store.getGoals();
  const accounts = store.getAccounts();

  return `
    <div class="space-y-6 animate-fade-in pb-16 md:pb-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm">
        <div>
          <h2 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9]">
            Savings Goals & Capital Planning
          </h2>
          <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
            Set target milestones, allocate funds, and watch your capital grow
          </p>
        </div>

        <button id="btn-add-goal" class="px-4 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer">
          ${icons.plus}
          <span>Create New Goal</span>
        </button>
      </div>

      <!-- Goals Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${goals
          .map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100));
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return `
              <div class="p-6 rounded-3xl bg-white dark:bg-[#253632] border border-[#F2F1EC] dark:border-[#3E5C54]/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                
                <div>
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md" style="background-color: ${goal.color || '#3E5C54'}">
                        ${icons.goals}
                      </div>
                      <div>
                        <span class="text-[10px] uppercase font-bold tracking-wider text-[#BC6C25] dark:text-[#DDA15E] bg-[#BC6C25]/10 px-2.5 py-0.5 rounded-md">
                          ${goal.category}
                        </span>
                        <h3 class="font-heading font-extrabold text-lg text-[#1B2623] dark:text-[#E9EDC9] mt-1">
                          ${goal.title}
                        </h3>
                      </div>
                    </div>

                    ${
                      isCompleted
                        ? `<span class="px-3 py-1 bg-[#6B8E4E]/15 text-[#6B8E4E] font-extrabold text-xs rounded-full border border-[#6B8E4E]/30 flex items-center gap-1">
                            ${icons.checkCircle} Reached!
                          </span>`
                        : `<span class="font-heading font-extrabold text-xl text-[#3E5C54] dark:text-[#DDA15E]">${pct}%</span>`
                    }
                  </div>

                  <div class="space-y-2 mb-4">
                    <div class="flex items-baseline justify-between">
                      <span class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 font-medium">Saved so far</span>
                      <span class="font-heading font-extrabold text-lg text-[#6B8E4E] dark:text-[#88b066]">
                        ${store.formatCurrency(goal.currentAmount)}
                      </span>
                    </div>

                    <!-- Progress Bar -->
                    <div class="w-full h-3.5 bg-[#F2F1EC] dark:bg-[#1B2623] rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500 shadow-sm" style="width: ${pct}%; background-color: ${goal.color || '#3E5C54'}"></div>
                    </div>

                    <div class="flex items-center justify-between text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
                      <span>Target: <strong class="text-[#1B2623] dark:text-[#E9EDC9]">${store.formatCurrency(goal.targetAmount)}</strong></span>
                      <span>Target Date: <strong class="text-[#1B2623] dark:text-[#E9EDC9]">${goal.targetDate}</strong></span>
                    </div>
                  </div>
                </div>

                <!-- Goal Actions -->
                <div class="pt-4 border-t border-[#F2F1EC] dark:border-[#3E5C54]/30 flex items-center justify-between gap-3">
                  <span class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70">
                    ${remaining === 0 ? 'Goal fully funded!' : store.formatCurrency(remaining) + ' left to save'}
                  </span>

                  <div class="flex items-center gap-2">
                    <button 
                      data-deposit-goal="${goal.id}" 
                      data-title="${goal.title}"
                      class="px-3.5 py-2 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      ${icons.plus}
                      <span>Deposit</span>
                    </button>

                    <button 
                      data-delete-goal="${goal.id}" 
                      class="p-2 text-[#7A7D73] hover:text-[#BC6C25] rounded-lg cursor-pointer transition-colors"
                      title="Remove Goal"
                    >
                      ${icons.trash}
                    </button>
                  </div>
                </div>

              </div>
            `;
          })
          .join('')}
      </div>

    </div>
  `;
}

export function bindGoalsEvents(): void {
  document.getElementById('btn-add-goal')?.addEventListener('click', () => {
    openAddGoalModal();
  });

  document.querySelectorAll('[data-deposit-goal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const goalId = (e.currentTarget as HTMLElement).getAttribute('data-deposit-goal');
      const title = (e.currentTarget as HTMLElement).getAttribute('data-title');
      if (goalId && title) {
        openDepositModal(goalId, title);
      }
    });
  });

  document.querySelectorAll('[data-delete-goal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const goalId = (e.currentTarget as HTMLElement).getAttribute('data-delete-goal');
      if (goalId && confirm('Delete this savings goal?')) {
        store.deleteGoal(goalId);
      }
    });
  });
}

function openDepositModal(goalId: string, goalTitle: string): void {
  const container = document.getElementById('modal-root');
  if (!container) return;

  const accounts = store.getAccounts();

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#1B2623]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-[#253632] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#F2F1EC] dark:border-[#3E5C54]/30 relative">
        <button id="btn-dep-close" class="absolute top-4 right-4 p-2 text-[#7A7D73] hover:text-[#1B2623] cursor-pointer">
          ${icons.close}
        </button>

        <h3 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9] mb-1">
          Deposit to Savings Goal
        </h3>
        <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 mb-4">
          Allocating money towards <strong class="text-[#6B8E4E] dark:text-[#88b066]">${goalTitle}</strong>
        </p>

        <form id="form-deposit-goal" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Deposit Amount (${store.getSettings().currencySymbol})</label>
            <input 
              type="number" 
              id="dep-amount" 
              required 
              min="500" 
              placeholder="e.g. 10000"
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl font-bold text-base text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Deduct From Account</label>
            <select id="dep-account" required class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9]">
              ${accounts
                .map(
                  (a) =>
                    `<option value="${a.id}">${a.name} (${store.formatCurrency(a.balance)})</option>`
                )
                .join('')}
            </select>
          </div>

          <div class="pt-3 flex justify-end gap-3 border-t border-[#F2F1EC] dark:border-[#3E5C54]/30">
            <button type="button" id="btn-dep-cancel" class="px-4 py-2 text-sm font-semibold text-[#7A7D73] cursor-pointer">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-sm rounded-xl shadow cursor-pointer">
              Confirm Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('btn-dep-close')?.addEventListener('click', () => { container.innerHTML = ''; });
  document.getElementById('btn-dep-cancel')?.addEventListener('click', () => { container.innerHTML = ''; });

  document.getElementById('form-deposit-goal')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat((document.getElementById('dep-amount') as HTMLInputElement).value);
    const accId = (document.getElementById('dep-account') as HTMLSelectElement).value;

    if (amount > 0 && accId) {
      const success = store.depositToGoal(goalId, amount, accId);
      if (!success) {
        alert('Insufficient funds in selected account!');
      } else {
        container.innerHTML = '';
      }
    }
  });
}

function openAddGoalModal(): void {
  const container = document.getElementById('modal-root');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#1B2623]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-[#253632] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#F2F1EC] dark:border-[#3E5C54]/30 relative">
        <button id="btn-goal-close" class="absolute top-4 right-4 p-2 text-[#7A7D73] hover:text-[#1B2623] cursor-pointer">
          ${icons.close}
        </button>

        <h3 class="font-heading font-extrabold text-xl text-[#1B2623] dark:text-[#E9EDC9] mb-1">
          Create Savings Goal
        </h3>
        <p class="text-xs text-[#7A7D73] dark:text-[#E9EDC9]/70 mb-4">
          Define target amount, category, and target completion date
        </p>

        <form id="form-add-goal" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Goal Title *</label>
            <input 
              type="text" 
              id="goal-title" 
              required 
              placeholder="e.g. New Car Downpayment" 
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm font-medium text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Target Amount (${store.getSettings().currencySymbol}) *</label>
            <input 
              type="number" 
              id="goal-target" 
              required 
              min="5000" 
              placeholder="e.g. 250000" 
              class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl font-bold text-base text-[#1B2623] dark:text-[#E9EDC9]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Category</label>
              <select id="goal-category" class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm text-[#1B2623] dark:text-[#E9EDC9]">
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="New Laptop">New Laptop</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Home">Home</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#1B2623] dark:text-[#E9EDC9] mb-1">Target Date *</label>
              <input 
                type="date" 
                id="goal-date" 
                required 
                value="2026-12-31" 
                class="w-full px-3.5 py-2.5 bg-[#FDFCF9] dark:bg-[#1B2623] border border-[#F2F1EC] dark:border-[#3E5C54]/40 rounded-xl text-sm text-[#1B2623] dark:text-[#E9EDC9]"
              />
            </div>
          </div>

          <div class="pt-3 flex justify-end gap-3 border-t border-[#F2F1EC] dark:border-[#3E5C54]/30">
            <button type="button" id="btn-goal-cancel" class="px-4 py-2 text-sm font-semibold text-[#7A7D73] cursor-pointer">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2.5 bg-[#3E5C54] hover:bg-[#2e4740] text-white font-bold text-sm rounded-xl shadow cursor-pointer">
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('btn-goal-close')?.addEventListener('click', () => { container.innerHTML = ''; });
  document.getElementById('btn-goal-cancel')?.addEventListener('click', () => { container.innerHTML = ''; });

  document.getElementById('form-add-goal')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = (document.getElementById('goal-title') as HTMLInputElement).value;
    const targetAmount = parseFloat((document.getElementById('goal-target') as HTMLInputElement).value);
    const category = (document.getElementById('goal-category') as HTMLSelectElement).value as any;
    const targetDate = (document.getElementById('goal-date') as HTMLInputElement).value;

    const colors = ['#3E5C54', '#DDA15E', '#6B8E4E', '#BC6C25'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (title && targetAmount > 0) {
      store.addGoal({
        title,
        targetAmount,
        category,
        targetDate,
        color: randomColor,
      });
      container.innerHTML = '';
    }
  });
}
