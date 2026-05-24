import { LoanApplication, Customer, AuditEntry, MonthlyDisbursement, RiskDistribution, User } from '@/types';

const FIRST_NAMES = [
  'John', 'Grace', 'Peter', 'Mary', 'James', 'Faith', 'David', 'Joyce', 'Joseph', 'Ann',
  'Daniel', 'Sarah', 'Samuel', 'Esther', 'Michael', 'Lucy', 'Stephen', 'Catherine', 'Patrick', 'Margaret',
  'Paul', 'Jane', 'George', 'Ruth', 'Francis', 'Alice', 'Charles', 'Dorothy', 'Robert', 'Helen',
  'Andrew', 'Martha', 'Thomas', 'Betty', 'Emmanuel', 'Nancy', 'Benjamin', 'Lydia', 'Joshua', 'Irene',
  'Simon', 'Juliet', 'Timothy', 'Victoria', 'Mark', 'Rachel', 'Isaiah', 'Diana', 'Elijah', 'Caroline',
  'Moses', 'Janet', 'Abraham', 'Rebecca', 'Isaac', 'Sharon', 'Jacob', 'Beatrice', 'Noah', 'Linda',
  'Aaron', 'Joy', 'Ezekiel', 'Lilian', 'Gideon', 'Stella', 'Solomon', 'Grace', 'Ezekiel', 'Phyllis',
  'Kennedy', 'Gladys', 'Brian', 'Jacqueline', 'Kevin', 'Felistas', 'Eric', 'Mercy', 'Martin', 'Agnes',
  'Anthony', 'Teresa', 'Alex', 'Rose', 'Felix', 'Christine', 'Harrison', 'Monica', 'Lawrence', 'Priscilla',
  'Allan', 'Naomi', 'Dennis', 'Edith', 'Henry', 'Milka', 'Victor', 'Eunice', 'Edwin', 'Constance',
];

const LAST_NAMES = [
  'Kamau', 'Wanjiku', 'Otieno', 'Njoroge', 'Mwangi', 'Achieng', 'Kipchirchir', 'Mutua', 'Omondi', 'Kariuki',
  'Wafula', 'Muthoni', 'Kiprono', 'Wambui', 'Koech', 'Wangari', 'Kiprotich', 'Ndungu', 'Ochieng', 'Githinji',
  'Kiptoo', 'Wairimu', 'Kipkoech', 'Njeri', 'Oduor', 'Mbugua', 'Kiplagat', 'Wanjiru', 'Owino', 'Macharia',
  'Kipkirui', 'Wangechi', 'Onyango', 'Maina', 'Langat', 'Wanjala', 'Oloo', 'Kariuki', 'Kipngeno', 'Gachuri',
  'Kemboi', 'Waweru', 'Odhiambo', 'Muriuki', 'Kipruto', 'Wangui', 'Ongaro', 'Ndegwa', 'Kiptanui', 'Mwaniki',
  'Kipchumba', 'Wambura', 'Ouko', 'Mwangangi', 'Kiplimo', 'Wacuka', 'Ojwang', 'Githae', 'Kipngetich', 'Wanja',
  'Kibet', 'Wakesho', 'Ouma', 'Karanja', 'Kipyegon', 'Wanyonyi', 'Ochieng', 'Gichuru', 'Kiprono', 'Wesonga',
  'Mutiso', 'Wakiuru', 'Okoth', 'Kinyua', 'Kipchoge', 'Wamalwa', 'Opondo', 'Mbatia', 'Kipserem', 'Waithaka',
  'Munene', 'Wandia', 'Ongeri', 'Thiong\'o', 'Kiplagat', 'Waithera', 'Odero', 'Wainaina', 'Kiptanui', 'Nyambura',
  'Muriithi', 'Wairimu', 'Oduya', 'Gikonyo', 'Kipkemboi', 'Wanjala', 'Owiti', 'Mbugua', 'Kiprop', 'Wangeci',
];

const PURPOSES: LoanApplication['purpose'][] = ['BUSINESS', 'EDUCATION', 'MEDICAL', 'AGRICULTURE', 'PERSONAL', 'HOME_IMPROVEMENT'];
const STATUSES: LoanApplication['status'][] = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED', 'REJECTED', 'DEFAULTED'];
const STATUS_WEIGHTS = [20, 15, 10, 40, 10, 5];
const RISK_RATINGS: LoanApplication['riskRating'][] = ['LOW', 'MEDIUM', 'HIGH'];
const EMPLOYMENT_TYPES: Customer['employmentType'][] = ['SALARIED', 'SELF_EMPLOYED', 'BUSINESS', 'CASUAL'];
const KYC_STATUSES: Customer['kycStatus'][] = ['VERIFIED', 'PENDING', 'FAILED'];
const AUDIT_ACTIONS: AuditEntry['action'][] = ['APPLICATION_CREATED', 'STATUS_CHANGED', 'AMOUNT_MODIFIED', 'REVIEWED', 'DISBURSED', 'REJECTED', 'CUSTOMER_UPDATED'];

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

