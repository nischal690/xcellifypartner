import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

import AIPoweredButton from './AIPoweredButton';

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

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  fieldName,
  onAIRefine,
}) => {
  const [editorHeight, setEditorHeight] = useState(600);
  const [refinedText, setRefinedText] = useState('');
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  const plainTextLength = value?.replace(/<[^>]*>/g, '')?.length || 0;
  const isEligible = plainTextLength >= 50 && plainTextLength <= 1000;

  const handleRefineClick = async () => {
    setLoading(true);
    const aiText = await onAIRefine(value, fieldName);
    setRefinedText(aiText);
    setLoading(false);
  };

  const handleApplyRefined = () => {
    onChange(refinedText);
    setRefinedText('');
  };

  return (
    <div className="w-full border rounded-md relative bg-white">
      {/*  Toolbar with Refine Button */}
      <div className="sticky top-0 bg-white z-1 border-b shadow-sm p-2 flex justify-between items-center">
        <span className="font-medium">Text Editor</span>
        <div className="flex gap-2 items-center">
          <AIPoweredButton
            isEligible={isEligible}
            loading={loading}
            onClick={handleRefineClick}
          />

          {refinedText && (
            <button
              onClick={handleApplyRefined}
              className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
            >
              Apply
            </button>
          )}
        </div>
      </div>

      {/*  Resizable Editor */}
      <ResizableBox
        height={editorHeight}
        width="100%"
        axis="y"
        minConstraints={[100, 100]}
        maxConstraints={[Infinity, 600]}
        onResizeStop={(e, { size }) => setEditorHeight(size.height)}
      >
        <div style={{ height: editorHeight, overflow: 'auto' }}>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            modules={{
              toolbar: toolbarOptions,
              history: { delay: 2000, maxStack: 500, userOnly: true },
            }}
            className="bg-white rounded-md"
            style={{ height: '100%' }}
          />
        </div>
      </ResizableBox>
    </div>
  );
};

export default RichTextEditor;
