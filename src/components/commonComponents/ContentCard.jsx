import React from 'react';
import { MdOutlineEdit } from 'react-icons/md';

export default function ContentCard({
  content,
  title,
  titleStyle = 'text-lg font-semibold my-4',
  titleConatinerStyle = 'flex items-center justify-between px-1',
  cardStyle = 'shadow-md shadow-gray-300 p-3 rounded-md bg-white',
  containerStyle = 'min-w-96',
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
        <p className="break-words overflow-hidden text-ellipsis">{content}</p>
      </div>
    </div>
  );
}
