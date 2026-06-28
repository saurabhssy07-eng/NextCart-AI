import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, description, className = '' }) => {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 rounded-xl shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {Icon && (
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-gray-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </motion.div>
  );
};

export default StatCard;
