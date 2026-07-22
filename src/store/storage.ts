import { Transaction, CategoryBudget, SavingsGoal, AccountWallet, AppSettings, User, TransferRecord } from '../types';

const STORAGE_KEYS = {
  USER: 'vaulta_user',
  AUTH: 'vaulta_auth',
  TRANSACTIONS: 'vaulta_transactions',
  BUDGETS: 'vaulta_budgets',
  GOALS: 'vaulta_goals',
  ACCOUNTS: 'vaulta_accounts',
  TRANSFERS: 'vaulta_transfers',
  SETTINGS: 'vaulta_settings',
};

export const DEFAULT_USER: User = {
  id: 'usr_umme_01',
  name: 'UMME ASMIA',
  email: 'ummeasmia191@gmail.com',
  memberSince: 'January 2026',
};

export const DEFAULT_SETTINGS: AppSettings = {
  currency: 'PKR',
  currencySymbol: 'Rs.',
  theme: 'light',
  notifications: {
    budgetAlerts: true,
    goalMilestones: true,
    dailyReminders: false,
  },
  pwaDismissed: false,
};

export const DEFAULT_ACCOUNTS: AccountWallet[] = [
  {
    id: 'acc_meezan',
    name: 'Meezan Bank Account',
    type: 'bank',
    balance: 285000,
    accountNumber: '**** 8842',
    bankName: 'Meezan Bank Ltd',
    color: '#0d4234',
  },
  {
    id: 'acc_cash',
    name: 'Cash Wallet',
    type: 'cash',
    balance: 25000,
    color: '#d4af37',
  },
  {
    id: 'acc_easypaisa',
    name: 'Easypaisa Wallet',
    type: 'wallet',
    balance: 45000,
    accountNumber: '0300 ****191',
    bankName: 'Easypaisa',
    color: '#10b981',
  },
];

export const DEFAULT_BUDGETS: CategoryBudget[] = [
  { id: 'bgt_1', category: 'Housing & Rent', limitAmount: 60000, spentAmount: 60000, monthYear: '2026-07' },
  { id: 'bgt_2', category: 'Groceries', limitAmount: 35000, spentAmount: 24500, monthYear: '2026-07' },
  { id: 'bgt_3', category: 'Utilities & Bills', limitAmount: 20000, spentAmount: 16800, monthYear: '2026-07' },
  { id: 'bgt_4', category: 'Transportation & Fuel', limitAmount: 15000, spentAmount: 11200, monthYear: '2026-07' },
  { id: 'bgt_5', category: 'Food & Dining', limitAmount: 18000, spentAmount: 14300, monthYear: '2026-07' },
  { id: 'bgt_6', category: 'Shopping & Lifestyle', limitAmount: 25000, spentAmount: 22000, monthYear: '2026-07' },
  { id: 'bgt_7', category: 'Healthcare & Medical', limitAmount: 10000, spentAmount: 3500, monthYear: '2026-07' },
];

