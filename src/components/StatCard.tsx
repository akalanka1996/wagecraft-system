
import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl p-6 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="bg-primary bg-opacity-10 p-2 rounded-full text-primary">
          {icon}
        </div>
      </div>
      
      <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
      
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}
      
      {trend && (
        <div className="flex items-center mt-2">
          <span className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
