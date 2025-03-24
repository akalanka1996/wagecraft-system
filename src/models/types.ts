
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  salaryAmount: number;
  hireDate: string;
  status: 'active' | 'inactive';
  bankAccount?: string;
  taxId?: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  baseAmount: number;
  deductions: number;
  taxes: number;
  netAmount: number;
  status: 'pending' | 'processed' | 'cancelled';
  processedDate: string;
}

export interface PayrollSummary {
  totalEmployees: number;
  totalPayroll: number;
  averageSalary: number;
  pendingPayrolls: number;
  departments: { name: string; count: number }[];
}