function randomPhone(): string {
  const prefixes = ['254701', '254702', '254703', '254704', '254705', '254706', '254707', '254708', '254709', '254710', '254711', '254712', '254713', '254714', '254715', '254716', '254717', '254718', '254719', '254720', '254721', '254722', '254723', '254724', '254725', '254726', '254727', '254728', '254729', '254790', '254791', '254792', '254793', '254794', '254795', '254796', '254797', '254798', '254799'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}${suffix}`;
}

function randomEmail(name: string): string {
  const clean = name.toLowerCase().replace(/\s+/g, '.');
  const domains = ['gmail.com', 'yahoo.com', 'outlook.co.ke', 'email.co.ke'];
  return `${clean}.${Math.floor(Math.random() * 1000)}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

function randomIdNumber(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function randomName(): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

export function generateLoans(count = 500): LoanApplication[] {
  const loans: LoanApplication[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  for (let i = 0; i < count; i++) {
    const status = weightedRandom(STATUSES, STATUS_WEIGHTS);
    const submittedAt = randomDate(oneYearAgo, now);
    const amount = Math.floor(5000 + Math.random() * 495000);
    const termMonths = Math.floor(1 + Math.random() * 23);
    const monthlyIncome = Math.floor(15000 + Math.random() * 185000);
    const creditScore = Math.floor(300 + Math.random() * 550);
    let riskRating: LoanApplication['riskRating'] = 'HIGH';
    if (creditScore > 700) riskRating = 'LOW';
    else if (creditScore > 600) riskRating = 'MEDIUM';

    const purposeWeights = [25, 15, 10, 30, 12, 8];
    const purpose = weightedRandom(PURPOSES, purposeWeights);

    const loan: LoanApplication = {
      id: crypto.randomUUID(),
      customerId: crypto.randomUUID(),
      customerName: randomName(),
      amount,
      termMonths,
      interestRate: parseFloat((12 + Math.random() * 12).toFixed(1)),
      status,
      creditScore,
      riskRating,
      purpose,
      submittedAt,
      monthlyIncome,
      collateralValue: Math.random() > 0.3 ? Math.floor(amount * (0.5 + Math.random())) : undefined,
    };

    if (status === 'UNDER_REVIEW' || status === 'APPROVED' || status === 'DISBURSED' || status === 'REJECTED' || status === 'DEFAULTED') {
      loan.reviewedAt = randomDate(new Date(submittedAt), now);
      loan.reviewedBy = randomName();
    }
    if (status === 'DISBURSED' || status === 'DEFAULTED') {
      loan.disbursedAt = randomDate(new Date(loan.reviewedAt || submittedAt), now);
    }

    loans.push(loan);
  }

  return loans.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function generateCustomers(count = 5000): Customer[] {
  const customers: Customer[] = [];
  const now = new Date();
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());

  for (let i = 0; i < count; i++) {
    const name = randomName();
    const phone = randomPhone();
    const idNumber = randomIdNumber();
    const enrollmentDate = randomDate(fiveYearsAgo, now);
    const totalBorrowed = Math.floor(Math.random() * 500000);
    const activeLoans = Math.floor(Math.random() * 4);
    const repaymentHistory = Math.floor(Math.random() * 101);
    const kycStatus = weightedRandom(KYC_STATUSES, [70, 20, 10]);
    const dob = randomDate(new Date(1960, 0, 1), new Date(2005, 0, 1));
    const employmentType = weightedRandom(EMPLOYMENT_TYPES, [35, 25, 30, 10]);
    const monthlyIncome = Math.floor(15000 + Math.random() * 185000);

    customers.push({
      id: crypto.randomUUID(),
      name,
      phone,
      email: randomEmail(name),
      idNumber,
      enrollmentDate,
      totalBorrowed,
      activeLoans,
      repaymentHistory,
      kycStatus,
      dateOfBirth: dob,
      employmentType,
      monthlyIncome,
    });
  }

  return customers;
}

export function generateAuditEntries(count = 200): AuditEntry[] {
  const entries: AuditEntry[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const staffNames = [
    { name: 'Admin User', role: 'ADMIN' },
    { name: 'Manager One', role: 'MANAGER' },
    { name: 'Manager Two', role: 'MANAGER' },
    { name: 'Officer One', role: 'LOAN_OFFICER' },
    { name: 'Officer Two', role: 'LOAN_OFFICER' },
    { name: 'Officer Three', role: 'LOAN_OFFICER' },
    { name: 'Auditor One', role: 'AUDITOR' },
    { name: 'Auditor Two', role: 'AUDITOR' },
  ];

  for (let i = 0; i < count; i++) {
    const staff = staffNames[Math.floor(Math.random() * staffNames.length)];
    const action = AUDIT_ACTIONS[Math.floor(Math.random() * AUDIT_ACTIONS.length)];
    const targetType = Math.random() > 0.3 ? 'LOAN' : 'CUSTOMER';
    const targetId = crypto.randomUUID();

    let details = '';
    switch (action) {
      case 'APPLICATION_CREATED':
        details = `Created new loan application for ${randomName()}`;
        break;
      case 'STATUS_CHANGED':
        details = `Changed status from PENDING to UNDER_REVIEW`;
        break;
      case 'AMOUNT_MODIFIED':
        details = `Modified loan amount from KES ${Math.floor(Math.random() * 100000)} to KES ${Math.floor(Math.random() * 100000)}`;
        break;
      case 'REVIEWED':
        details = `Reviewed application and assigned risk rating`;
        break;
      case 'DISBURSED':
        details = `Disbursed loan amount of KES ${Math.floor(Math.random() * 500000)}`;
        break;
      case 'REJECTED':
        details = `Rejected application due to insufficient collateral`;
        break;
      case 'CUSTOMER_UPDATED':
        details = `Updated customer KYC information`;
        break;
    }

    entries.push({
      id: crypto.randomUUID(),
      action,
      actor: staff.name,
      actorRole: staff.role,
      targetId,
      targetType,
      timestamp: randomDate(thirtyDaysAgo, now),
      details,
      ipAddress: `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    });
  }

  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateMonthlyDisbursements(): MonthlyDisbursement[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const result: MonthlyDisbursement[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = `${months[d.getMonth()]} ${d.getFullYear()}`;
    let multiplier = 1;
    if (d.getMonth() === 0 || d.getMonth() === 3 || d.getMonth() === 7) multiplier = 1.4;
    else if (d.getMonth() === 5 || d.getMonth() === 11) multiplier = 0.8;

    const baseAmount = 5000000 + Math.random() * 5000000;
    const amount = Math.floor(baseAmount * multiplier);
    const count = Math.floor(amount / 45000);

    result.push({ month: monthLabel, amount, count });
  }

  return result;
}

export function generateRiskDistribution(loans: LoanApplication[]): RiskDistribution[] {
  const low = loans.filter((l) => l.riskRating === 'LOW');
  const medium = loans.filter((l) => l.riskRating === 'MEDIUM');
  const high = loans.filter((l) => l.riskRating === 'HIGH');

  return [
    { rating: 'LOW', count: low.length, totalAmount: low.reduce((s, l) => s + l.amount, 0) },
    { rating: 'MEDIUM', count: medium.length, totalAmount: medium.reduce((s, l) => s + l.amount, 0) },
    { rating: 'HIGH', count: high.length, totalAmount: high.reduce((s, l) => s + l.amount, 0) },
  ];
}

export const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ncba.demo',
    role: 'ADMIN',
    permissions: Object.values({
      VIEW_DASHBOARD: 'VIEW_DASHBOARD',
      VIEW_APPLICATIONS: 'VIEW_APPLICATIONS',
      MANAGE_APPLICATIONS: 'MANAGE_APPLICATIONS',
      VIEW_CUSTOMERS: 'VIEW_CUSTOMERS',
      VIEW_ANALYTICS: 'VIEW_ANALYTICS',
      VIEW_AUDIT: 'VIEW_AUDIT',
      VIEW_ADMIN: 'VIEW_ADMIN',
      MANAGE_USERS: 'MANAGE_USERS',
      DISBURSE_LOANS: 'DISBURSE_LOANS',
    }),
  },
  {
    id: '2',
    name: 'Manager One',
    email: 'manager@ncba.demo',
    role: 'MANAGER',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_APPLICATIONS',
      'MANAGE_APPLICATIONS',
      'VIEW_CUSTOMERS',
      'VIEW_ANALYTICS',
      'VIEW_AUDIT',
    ],
  },
  {
    id: '3',
    name: 'Officer One',
    email: 'officer@ncba.demo',
    role: 'LOAN_OFFICER',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_APPLICATIONS',
      'MANAGE_APPLICATIONS',
      'VIEW_CUSTOMERS',
    ],
  },
  {
    id: '4',
    name: 'Auditor One',
    email: 'auditor@ncba.demo',
    role: 'AUDITOR',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_AUDIT',
    ],
  },
];

export const MOCK_LOANS = generateLoans(500);
export const MOCK_CUSTOMERS = generateCustomers(5000);
export const MOCK_AUDIT_ENTRIES = generateAuditEntries(200);
export const MOCK_MONTHLY_DISBURSEMENTS = generateMonthlyDisbursements();
export const MOCK_RISK_DISTRIBUTION = generateRiskDistribution(MOCK_LOANS);
