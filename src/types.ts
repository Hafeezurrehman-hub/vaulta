export type TransactionType = 'income' | 'expense';

export type CategoryType = 
  | 'Housing & Rent'
  | 'Food & Dining'
  | 'Groceries'
  | 'Transportation & Fuel'
  | 'Utilities & Bills'
  | 'Shopping & Lifestyle'
  | 'Healthcare & Medical'
  | 'Education & Books'
  | 'Entertainment & Leisure'
  | 'Salary & Wage'
  | 'Freelance & Business'
  | 'Investment Return'
  | 'Gifts & Bonus'
  | 'Other Expenses'
  | 'Other Income';

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Debit Card' | 'Credit Card' | 'Digital Wallet' | 'Direct Deposit';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: CategoryType;
  description: string;
  date: string; // ISO YYYY-MM-DD
  paymentMethod: PaymentMethod;
  accountId: string;
  accountName?: string;
}

export interface CategoryBudget {
  id: string;
  category: CategoryType;
  limitAmount: number;
  spentAmount: number;
  monthYear: string; // YYYY-MM
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: 'Emergency Fund' | 'New Laptop' | 'Education' | 'Travel' | 'Home' | 'Personal';
  targetDate: string;
  color: string;
}

export type AccountType = 'cash' | 'bank' | 'wallet' | 'savings';

export interface AccountWallet {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  accountNumber?: string;
  bankName?: string;
  color: string;
}

export interface TransferRecord {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  fromAccountName: string;
  toAccountName: string;
  amount: number;
  date: string;
  note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  memberSince: string;
}

export type CurrencyCode = 'PKR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'INR';

export interface AppSettings {
  currency: CurrencyCode;
  currencySymbol: string;
  theme: 'light' | 'dark';
  notifications: {
    budgetAlerts: boolean;
    goalMilestones: boolean;
    dailyReminders: boolean;
  };
  pwaDismissed?: boolean;
}

export type ActiveTab = 'dashboard' | 'transactions' | 'budgets' | 'goals' | 'analytics' | 'accounts' | 'settings';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
