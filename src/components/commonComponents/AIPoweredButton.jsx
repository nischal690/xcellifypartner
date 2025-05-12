import React from 'react';
import { motion } from 'framer-motion';
import aiIcon from '../../assets/onboardingAssests/icons/ai-technology.png';

const AIPoweredButton = ({
  isEligible,
  loading,
  onClick,
  label = 'Refine with AI',
  loadingLabel = 'Refining...',
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={!isEligible || loading}
      whileHover={isEligible && !loading ? { scale: 1.05 } : {}}
      whileTap={isEligible && !loading ? { scale: 0.98 } : {}}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition duration-300 ${
        isEligible
          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white shadow-md hover:shadow-lg'
          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
      }`}
    >
      <div className="relative flex items-center justify-center">
        {loading && (
          <motion.div
            className="absolute h-8 w-8 rounded-full bg-white opacity-20"
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        <img src={aiIcon} alt="AI" className="h-5 w-5 object-contain z-10" />
      </div>

      <span className="ml-1">{loading ? loadingLabel : label}</span>
    </motion.button>
  );
};

export default AIPoweredButton;
