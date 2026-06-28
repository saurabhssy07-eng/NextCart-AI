import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = ''
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-16 text-center bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl shadow-sm ${className}`}
    >
      {Icon && (
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-800/20 text-primary-500 rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <Icon className="w-12 h-12" />
        </motion.div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{title}</h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
