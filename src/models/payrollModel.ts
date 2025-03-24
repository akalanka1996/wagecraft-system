
import { Payroll, PayrollSummary } from './types';
import { v4 as uuidv4 } from 'uuid';
import { getEmployees } from './employeeModel';
import { toast } from 'sonner';

// Mock storage using localStorage
const STORAGE_KEY = 'payroll_records';

// Get all payroll records
export const getPayrollRecords = (): Payroll[] => {
  const storedPayrolls = localStorage.getItem(STORAGE_KEY);
  if (storedPayrolls) {
    return JSON.parse(storedPayrolls);
  }
  
  // Return empty array if no payrolls found
  return [];
};

// Get payroll by ID
export const getPayrollById = (id: string): Payroll | undefined => {
  const payrolls = getPayrollRecords();
  return payrolls.find(payroll => payroll.id === id);
};

// Get payrolls for a specific employee
export const getPayrollsByEmployee = (employeeId: string): Payroll[] => {
  const payrolls = getPayrollRecords();
  return payrolls.filter(payroll => payroll.employeeId === employeeId);
};

// Create a new payroll record
export const createPayroll = (payrollData: Omit<Payroll, 'id'>): Payroll => {
  try {
    const payrolls = getPayrollRecords();
    
    // Generate a unique ID
    const newPayroll: Payroll = {
      ...payrollData,
      id: uuidv4(),
    };
    
    // Add to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...payrolls, newPayroll]));
    
    toast.success('Payroll record created successfully');
    return newPayroll;
  } catch (error) {
    console.error('Error creating payroll record:', error);
    toast.error('Failed to create payroll record');
    throw error;
  }
};

// Update an existing payroll record
export const updatePayroll = (id: string, payrollData: Partial<Payroll>): Payroll => {
  try {
    const payrolls = getPayrollRecords();
    const payrollIndex = payrolls.findIndex(pay => pay.id === id);
    
    if (payrollIndex === -1) {
      throw new Error('Payroll record not found');
    }
    
    // Update the payroll
    const updatedPayroll = {
      ...payrolls[payrollIndex],
      ...payrollData
    };
    
    payrolls[payrollIndex] = updatedPayroll;
    
    // Save to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payrolls));
    
    toast.success('Payroll record updated successfully');
    return updatedPayroll;
  } catch (error) {
    console.error('Error updating payroll record:', error);
    toast.error('Failed to update payroll record');
    throw error;
  }
};

// Delete a payroll record
export const deletePayroll = (id: string): boolean => {
  try {
    const payrolls = getPayrollRecords();
    const updatedPayrolls = payrolls.filter(pay => pay.id !== id);
    
    // Save to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPayrolls));
    
    toast.success('Payroll record deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting payroll record:', error);
    toast.error('Failed to delete payroll record');
    return false;
  }
};

// Process payroll for an employee (create or update)
export const processPayroll = (employeeId: string, payPeriodStart: string, payPeriodEnd: string): Payroll => {
  const employee = getEmployees().find(emp => emp.id === employeeId);
  
  if (!employee) {
    toast.error('Employee not found');
    throw new Error('Employee not found');
  }
  
  // Calculate simple payroll values (in real app, this would be more complex)
  const baseAmount = employee.salaryAmount / 12; // Monthly salary
  const taxRate = 0.2; // 20% tax rate
  const taxes = baseAmount * taxRate;
  const deductions = baseAmount * 0.05; // 5% for benefits, etc.
  const netAmount = baseAmount - taxes - deductions;
  
  const payrollData: Omit<Payroll, 'id'> = {
    employeeId,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    payPeriodStart,
    payPeriodEnd,
    baseAmount,
    deductions,
    taxes,
    netAmount,
    status: 'processed',
    processedDate: new Date().toISOString().split('T')[0]
  };
  
  return createPayroll(payrollData);
};

// Get payroll summary for dashboard
export const getPayrollSummary = (): PayrollSummary => {
  const employees = getEmployees();
  const payrolls = getPayrollRecords();
  
  const activeEmployees = employees.filter(emp => emp.status === 'active');
  
  // Calculate total and average salary
  const totalSalary = activeEmployees.reduce((sum, emp) => sum + emp.salaryAmount, 0);
  const averageSalary = activeEmployees.length > 0 ? totalSalary / activeEmployees.length : 0;
  
  // Count pending payrolls
  const pendingPayrolls = payrolls.filter(pay => pay.status === 'pending').length;
  
  // Group employees by department
  const departmentCounts: Record<string, number> = {};
  activeEmployees.forEach(emp => {
    departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
  });
  
  const departments = Object.entries(departmentCounts).map(([name, count]) => ({ name, count }));
  
  // Calculate total payroll amount (processed in the current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthPayrolls = payrolls.filter(pay => {
    const processedDate = new Date(pay.processedDate);
    return processedDate.getMonth() === currentMonth && 
           processedDate.getFullYear() === currentYear &&
           pay.status === 'processed';
  });
  
  const totalPayroll = currentMonthPayrolls.reduce((sum, pay) => sum + pay.netAmount, 0);
  
  return {
    totalEmployees: activeEmployees.length,
    totalPayroll,
    averageSalary,
    pendingPayrolls,
    departments
  };
};

// Generate sample payroll data for demo purposes
export const generateSamplePayrolls = (): void => {
  const employees = getEmployees();
  
  if (employees.length === 0) {
    toast.error('No employees found. Please add employees first.');
    return;
  }
  
  // Clear existing payrolls
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  
  // Current date for reference
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Create payrolls for the last 3 months
  for (let i = 0; i < 3; i++) {
    const payMonth = new Date(currentYear, currentMonth - i, 1);
    const payMonthEnd = new Date(currentYear, currentMonth - i + 1, 0);
    
    const payPeriodStart = payMonth.toISOString().split('T')[0];
    const payPeriodEnd = payMonthEnd.toISOString().split('T')[0];
    
    // Create payroll for each active employee
    employees
      .filter(emp => emp.status === 'active')
      .forEach(emp => {
        // Calculate payroll amounts
        const baseAmount = emp.salaryAmount / 12; // Monthly salary
        const taxRate = 0.2; // 20% tax rate
        const taxes = baseAmount * taxRate;
        const deductions = baseAmount * 0.05; // 5% for benefits, etc.
        const netAmount = baseAmount - taxes - deductions;
        
        const payrollData: Omit<Payroll, 'id'> = {
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          payPeriodStart,
          payPeriodEnd,
          baseAmount,
          deductions,
          taxes,
          netAmount,
          status: 'processed',
          processedDate: new Date(currentYear, currentMonth - i + 1, 5).toISOString().split('T')[0]
        };
        
        createPayroll(payrollData);
      });
  }
  
  toast.success('Sample payroll data generated');
};
