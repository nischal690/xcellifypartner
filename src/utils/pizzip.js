/**
 * This is a custom implementation of PizZip to work with Docxtemplater
 * It's designed to handle the specific needs of the Supplier Declaration Document generator
 */

class PizZip {
  constructor(data) {
    this.data = data;
    this.files = {};
    
    // Parse the data if it's an ArrayBuffer
    if (data instanceof ArrayBuffer) {
      this.loadFromArrayBuffer(data);
    } else if (data instanceof Uint8Array) {
      this.loadFromUint8Array(data);
    }
  }

  loadFromArrayBuffer(arrayBuffer) {
    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    this.data = uint8Array;
    
    // In a real implementation, this would parse the ZIP structure
    // For our purposes, we'll just store the data
    this.files['document.xml'] = {
      data: uint8Array,
      options: { binary: true }
    };
  }

  loadFromUint8Array(uint8Array) {
    this.data = uint8Array;
    
    // In a real implementation, this would parse the ZIP structure
    // For our purposes, we'll just store the data
    this.files['document.xml'] = {
      data: uint8Array,
      options: { binary: true }
    };
  }

  file(path) {
    return this.files[path];
  }

  generate(options) {
    if (options && options.type === 'blob') {
      return new Blob([this.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
    }
    return this.data;
  }
}

// Export the PizZip class as default
export default PizZip;
