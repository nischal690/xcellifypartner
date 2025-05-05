import React, { useState, useEffect } from 'react';

const CollapsibleSection = ({ 
  title, 
  children, 
  isOpen = false, 
  onToggle,
  isCompleted = false,
  isActive = false,
  index,
  totalSections
}) => {
  const [expanded, setExpanded] = useState(isOpen);

  useEffect(() => {
    setExpanded(isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    const newState = !expanded;
    setExpanded(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className={`mb-6 border rounded-xl overflow-hidden transition-all duration-300 ${
      expanded ? 'shadow-md' : 'shadow-sm'
    } ${isCompleted ? 'border-green-200' : isActive ? 'border-purple-200' : 'border-gray-200'}`}>
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer ${
          expanded 
            ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100' 
            : isCompleted 
              ? 'bg-green-50' 
              : 'bg-gray-50'
        }`}
        onClick={handleToggle}
      >
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
            isCompleted 
              ? 'bg-green-500 text-white' 
              : isActive 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-300 text-gray-600'
          }`}>
            {isCompleted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <h3 className={`font-semibold ${
            isCompleted 
              ? 'text-green-700' 
              : isActive 
                ? 'text-purple-800' 
                : 'text-gray-700'
          }`}>
            {title}
          </h3>
        </div>
        
        <div className="flex items-center">
          {isCompleted && (
            <span className="text-green-600 text-sm mr-3">Completed</span>
          )}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform duration-300 ${
              expanded ? 'transform rotate-180' : ''
            } ${
              isCompleted 
                ? 'text-green-500' 
                : isActive 
                  ? 'text-purple-600' 
                  : 'text-gray-400'
            }`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-500 ${
          expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
