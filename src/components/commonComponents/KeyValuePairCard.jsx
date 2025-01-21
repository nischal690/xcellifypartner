import React from 'react'
import { MdOutlineEdit } from 'react-icons/md'

export default function KeyValuePairCard({
    keyValuePairs,
    title,
    titleStyle='text-lg font-semibold my-4',
    titleConatinerStyle="flex items-center justify-between px-1",
    cardStyle = 'shadow-md shadow-gray-300 p-3 rounded-md bg-white',
    keyValuePairStyle='flex justify-between flex-row mb-3 last:mb-0',
    keyStyle = 'font-medium max-w-[48%]',
    valueStyle='max-w-[48%]',
    defaultValue ='-',
    containerStyle='min-w-96',
    onEditClick,
    EditIcon,
    EditButtonStyle="text-purple-primary text-purple-600",
    haveEditButton,
}) {
  return (
    <div className={containerStyle}>
        <div className={titleConatinerStyle}>
            <h3 className={titleStyle}>
                {title}
            </h3>
            {haveEditButton &&
                <button onClick={onEditClick} className={EditButtonStyle}>
                    {EditIcon || <MdOutlineEdit/>}
                </button>
            }
        </div>
        <div className={cardStyle}>  
            {keyValuePairs?.map(({key,value}, index)=>(
                <div key={index} className={keyValuePairStyle}>
                    <p className={keyStyle}>{key}</p>
                    <p className={valueStyle}>{value || defaultValue}</p>
                </div>
            ))}
        </div>
    </div>
  )
}