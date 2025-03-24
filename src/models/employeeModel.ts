
import { Employee } from './types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Mock storage using localStorage
const STORAGE_KEY = 'payroll_employees';

// Get all employees
export const getEmployees = (): Employee[] => {
  const storedEmployees = localStorage.getItem(STORAGE_KEY);
  if (storedEmployees) {
    return JSON.parse(storedEmployees);
  }
  
  // Return empty array if no employees found
  return [];
};

// Get a single employee by ID
export const getEmployeeById = (id: string): Employee | undefined => {
  const employees = getEmployees();
  return employees.find(emp => emp.id === id);
};

// Create a new employee
export const createEmployee = (employeeData: Omit<Employee, 'id'>): Employee => {
  try {
    const employees = getEmployees();
    
    // Generate a unique ID
    const newEmployee: Employee = {
      ...employeeData,
      id: uuidv4(),
    };
    
    // Add to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...employees, newEmployee]));
    
    toast.success('Employee added successfully');
    return newEmployee;
  } catch (error) {
    console.error('Error creating employee:', error);
    toast.error('Failed to add employee');
    throw error;
  }
};

// Update an existing employee
export const updateEmployee = (id: string, employeeData: Partial<Employee>): Employee => {
  try {
    const employees = getEmployees();
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    
    if (employeeIndex === -1) {
      throw new Error('Employee not found');
    }
    
    // Update the employee
    const updatedEmployee = {
      ...employees[employeeIndex],
      ...employeeData
    };
    
    employees[employeeIndex] = updatedEmployee;
    
    // Save to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    
    toast.success('Employee updated successfully');
    return updatedEmployee;
  } catch (error) {
    console.error('Error updating employee:', error);
    toast.error('Failed to update employee');
    throw error;
  }
};

// Delete an employee
export const deleteEmployee = (id: string): boolean => {
  try {
    const employees = getEmployees();
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    
    // Save to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEmployees));
    
    toast.success('Employee deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    toast.error('Failed to delete employee');
    return false;
  }
};

// Generate sample employees for demo purposes
export const generateSampleEmployees = (): void => {
  const sampleEmployees: Omit<Employee, 'id'>[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Software Engineer',
      department: 'Engineering',
      salaryAmount: 85000,
      hireDate: '2021-05-15',
      status: 'active',
      bankAccount: '123456789',
      taxId: 'TX12345'
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      position: 'Product Manager',
      department: 'Product',
      salaryAmount: 95000,
      hireDate: '2020-03-10',
      status: 'active',
      bankAccount: '987654321',
      taxId: 'TX54321'
    },
    {
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.j@example.com',
      position: 'UI Designer',
      department: 'Design',
      salaryAmount: 78000,
      hireDate: '2022-01-20',
      status: 'active',
      bankAccount: '567891234',
      taxId: 'TX67890'
    },
    {
      firstName: 'Emily',
      lastName: 'Wilson',
      email: 'emily.w@example.com',
      position: 'Marketing Specialist',
      department: 'Marketing',
      salaryAmount: 72000,
      hireDate: '2021-11-05',
      status: 'active',
      bankAccount: '456789123',
      taxId: 'TX11223'
    },
    {
      firstName: 'Robert',
      lastName: 'Brown',
      email: 'robert.b@example.com',
      position: 'Finance Analyst',
      department: 'Finance',
      salaryAmount: 82000,
      hireDate: '2020-08-15',
      status: 'inactive',
      bankAccount: '789123456',
      taxId: 'TX99887'
    }
  ];
  
  // Clear existing employees and add sample ones
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  
  sampleEmployees.forEach(emp => {
    createEmployee(emp);
  });
  
  toast.success('Sample employees generated');
};
