
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { getEmployees } from '../models/employeeModel';
import { processPayroll } from '../models/payrollModel';
import { Employee } from '../models/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ProcessPayroll = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [payPeriodStart, setPayPeriodStart] = useState<string>('');
  const [payPeriodEnd, setPayPeriodEnd] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);

  useEffect(() => {
    loadEmployees();
    
    // Set default pay period (current month)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setPayPeriodStart(format(firstDay, 'yyyy-MM-dd'));
    setPayPeriodEnd(format(lastDay, 'yyyy-MM-dd'));
  }, []);

  const loadEmployees = () => {
    try {
      const employeeData = getEmployees();
      const activeEmployees = employeeData.filter(emp => emp.status === 'active');
      setEmployees(activeEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }
    
    if (!payPeriodStart || !payPeriodEnd) {
      toast.error('Please select a valid pay period');
      return;
    }
    
    setProcessing(true);
    
    try {
      processPayroll(selectedEmployee, payPeriodStart, payPeriodEnd);
      setProcessingComplete(true);
      
      // Reset form
      setSelectedEmployee('');
    } catch (error) {
      console.error('Error processing payroll:', error);
      toast.error('Failed to process payroll');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setProcessingComplete(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tight"
            >
              Process Payroll
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              Generate payroll for employees
            </motion.p>
          </div>
          
          {employees.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12 glass-card rounded-xl"
            >
              <div className="bg-amber-100 inline-flex rounded-full p-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium">No active employees found</h3>
              <p className="text-muted-foreground mt-1 mb-6 max-w-md mx-auto">
                You need to have active employees before you can process payroll.
              </p>
            </motion.div>
          ) : processingComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12 glass-card rounded-xl"
            >
              <div className="bg-green-100 inline-flex rounded-full p-3 mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Payroll Processed Successfully</h3>
              <p className="text-muted-foreground mt-1 mb-6">
                The payroll has been processed and recorded.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                >
                  Process Another Payroll
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="glass-card rounded-xl p-6 space-y-6"
            >
              <div className="space-y-2">
                <label htmlFor="employee" className="text-sm font-medium">
                  Select Employee
                </label>
                <select
                  id="employee"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select an employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} - {emp.position}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="payPeriodStart" className="text-sm font-medium">
                    Pay Period Start
                  </label>
                  <input
                    id="payPeriodStart"
                    type="date"
                    value={payPeriodStart}
                    onChange={(e) => setPayPeriodStart(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="payPeriodEnd" className="text-sm font-medium">
                    Pay Period End
                  </label>
                  <input
                    id="payPeriodEnd"
                    type="date"
                    value={payPeriodEnd}
                    onChange={(e) => setPayPeriodEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={processing}
                  className="w-full flex justify-center items-center px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-70"
                >
                  {processing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" /> Process Payroll
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProcessPayroll;
