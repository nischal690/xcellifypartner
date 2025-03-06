import React from 'react';
import { MdOutlineEdit } from 'react-icons/md';

export default function TagsCard({
  data,
  title,
  titleStyle = 'text-lg font-semibold text-gray-700 my-4',
  titleConatinerStyle = 'flex items-center justify-between px-1',
  cardStyle = 'shadow-md shadow-gray-400 p-3 rounded-md',
  keyValuePairStyle = 'mb-3 last:mb-0',
  keyStyle = 'font-semibold mb-2',
  tagStyle = 'px-3 py-0.5 bg-[#CFC5FE] text-[#242424] rounded-md mx-1 font-medium text-sm',
  containerStyle = 'min-w-96',
  defaultValue = 'N/A',
  onEditClick,
  EditIcon,
  EditButtonStyle = 'text-purple-primary text-purple-600',
  haveEditButton,
}) {
  return (
    <div className={containerStyle}>
      <div className={titleConatinerStyle}>
        <h3 className={titleStyle}>{title}</h3>
        {haveEditButton && (
          <button onClick={onEditClick} className={EditButtonStyle}>
            {EditIcon || <MdOutlineEdit />}
          </button>
        )}
      </div>
      <div className={cardStyle}>
        {data?.map(({ key, values }, index) => (
          <div key={index} className={keyValuePairStyle}>
            <p className={keyStyle}>{key}</p>
            {values?.map((value) => (
              <span className={tagStyle}>{value || defaultValue}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
