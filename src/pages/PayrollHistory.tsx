
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { FileText, Search, Filter } from 'lucide-react';
import { getPayrollRecords } from '../models/payrollModel';
import { Payroll } from '../models/types';
import PayrollCard from '../components/PayrollCard';
import { toast } from 'sonner';

const PayrollHistory = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayrolls();
  }, []);

  const loadPayrolls = () => {
    try {
      setLoading(true);
      const payrollData = getPayrollRecords();
      setPayrolls(payrollData);
    } catch (error) {
      console.error('Error loading payroll records:', error);
      toast.error('Failed to load payroll records');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayrolls = payrolls.filter(payroll => {
    const matchesSearch = 
      payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payroll.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight"
          >
            Payroll History
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            View and search past payroll records
          </motion.p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-muted-foreground" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="processed">Processed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl animate-pulse bg-muted"></div>
            ))}
          </div>
        ) : filteredPayrolls.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPayrolls.map(payroll => (
              <PayrollCard key={payroll.id} payroll={payroll} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <div className="bg-muted inline-flex rounded-full p-3 mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No payroll records found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || statusFilter !== 'all' 
                ? "No records match your search criteria" 
                : "Process payroll for employees to see records here"}
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default PayrollHistory;
