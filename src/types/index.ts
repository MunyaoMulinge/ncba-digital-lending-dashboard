export interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  termMonths: number;
  interestRate: number;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'DISBURSED' | 'REJECTED' | 'DEFAULTED';
  creditScore: number;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  purpose: 'BUSINESS' | 'EDUCATION' | 'MEDICAL' | 'AGRICULTURE' | 'PERSONAL' | 'HOME_IMPROVEMENT';
  submittedAt: string;
  reviewedAt?: string;
  disbursedAt?: string;
  reviewedBy?: string;
  monthlyIncome: number;
  collateralValue?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  idNumber: string;
  enrollmentDate: string;
  totalBorrowed: number;
  activeLoans: number;
  repaymentHistory: number;
  kycStatus: 'VERIFIED' | 'PENDING' | 'FAILED';
  dateOfBirth: string;
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS' | 'CASUAL';
  monthlyIncome: number;
}

export interface AuditEntry {
  id: string;
  action: 'APPLICATION_CREATED' | 'STATUS_CHANGED' | 'AMOUNT_MODIFIED' | 'REVIEWED' | 'DISBURSED' | 'REJECTED' | 'CUSTOMER_UPDATED';
  actor: string;
  actorRole: string;
  targetId: string;
  targetType: 'LOAN' | 'CUSTOMER';
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'LOAN_OFFICER' | 'AUDITOR';
  permissions: string[];
  avatar?: string;
}

export interface DashboardKpi {
  activeLoans: number;
  disbursedToday: number;
  pendingReview: number;
  defaultRate: number;
  totalPortfolio: number;
}

export interface MonthlyDisbursement {
  month: string;
  amount: number;
  count: number;
}

export interface RiskDistribution {
  rating: 'LOW' | 'MEDIUM' | 'HIGH';
  count: number;
  totalAmount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
