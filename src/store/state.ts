import { StorageService } from './storage';
import { Transaction, CategoryBudget, SavingsGoal, AccountWallet, AppSettings, User, ActiveTab, TransferRecord } from '../types';

type Listener = () => void;

class AppStore {
  private activeTab: ActiveTab = 'dashboard';
  private user: User = StorageService.getUser();
  private isAuthenticated: boolean = StorageService.getAuthStatus();
  private transactions: Transaction[] = StorageService.getTransactions();
  private budgets: CategoryBudget[] = StorageService.getBudgets();
  private goals: SavingsGoal[] = StorageService.getGoals();
  private accounts: AccountWallet[] = StorageService.getAccounts();
  private transfers: TransferRecord[] = StorageService.getTransfers();
  private settings: AppSettings = StorageService.getSettings();
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.applyTheme(this.settings.theme);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // Active Tab
  public getActiveTab(): ActiveTab {
    return this.activeTab;
  }

  public setActiveTab(tab: ActiveTab): void {
    this.activeTab = tab;
    this.notify();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Auth & User
  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public login(email: string, name?: string): void {
    this.isAuthenticated = true;
    if (name) {
      this.user = { ...this.user, name, email };
      StorageService.setUser(this.user);
    }
    StorageService.setAuthStatus(true);
    this.notify();
  }

  public signup(name: string, email: string): void {
    this.user = {
      id: 'usr_' + Date.now(),
      name,
      email,
      memberSince: 'July 2026',
    };
    this.isAuthenticated = true;
    StorageService.setUser(this.user);
    StorageService.setAuthStatus(true);
    this.notify();
  }

  public logout(): void {
    this.isAuthenticated = false;
    StorageService.setAuthStatus(false);
    this.notify();
  }

  public getUser(): User {
    return this.user;
  }

  public updateUserProfile(name: string, email: string): void {
    this.user = { ...this.user, name, email };
    StorageService.setUser(this.user);
    this.notify();
  }

  // Settings & Theme
  public getSettings(): AppSettings {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    StorageService.setSettings(this.settings);
    if (newSettings.theme) {
      this.applyTheme(newSettings.theme);
    }
    this.notify();
  }

  public toggleTheme(): void {
    const newTheme = this.settings.theme === 'light' ? 'dark' : 'light';
    this.updateSettings({ theme: newTheme });
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }

  // Formatting helper
  public formatCurrency(amount: number): string {
    const symbol = this.settings.currencySymbol || 'Rs.';
    const formattedNum = new Intl.NumberFormat('en-PK', {
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
    
    return `${symbol} ${formattedNum}`;
  }

  // Transactions
  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public addTransaction(txData: Omit<Transaction, 'id'>): void {
    const newTx: Transaction = {
      ...txData,
      id: 'tx_' + Date.now(),
    };
    
    // Find account name
    const acc = this.accounts.find((a) => a.id === newTx.accountId);
    if (acc) {
      newTx.accountName = acc.name;
      // Update account balance
      if (newTx.type === 'income') {
        acc.balance += newTx.amount;
      } else {
        acc.balance -= newTx.amount;
      }
      StorageService.setAccounts(this.accounts);
    }

    // Update Category Budget spent amount if expense
    if (newTx.type === 'expense') {
      const budget = this.budgets.find((b) => b.category === newTx.category);
      if (budget) {
        budget.spentAmount += newTx.amount;
        StorageService.setBudgets(this.budgets);
      }
    }

    this.transactions = [newTx, ...this.transactions];
    StorageService.setTransactions(this.transactions);
    this.notify();
  }

  public deleteTransaction(id: string): void {
    const tx = this.transactions.find((t) => t.id === id);
    if (tx) {
      // Revert account balance
      const acc = this.accounts.find((a) => a.id === tx.accountId);
      if (acc) {
        if (tx.type === 'income') {
          acc.balance -= tx.amount;
        } else {
          acc.balance += tx.amount;
        }
        StorageService.setAccounts(this.accounts);
      }

      // Revert budget spent
      if (tx.type === 'expense') {
        const budget = this.budgets.find((b) => b.category === tx.category);
        if (budget) {
          budget.spentAmount = Math.max(0, budget.spentAmount - tx.amount);
          StorageService.setBudgets(this.budgets);
        }
      }

      this.transactions = this.transactions.filter((t) => t.id !== id);
      StorageService.setTransactions(this.transactions);
      this.notify();
    }
  }

  // Budgets
  public getBudgets(): CategoryBudget[] {
    return this.budgets;
  }

  public saveBudget(category: CategoryBudget['category'], limitAmount: number): void {
    const existing = this.budgets.find((b) => b.category === category);
    if (existing) {
      existing.limitAmount = limitAmount;
    } else {
      // Calculate current spent from transactions for this category
      const currentSpent = this.transactions
        .filter((t) => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);

      this.budgets.push({
        id: 'bgt_' + Date.now(),
        category,
        limitAmount,
        spentAmount: currentSpent,
        monthYear: '2026-07',
      });
    }
    StorageService.setBudgets(this.budgets);
    this.notify();
  }

  public deleteBudget(id: string): void {
    this.budgets = this.budgets.filter((b) => b.id !== id);
    StorageService.setBudgets(this.budgets);
    this.notify();
  }

  // Savings Goals
  public getGoals(): SavingsGoal[] {
    return this.goals;
  }

  public addGoal(goalData: Omit<SavingsGoal, 'id' | 'currentAmount'>): void {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: 'goal_' + Date.now(),
      currentAmount: 0,
    };
    this.goals.push(newGoal);
    StorageService.setGoals(this.goals);
    this.notify();
  }

  public depositToGoal(id: string, amount: number, accountId: string): boolean {
    const goal = this.goals.find((g) => g.id === id);
    const acc = this.accounts.find((a) => a.id === accountId);

    if (goal && acc) {
      if (acc.balance < amount) return false;

      acc.balance -= amount;
      goal.currentAmount += amount;

      // Log as savings transaction
      this.transactions.unshift({
        id: 'tx_' + Date.now(),
        amount,
        type: 'expense',
        category: 'Shopping & Lifestyle',
        description: `Savings Goal Deposit: ${goal.title}`,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        accountId: acc.id,
        accountName: acc.name,
      });

      StorageService.setAccounts(this.accounts);
      StorageService.setGoals(this.goals);
      StorageService.setTransactions(this.transactions);
      this.notify();
      return true;
    }
    return false;
  }

  public deleteGoal(id: string): void {
    this.goals = this.goals.filter((g) => g.id !== id);
    StorageService.setGoals(this.goals);
    this.notify();
  }

  // Accounts & Wallets
  public getAccounts(): AccountWallet[] {
    return this.accounts;
  }

  public addAccount(accountData: Omit<AccountWallet, 'id'>): void {
    const newAccount: AccountWallet = {
      ...accountData,
      id: 'acc_' + Date.now(),
    };
    this.accounts.push(newAccount);
    StorageService.setAccounts(this.accounts);
    this.notify();
  }

  public transferBetweenAccounts(fromId: string, toId: string, amount: number, note?: string): boolean {
    const fromAcc = this.accounts.find((a) => a.id === fromId);
    const toAcc = this.accounts.find((a) => a.id === toId);

    if (fromAcc && toAcc && fromAcc.balance >= amount) {
      fromAcc.balance -= amount;
      toAcc.balance += amount;

      const newTransfer: TransferRecord = {
        id: 'trf_' + Date.now(),
        fromAccountId: fromId,
        toAccountId: toId,
        fromAccountName: fromAcc.name,
        toAccountName: toAcc.name,
        amount,
        date: new Date().toISOString().split('T')[0],
        note,
      };

      this.transfers.unshift(newTransfer);
      StorageService.setAccounts(this.accounts);
      StorageService.setTransfers(this.transfers);
      this.notify();
      return true;
    }
    return false;
  }

  public deleteAccount(id: string): void {
    this.accounts = this.accounts.filter((a) => a.id !== id);
    StorageService.setAccounts(this.accounts);
    this.notify();
  }

  public getTransfers(): TransferRecord[] {
    return this.transfers;
  }

  // Summary Metrics calculations
  public getMetrics() {
    const totalIncome = this.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = this.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = this.accounts.reduce((sum, a) => sum + a.balance, 0);
    const netSavings = totalIncome - totalExpenses;

    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      netSavings,
    };
  }

  public resetAllData(): void {
    StorageService.resetToDefault();
    this.user = StorageService.getUser();
    this.transactions = StorageService.getTransactions();
    this.budgets = StorageService.getBudgets();
    this.goals = StorageService.getGoals();
    this.accounts = StorageService.getAccounts();
    this.transfers = StorageService.getTransfers();
    this.settings = StorageService.getSettings();
    this.notify();
  }
}

export const store = new AppStore();
