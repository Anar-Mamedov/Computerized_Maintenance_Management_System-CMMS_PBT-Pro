import React, { useState } from "react";
import { Button, message } from "antd";
import { saveAs } from "file-saver";
import * as Docxtemplater from "docxtemplater";

const Form = ({ selectedRows }) => {
  // Function to handle button click
  const downloadWordFile = async () => {
    if (!selectedRows.length) {
      message.error("Please select rows to download.");
      return;
    }

    try {
      // Load the template
      const templateUrl = "./template.docx"; // Replace with actual path
      console.log("Fetching template:", templateUrl);
      const template = await fetch(templateUrl).then((response) => response.blob());
      console.log("Fetched template:", template);

      // Prepare data for template
      const processedData = selectedRows.map((row) => ({
        email: row.email, // Replace with actual property names
        userName: row.userName,
        machineCode: row.machineCode,
      }));

      // Populate template using docxtemplater
      const variables = { ...processedData };
      const doc = new Docxtemplater(); // No need to pass the template here
      console.log("Loading template...");
      await doc.load(template);
      console.log("Template loaded.");
      doc.render(variables);

      // Create a Blob object from the populated template
      const populatedTemplate = new Blob([doc.docx], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Trigger download using FileSaver.js
      saveAs(populatedTemplate, "your_filename.docx");
    } catch (error) {
      console.error("Error downloading Word file:", error);
      message.error("An error occurred while downloading the Word file.");
    }
  };

  // ... rest of your component

  return (
    <div>
      {/* Your table or data selection component */}
      <Button type="primary" onClick={downloadWordFile}>
        Download Word File
      </Button>
    </div>
  );
};

export default Form;
