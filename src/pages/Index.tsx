
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { getPayrollSummary } from '../models/payrollModel';
import { getEmployees, generateSampleEmployees } from '../models/employeeModel';
import { generateSamplePayrolls } from '../models/payrollModel';
import { PayrollSummary } from '../models/types';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Index = () => {
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Load summary data
      const summaryData = getPayrollSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateSampleData = () => {
    try {
      generateSampleEmployees();
      generateSamplePayrolls();
      
      // Refresh summary data
      const summaryData = getPayrollSummary();
      setSummary(summaryData);
      
      toast.success("Sample data generated successfully");
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast.error("Failed to generate sample data");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tight"
            >
              Payroll Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              Welcome to PaySync - Your payroll management system
            </motion.p>
          </div>
          
          {getEmployees().length === 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium"
              onClick={handleGenerateSampleData}
            >
              Generate Sample Data
            </motion.button>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl animate-pulse bg-muted"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Active Employees"
                value={summary?.totalEmployees || 0}
                icon={<Users className="h-5 w-5" />}
              />
              <StatCard
                title="Total Payroll"
                value={`$${(summary?.totalPayroll || 0).toLocaleString()}`}
                icon={<DollarSign className="h-5 w-5" />}
                description="Current month"
              />
              <StatCard
                title="Average Salary"
                value={`$${(summary?.averageSalary || 0).toLocaleString()}`}
                icon={<TrendingUp className="h-5 w-5" />}
                trend={{ value: 3.2, isPositive: true }}
              />
              <StatCard
                title="Pending Payrolls"
                value={summary?.pendingPayrolls || 0}
                icon={<Calendar className="h-5 w-5" />}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="glass-card rounded-xl col-span-2 p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/employees/add">
                    <motion.div
                      whileHover={{ y: -4, boxShadow: "0 10px 25px -15px rgba(0, 0, 0, 0.1)" }}
                      className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <Users className="h-5 w-5 mb-2 text-primary" />
                      <h3 className="font-medium">Add New Employee</h3>
                      <p className="text-sm text-muted-foreground mt-1">Create a new employee record</p>
                    </motion.div>
                  </Link>
                  
                  <Link to="/process-payroll">
                    <motion.div
                      whileHover={{ y: -4, boxShadow: "0 10px 25px -15px rgba(0, 0, 0, 0.1)" }}
                      className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <DollarSign className="h-5 w-5 mb-2 text-primary" />
                      <h3 className="font-medium">Process Payroll</h3>
                      <p className="text-sm text-muted-foreground mt-1">Manage employee payments</p>
                    </motion.div>
                  </Link>
                  
                  <Link to="/employees">
                    <motion.div
                      whileHover={{ y: -4, boxShadow: "0 10px 25px -15px rgba(0, 0, 0, 0.1)" }}
                      className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <Users className="h-5 w-5 mb-2 text-primary" />
                      <h3 className="font-medium">View Employees</h3>
                      <p className="text-sm text-muted-foreground mt-1">Manage your employee list</p>
                    </motion.div>
                  </Link>
                  
                  <Link to="/payroll-history">
                    <motion.div
                      whileHover={{ y: -4, boxShadow: "0 10px 25px -15px rgba(0, 0, 0, 0.1)" }}
                      className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <Calendar className="h-5 w-5 mb-2 text-primary" />
                      <h3 className="font-medium">Payroll History</h3>
                      <p className="text-sm text-muted-foreground mt-1">View past payroll records</p>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="glass-card rounded-xl p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Department Overview</h2>
                {summary && summary.departments.length > 0 ? (
                  <div className="space-y-3">
                    {summary.departments.map((dept, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{dept.name}</span>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-secondary rounded-full mr-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${(dept.count / summary.totalEmployees) * 100}%` 
                              }}
                              transition={{ duration: 0.6, delay: 0.1 * index }}
                              className="h-full bg-primary rounded-full"
                            ></motion.div>
                          </div>
                          <span className="text-sm font-medium">{dept.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No department data available
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </Layout>
  );
};

export default Index;
