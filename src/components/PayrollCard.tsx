
import React from 'react';
import { motion } from 'framer-motion';
import { Payroll } from '../models/types';
import { CalendarIcon, CheckSquare, AlertCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface PayrollCardProps {
  payroll: Payroll;
}

const PayrollCard: React.FC<PayrollCardProps> = ({ payroll }) => {
  const {
    employeeName,
    payPeriodStart,
    payPeriodEnd,
    baseAmount,
    deductions,
    taxes,
    netAmount,
    status,
    processedDate
  } = payroll;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return dateString;
    }
  };

  const statusIcon = () => {
    switch (status) {
      case 'processed':
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const statusColor = () => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{employeeName}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              <span>{formatDate(payPeriodStart)} - {formatDate(payPeriodEnd)}</span>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor()}`}>
            {statusIcon()}
            <span className="ml-1 capitalize">{status}</span>
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Base Amount:</span>
            <span className="font-medium">${baseAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Deductions:</span>
            <span className="font-medium text-red-500">-${deductions.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Taxes:</span>
            <span className="font-medium text-red-500">-${taxes.toFixed(2)}</span>
          </div>
          <div className="h-px bg-border my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Net Amount:</span>
            <span className="text-lg font-semibold">${netAmount.toFixed(2)}</span>
          </div>
        </div>
        
        {status === 'processed' && (
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Processed Date:</span>
              <span className="text-sm">{formatDate(processedDate)}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PayrollCard;
