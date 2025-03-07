import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
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
        {/*  Render Rich Text Properly */}
        <ReactQuill value={content} readOnly={true} theme="bubble" />
      </div>
    </div>
  );
}
