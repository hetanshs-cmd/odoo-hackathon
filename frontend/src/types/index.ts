export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  details?: unknown[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "FleetManager" | "Dispatcher" | "Driver" | "SafetyOfficer" | "FinancialAnalyst" | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}
