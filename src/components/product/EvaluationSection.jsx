import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';

const EvaluationSection = ({ formData, setFormData }) => {
  const [showEvaluation, setShowEvaluation] = useState(false);

  useEffect(() => {
    if (!formData.evaluation_form) {
      setFormData((prev) => ({
        ...prev,
        evaluation_form: [],
      }));
    }
  }, []);

  const handleToggle = () => {
    setShowEvaluation(!showEvaluation);
  };

  const handleChange = (index, field, value) => {
    const updated = [...(formData.evaluation_form || [])];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, evaluation_form: updated }));
  };

  const addQuestion = () => {
    const updated = [
      ...(formData.evaluation_form || []),
      { question: '', type: 'Short Paragraph', answer: '' },
    ];
    setFormData((prev) => ({ ...prev, evaluation_form: updated }));
  };

  const removeQuestion = (index) => {
    const updated = [...(formData.evaluation_form || [])];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, evaluation_form: updated }));
  };

  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-medium text-gray-700">
          Include Evaluation Form
        </span>
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showEvaluation ? 'bg-purple-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showEvaluation ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {showEvaluation && (
        <div className="mt-4 space-y-6">
          <h4 className="font-semibold text-purple-700">Evaluation Form</h4>

          {(formData.evaluation_form || []).map((item, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-md bg-purple-50 space-y-3 relative"
            >
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-sm mb-1 font-medium text-gray-700">
                    Enter your question
                  </label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) =>
                      handleChange(idx, 'question', e.target.value)
                    }
                    className="w-full border p-2 rounded"
                    placeholder="Type your question"
                  />
                </div>

                <div className="w-48">
                  <label className="block text-sm mb-1 font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={item.type}
                    onChange={(e) => handleChange(idx, 'type', e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option>Short Paragraph</option>
                    <option>Paragraph</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => removeQuestion(idx)}
                  className="text-red-500 hover:text-red-700 absolute right-3 top-3"
                  title="Remove"
                >
                  <AiOutlineDelete size={20} />
                </button>
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">
                  Enter your answer
                </label>
                <input
                  type="text"
                  value={item.answer}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (item.type === 'Short Paragraph' && val.length <= 50) {
                      handleChange(idx, 'answer', val);
                    } else if (item.type === 'Paragraph') {
                      if (val.length <= 1000) {
                        handleChange(idx, 'answer', val);
                      }
                    }
                  }}
                  className="w-full border p-2 rounded"
                  placeholder={
                    item.type === 'Short Paragraph'
                      ? 'Max 50 characters'
                      : '50 to 1000 characters'
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {item.answer.length}/
                  {item.type === 'Short Paragraph' ? 50 : 1000} characters
                </p>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium"
          >
            <AiOutlinePlus /> Add Question
          </button>
        </div>
      )}
    </div>
  );
};

export default EvaluationSection;