export const DEFAULT_GOALS: SavingsGoal[] = [
  {
    id: 'goal_1',
    title: 'Emergency Fund',
    targetAmount: 300000,
    currentAmount: 180000,
    category: 'Emergency Fund',
    targetDate: '2026-12-31',
    color: '#0d4234',
  },
  {
    id: 'goal_2',
    title: 'M2 Pro Laptop',
    targetAmount: 220000,
    currentAmount: 140000,
    category: 'New Laptop',
    targetDate: '2026-09-30',
    color: '#d4af37',
  },
  {
    id: 'goal_3',
    title: "Master's Degree Fund",
    targetAmount: 500000,
    currentAmount: 250000,
    category: 'Education',
    targetDate: '2027-03-31',
    color: '#3b82f6',
  },
  {
    id: 'goal_4',
    title: 'Hunza & Skardu Trip',
    targetAmount: 100000,
    currentAmount: 75000,
    category: 'Travel',
    targetDate: '2026-10-15',
    color: '#10b981',
  },
];

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_01',
    amount: 180000,
    type: 'income',
    category: 'Salary & Wage',
    description: 'Monthly Salary Deposit',
    date: '2026-07-01',
    paymentMethod: 'Direct Deposit',
    accountId: 'acc_meezan',
    accountName: 'Meezan Bank Account',
  },
  {
    id: 'tx_02',
    amount: 45000,
    type: 'income',
    category: 'Freelance & Business',
    description: 'UI/UX Design Client Project Payment',
    date: '2026-07-05',
    paymentMethod: 'Bank Transfer',
    accountId: 'acc_meezan',
    accountName: 'Meezan Bank Account',
  },
  {
    id: 'tx_03',
    amount: 60000,
    type: 'expense',
    category: 'Housing & Rent',
    description: 'July Apartment Rent',
    date: '2026-07-02',
    paymentMethod: 'Bank Transfer',
    accountId: 'acc_meezan',
    accountName: 'Meezan Bank Account',
  },
  {
    id: 'tx_04',
    amount: 16800,
    type: 'expense',
    category: 'Utilities & Bills',
    description: 'K-Electric & Internet Wi-Fi Bill',
    date: '2026-07-08',
    paymentMethod: 'Digital Wallet',
    accountId: 'acc_easypaisa',
    accountName: 'Easypaisa Wallet',
  },
  {
    id: 'tx_05',
    amount: 24500,
    type: 'expense',
    category: 'Groceries',
    description: 'Monthly Supermarket Grocery Store',
    date: '2026-07-10',
    paymentMethod: 'Debit Card',
    accountId: 'acc_meezan',
    accountName: 'Meezan Bank Account',
  },
  {
    id: 'tx_06',
    amount: 11200,
    type: 'expense',
    category: 'Transportation & Fuel',
    description: 'Vehicle Fuel refills & Ride Hailing',
    date: '2026-07-14',
    paymentMethod: 'Cash',
    accountId: 'acc_cash',
    accountName: 'Cash Wallet',
  },
  {
    id: 'tx_07',
    amount: 14300,
    type: 'expense',
    category: 'Food & Dining',
    description: 'Family Weekend Dining & Cafes',
    date: '2026-07-18',
    paymentMethod: 'Debit Card',
    accountId: 'acc_meezan',
    accountName: 'Meezan Bank Account',
  },
  {
    id: 'tx_08',
    amount: 22000,
    type: 'expense',
    category: 'Shopping & Lifestyle',
    description: 'Clothing & Electronics Accessories',
    date: '2026-07-20',
    paymentMethod: 'Digital Wallet',
    accountId: 'acc_easypaisa',
    accountName: 'Easypaisa Wallet',
  },
  {
    id: 'tx_09',
    amount: 12000,
    type: 'income',
    category: 'Investment Return',
    description: 'Dividend Payout',
    date: '2026-07-21',
    paymentMethod: 'Bank Transfer',
    accountId: 'acc_meezan',
    accountName: 'Meezan Bank Account',
  },
];

export class StorageService {
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  static getUser(): User {
    return this.getItem<User>(STORAGE_KEYS.USER, DEFAULT_USER);
  }

  static setUser(user: User): void {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  static getAuthStatus(): boolean {
    return this.getItem<boolean>(STORAGE_KEYS.AUTH, true); // Default logged in for seamless demo
  }

  static setAuthStatus(isAuthenticated: boolean): void {
    this.setItem(STORAGE_KEYS.AUTH, isAuthenticated);
  }

  static getTransactions(): Transaction[] {
    return this.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
  }

  static setTransactions(transactions: Transaction[]): void {
    this.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  static getBudgets(): CategoryBudget[] {
    return this.getItem<CategoryBudget[]>(STORAGE_KEYS.BUDGETS, DEFAULT_BUDGETS);
  }

  static setBudgets(budgets: CategoryBudget[]): void {
    this.setItem(STORAGE_KEYS.BUDGETS, budgets);
  }

  static getGoals(): SavingsGoal[] {
    return this.getItem<SavingsGoal[]>(STORAGE_KEYS.GOALS, DEFAULT_GOALS);
  }

  static setGoals(goals: SavingsGoal[]): void {
    this.setItem(STORAGE_KEYS.GOALS, goals);
  }

  static getAccounts(): AccountWallet[] {
    return this.getItem<AccountWallet[]>(STORAGE_KEYS.ACCOUNTS, DEFAULT_ACCOUNTS);
  }

  static setAccounts(accounts: AccountWallet[]): void {
    this.setItem(STORAGE_KEYS.ACCOUNTS, accounts);
  }

  static getTransfers(): TransferRecord[] {
    return this.getItem<TransferRecord[]>(STORAGE_KEYS.TRANSFERS, []);
  }

  static setTransfers(transfers: TransferRecord[]): void {
    this.setItem(STORAGE_KEYS.TRANSFERS, transfers);
  }

  static getSettings(): AppSettings {
    return this.getItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  static setSettings(settings: AppSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSFERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}
