
import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import EmployeeForm from '../components/EmployeeForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddEmployee = () => {
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
              Add Employee
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              Create a new employee record
            </motion.p>
          </div>
        </div>
        
        <EmployeeForm />
      </div>
    </Layout>
  );
};

export default AddEmployee;
