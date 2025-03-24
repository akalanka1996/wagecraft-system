
import React from 'react';
import { motion } from 'framer-motion';
import { Employee } from '../models/types';
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmployeeCardProps {
  employee: Employee;
  onDelete: (id: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onDelete }) => {
  const {
    id,
    firstName,
    lastName,
    position,
    department,
    email,
    salaryAmount,
    status
  } = employee;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{firstName} {lastName}</h3>
            <p className="text-sm text-muted-foreground">{position}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status === 'active' ? (
              <><CheckCircle className="mr-1 h-3 w-3" /> Active</>
            ) : (
              <><XCircle className="mr-1 h-3 w-3" /> Inactive</>
            )}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Department</span>
            <span className="text-sm font-medium">{department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Email</span>
            <span className="text-sm">{email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Salary</span>
            <span className="text-sm font-medium">${salaryAmount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex justify-between pt-3 border-t border-border">
          <Link 
            to={`/employees/edit/${id}`}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Link>
          <button 
            onClick={() => onDelete(id)}
            className="inline-flex items-center text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeCard;
