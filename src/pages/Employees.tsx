
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Plus, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../models/employeeModel';
import { Employee } from '../models/types';
import EmployeeCard from '../components/EmployeeCard';
import { toast } from 'sonner';

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    try {
      setLoading(true);
      const employeeData = getEmployees();
      setEmployees(employeeData);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    setShowConfirmDelete(id);
  };

  const confirmDelete = (id: string) => {
    try {
      deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
      setShowConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.firstName.toLowerCase().includes(searchLower) ||
      employee.lastName.toLowerCase().includes(searchLower) ||
      employee.position.toLowerCase().includes(searchLower) ||
      employee.department.toLowerCase().includes(searchLower) ||
      employee.email.toLowerCase().includes(searchLower)
    );
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tight"
            >
              Employees
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              Manage your organization's employees
            </motion.p>
          </div>
          
          <Link to="/employees/add">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Employee
            </motion.button>
          </Link>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl animate-pulse bg-muted"></div>
            ))}
          </div>
        ) : filteredEmployees.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEmployees.map(employee => (
              <div key={employee.id} className="relative">
                <EmployeeCard 
                  employee={employee} 
                  onDelete={handleDeleteEmployee} 
                />
                
                {showConfirmDelete === employee.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl"
                  >
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center max-w-[90%]">
                      <p className="mb-4">Are you sure you want to delete this employee?</p>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => cancelDelete()}
                          className="px-3 py-1.5 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => confirmDelete(employee.id)}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-destructive hover:bg-destructive/90 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
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
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No employees found</h3>
            <p className="text-muted-foreground mt-1 mb-6">
              {searchTerm ? "No employees match your search" : "Get started by adding your first employee"}
            </p>
            {!searchTerm && (
              <Link to="/employees/add">
                <button className="inline-flex items-center bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium">
                  <Plus className="h-4 w-4 mr-1" /> Add Employee
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Employees;
