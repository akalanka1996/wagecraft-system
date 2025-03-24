
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import EmployeeForm from '../components/EmployeeForm';
import { ArrowLeft } from 'lucide-react';
import { getEmployeeById } from '../models/employeeModel';
import { Employee } from '../models/types';
import { toast } from 'sonner';

const EditEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      toast.error('Employee ID is missing');
      navigate('/employees');
      return;
    }

    try {
      const employeeData = getEmployeeById(id);
      
      if (!employeeData) {
        toast.error('Employee not found');
        navigate('/employees');
        return;
      }
      
      setEmployee(employeeData);
    } catch (error) {
      console.error('Error loading employee data:', error);
      toast.error('Failed to load employee data');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/employees">
            <motion.div
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.div>
          </Link>
          
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tight"
            >
              Edit Employee
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              Update employee information
            </motion.p>
          </div>
        </div>
        
        {employee && <EmployeeForm employee={employee} isEdit={true} />}
      </div>
    </Layout>
  );
};

export default EditEmployee;
