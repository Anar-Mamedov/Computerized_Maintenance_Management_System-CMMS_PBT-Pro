import React from "react";
import { useDropzone } from "react-dropzone";

function FileUploadComponent() {
  const onDrop = (acceptedFiles) => {
    // Handle the dropped files here
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles } = useDropzone({
    onDrop,
    accept: "image/*, application/pdf", // Customize the accepted file types
    maxFileSize: 5000000, // Max file size in bytes (5 MB in this case)
    multiple: true, // Allow multiple files to be uploaded
  });

  const getDropzoneStyles = () => ({
    border: "2px dashed #cccccc",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    outline: "none",
    cursor: "pointer",
    transition: "border .24s ease-in-out",
    marginBottom: "20px",
    ...(isDragActive
      ? { borderColor: "#2bc771" } // Green border when dragging
      : isDragReject
      ? { borderColor: "#ff1744" } // Red border when dragging rejected files
      : {}),
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div>
      <div {...getRootProps({ style: getDropzoneStyles() })}>
        <input {...getInputProps()} />
        {isDragAccept ? (
          <p style={{ marginBottom: "0px" }}>Dosyaları buraya bırakın...</p>
        ) : (
          <p style={{ marginBottom: "0px" }}>Resmi sürükleyip bırakın veya seçmek için tıklayın</p>
        )}
      </div>
      <aside>
        <h4>Dosya</h4>
        <ul>{files}</ul>
      </aside>
    </div>
  );
}

export default FileUploadComponent;
