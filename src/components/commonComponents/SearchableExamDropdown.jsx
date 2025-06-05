import React, { useState, useEffect, useRef } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';

const SearchableExamDropdown = ({
  options,
  onChange,
  placeholder = 'Search for an exam...',
  value = '',
  className = '',
  showDetails = false,
  allowCustom = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.full_form && option.full_form.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (option.purpose && option.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Set initial value if provided
  useEffect(() => {
    if (value) {
      const option = options.find(opt => opt.name === value);
      if (option) {
        setSelectedOption(option);
        setIsCustomMode(false);
      } else if (value) {
        // If value doesn't match any option, treat it as custom
        setCustomValue(value);
        setIsCustomMode(true);
        setSelectedOption(null);
      }
    }
  }, [value, options]);

  const handleOptionSelect = (option) => {
    if (option === 'custom') {
      setIsCustomMode(true);
      setSelectedOption(null);
      setIsOpen(false);
      setSearchTerm('');
      // Don't call onChange yet, wait for custom input
    } else {
      setSelectedOption(option);
      setIsCustomMode(false);
      setIsOpen(false);
      setSearchTerm('');
      onChange(option.name);
    }
  };
  
  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    setCustomValue(value);
    onChange(value);
  };
  
  const switchToDropdown = () => {
    setIsCustomMode(false);
    setSelectedOption(null);
    setCustomValue('');
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {isCustomMode ? (
        <div className="flex items-center border rounded-md p-2">
          <input
            type="text"
            className="w-full outline-none"
            placeholder="Enter custom exam name"
            value={customValue}
            onChange={handleCustomInputChange}
          />
          <button 
            type="button"
            className="ml-2 text-purple-600 hover:text-purple-800"
            onClick={switchToDropdown}
          >
            <FaMagnifyingGlass />
          </button>
        </div>
      ) : (
        <div 
          className="flex items-center border rounded-md p-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaMagnifyingGlass className="text-gray-400 mr-2" />
          <input
            type="text"
            className="w-full outline-none"
            placeholder={selectedOption ? selectedOption.name : placeholder}
            value={isOpen ? searchTerm : (selectedOption ? selectedOption.name : '')}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          />
        </div>
      )}
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {allowCustom && (
            <div 
              className="p-2 hover:bg-purple-100 cursor-pointer border-b flex items-center text-purple-600"
              onClick={() => handleOptionSelect('custom')}
            >
              <FaPlus className="mr-2" />
              <div className="font-medium">Add Other Exam</div>
            </div>
          )}
          
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div 
                key={index}
                className="p-2 hover:bg-purple-100 cursor-pointer"
                onClick={() => handleOptionSelect(option)}
              >
                <div className="font-medium">{option.name}</div>
                {showDetails && (
                  <div className="text-sm text-gray-600">
                    {option.full_form && <div>{option.full_form}</div>}
                    {option.purpose && <div className="italic">{option.purpose}</div>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No exams found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableExamDropdown;
