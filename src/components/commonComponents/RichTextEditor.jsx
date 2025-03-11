import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ResizableBox } from 'react-resizable';
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
  const [editorHeight, setEditorHeight] = useState(600);
  const quillRef = useRef(null);

  //  Handle Undo
  const handleUndo = () => {
    if (quillRef.current) {
      quillRef.current.getEditor().history.undo();
    }
  };

  //  Handle Redo
  const handleRedo = () => {
    if (quillRef.current) {
      quillRef.current.getEditor().history.redo();
    }
  };

  return (
    <div className="w-full border rounded-md relative bg-white">
      {/* ✅ Sticky Toolbar */}
      <div className="sticky top-0 bg-white z-1 border-b shadow-sm p-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Text Editor</span>
          <div className="flex space-x-2">
            <button
              onClick={handleUndo}
              className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Undo ↩
            </button>
            <button
              onClick={handleRedo}
              className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Redo ↪
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Resizable Editor Content */}
      <ResizableBox
        height={editorHeight}
        width="100%"
        axis="y"
        minConstraints={[100, 100]} // Min height
        maxConstraints={[Infinity, 600]} // Max height
        onResizeStop={(e, { size }) => setEditorHeight(size.height)}
      >
        <div style={{ height: editorHeight, overflow: 'auto' }}>
          <ReactQuill
            ref={quillRef} // Attach ref to Quill
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            modules={{
              toolbar: toolbarOptions,
              history: { delay: 2000, maxStack: 500, userOnly: true }, // Enable History Module
            }}
            className="bg-white rounded-md"
            style={{ height: '100%' }} // Ensure full height of resizable box
          />
        </div>
      </ResizableBox>
    </div>
  );
};

export default RichTextEditor;
