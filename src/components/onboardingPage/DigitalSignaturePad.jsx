import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const DigitalSignaturePad = () => {
  const sigCanvas = useRef(null);
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);

  const clear = () => {
    sigCanvas.current.clear();
    setTrimmedDataURL(null);
  };

  const trimCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let top = null,
      bottom = null,
      left = null,
      right = null;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4 + 3; // alpha channel
        if (data[index] > 0) {
          if (top === null) top = y;
          bottom = y;
          if (left === null || x < left) left = x;
          if (right === null || x > right) right = x;
        }
      }
    }

    if (top === null) {
      return canvas; // blank canvas, nothing to trim
    }

    const trimmedWidth = right - left + 1;
    const trimmedHeight = bottom - top + 1;

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;
    const trimmedCtx = trimmedCanvas.getContext('2d');

    trimmedCtx.putImageData(
      ctx.getImageData(left, top, trimmedWidth, trimmedHeight),
      0,
      0
    );

    return trimmedCanvas;
  };

  const trim = () => {
    const rawCanvas = sigCanvas.current.getCanvas();
    const trimmed = trimCanvas(rawCanvas);
    const dataURL = trimmed.toDataURL('image/png');
    setTrimmedDataURL(dataURL);
  };

  const download = () => {
    const rawCanvas = sigCanvas.current.getCanvas();
    const trimmed = trimCanvas(rawCanvas);
    const dataURL = trimmed.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'digital-signature.png';
    link.click();
  };

  return (
    <div className="border p-4 rounded-md bg-white mb-4">
      <h3 className="text-md font-semibold mb-2">Capture Digital Signature</h3>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        backgroundColor="rgba(0,0,0,0)" // ensures transparent background
        canvasProps={{
          width: 400,
          height: 150,
          className: 'border border-gray-300 rounded-md',
        }}
      />

      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={clear}
          className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-100"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={trim}
          className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={download}
          className="px-3 py-1 bg-purple-primary text-white rounded hover:bg-purple-700"
        >
          Download PNG
        </button>
      </div>

      {trimmedDataURL && (
        <div className="mt-4">
          <p className="text-sm mb-1 text-gray-700">Preview:</p>
          <img
            src={trimmedDataURL}
            alt="Trimmed signature"
            className="border rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default DigitalSignaturePad;
