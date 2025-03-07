import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['clean'],
];

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [editorHeight, setEditorHeight] = useState(200);

  const handleResize = (event, { size }) => {
    setEditorHeight(size.height);
  };

  return (
    <Resizable
      height={editorHeight}
      width={Infinity}
      onResize={handleResize}
      axis="y"
      minConstraints={[100, 100]}
      maxConstraints={[Infinity, 600]}
    >
      <div className="w-full border rounded-md relative">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-white rounded-md"
          modules={{ toolbar: toolbarOptions }}
          style={{ height: editorHeight, overflow: 'auto' }}
        />
      </div>
    </Resizable>
  );
};

export default RichTextEditor;
