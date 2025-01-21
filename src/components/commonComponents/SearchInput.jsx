import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'

export default function SearchInput({
    searchValue,
    placeholder,
    textStyle,
    onChange,
    inputStyle,
    containerStyle,
    SearchIcon,
    searchIconStyle,
    haveSearchIcon,
}) {
  return (
    <div className={containerStyle || 'relative bg-gray-50 rounded-md flex flex-row items-center w-1/3'}>
        {haveSearchIcon && <FaMagnifyingGlass className={searchIconStyle || 'absolute left-3 top-[10px] w-4 h-4 text-gray-400 z-10'}/>}
        <input
            value={searchValue}
            placeholder={ placeholder || 'Search...' }
            className={inputStyle || 'px-10 py-2 rounded-md outline-none border-none bg-inherit w-full'}
            onChange={onChange}
        />
    </div>
    
  )
}
