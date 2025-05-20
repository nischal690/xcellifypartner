/* 
 * PizZip - A minimal implementation for document generation
 * This file provides a compatible interface for Docxtemplater
 */
window.PizZip = function(data) {
  var zip = {};
  
  // Store the data
  zip.data = data;
  
  // Files collection
  zip.files = {};
  
  // Generate method for output
  zip.generate = function(options) {
    if (options && options.type === 'blob') {
      return new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
    }
    return data;
  };
  
  return zip;
};
