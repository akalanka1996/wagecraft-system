
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Employee } from '../models/types';
import { createEmployee, updateEmployee } from '../models/employeeModel';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface EmployeeFormProps {
  employee?: Employee;
  isEdit?: boolean;
}

const initialState: Omit<Employee, 'id'> = {
  firstName: '',
  lastName: '',
  email: '',
  position: '',
  department: '',
  salaryAmount: 0,
  hireDate: new Date().toISOString().split('T')[0],
  status: 'active',
  bankAccount: '',
  taxId: ''
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, isEdit = false }) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    ...initialState,
    ...(employee ? {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      salaryAmount: employee.salaryAmount,
      hireDate: employee.hireDate,
      status: employee.status,
      bankAccount: employee.bankAccount || '',
      taxId: employee.taxId || '',
    } : {})
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  
  const departments = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Sales',
    'Finance',
    'HR',
    'Operations',
    'Customer Support'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.salaryAmount || formData.salaryAmount <= 0) {
      newErrors.salaryAmount = 'Please enter a valid salary amount';
    }
    if (!formData.hireDate.trim()) newErrors.hireDate = 'Hire date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    try {
      if (isEdit && employee) {
        updateEmployee(employee.id, formData);
      } else {
        createEmployee(formData);
      }
      
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee data');
    }
  };
  
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit} 
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors ${
              errors.firstName ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName}</p>
          )}
        </div>
        
        {/* Last Name */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors ${
              errors.lastName ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName}</p>
          )}
        </div>
        
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors ${
              errors.email ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>
        
        {/* Position */}
        <div className="space-y-2">
          <label htmlFor="position" className="text-sm font-medium">
            Position
          </label>
          <input
            id="position"
            name="position"
            type="text"
            value={formData.position}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors ${
              errors.position ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.position && (
            <p className="text-xs text-destructive">{errors.position}</p>
          )}
        </div>
        
        {/* Department */}
        <div className="space-y-2">
          <label htmlFor="department" className="text-sm font-medium">
            Department
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors ${
              errors.department ? 'border-destructive' : 'border-input'
            }`}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && (
            <p className="text-xs text-destructive">{errors.department}</p>
          )}
        </div>
        
        {/* Salary Amount */}
        <div className="space-y-2">
          <label htmlFor="salaryAmount" className="text-sm font-medium">
            Annual Salary ($)
          </label>
          <input
            id="salaryAmount"
            name="salaryAmount"
            type="number"
            min="0"
            step="1000"
            value={formData.salaryAmount}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors ${
              errors.salaryAmount ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.salaryAmount && (
            <p className="text-xs text-destructive">{errors.salaryAmount}</p>
          )}
        </div>
        
        {/* Hire Date */}
        <div className="space-y-2">
          <label htmlFor="hireDate" className="text-sm font-medium">
            Hire Date
          </label>
          <input
            id="hireDate"
            name="hireDate"
            type="date"
            value={formData.hireDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors ${
              errors.hireDate ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.hireDate && (
            <p className="text-xs text-destructive">{errors.hireDate}</p>
          )}
        </div>
        
        {/* Status */}
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        {/* Bank Account */}
        <div className="space-y-2">
          <label htmlFor="bankAccount" className="text-sm font-medium">
            Bank Account (Optional)
          </label>
          <input
            id="bankAccount"
            name="bankAccount"
            type="text"
            value={formData.bankAccount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        
        {/* Tax ID */}
        <div className="space-y-2">
          <label htmlFor="taxId" className="text-sm font-medium">
            Tax ID (Optional)
          </label>
          <input
            id="taxId"
            name="taxId"
            type="text"
            value={formData.taxId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/employees')}
          className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
        >
          {isEdit ? 'Update Employee' : 'Add Employee'}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default EmployeeForm;
