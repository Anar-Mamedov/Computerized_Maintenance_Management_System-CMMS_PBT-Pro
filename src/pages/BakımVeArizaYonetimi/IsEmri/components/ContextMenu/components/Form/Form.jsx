import React from "react";
import { Button } from "antd";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

export default function Form({ selectedRows }) {
  const loadTemplateAndFillPDF = async (rowData) => {
    try {
      // Cache-busting query string ekleyerek PDF şablonunun URL'ini hazırla
      const url = `./template.pdf?${new Date().getTime()}`; // PDF şablonunun URL'ini buraya girin

      const response = await fetch(url);
      console.log(response); // Yanıtı kontrol et

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const existingPdfBytes = await response.arrayBuffer();

      // PDF şablonunu yükle ve PDFDocument nesnesi oluştur
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // PDF'de yazı ekleme veya düzenleme işlemleri
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // Örnek: ilk sayfaya metin ekleme
      firstPage.drawText(`E-Posta Adresi: ${rowData.email}`, {
        x: 50,
        y: height - 100,
        size: 12,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(`Kullanıcı İsmi: ${rowData.userName}`, {
        x: 50,
        y: height - 120,
        size: 12,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(`Makine Kodu: ${rowData.makineKodu}`, {
        x: 50,
        y: height - 140,
        size: 12,
        color: rgb(0, 0, 0),
      });

      // PDF'i Uint8Array olarak al ve Blob'a dönüştür
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Blob'u kullanarak PDF dosyasını kaydet
      saveAs(blob, "filled-template.pdf");
    } catch (error) {
      console.error("Error processing PDF template:", error);
    }
  };

  return (
    <div>
      {selectedRows.map((row, index) => (
        <Button key={index} type="primary" onClick={() => loadTemplateAndFillPDF(row)}>
          {`Download PDF for ${row.userName}`}
        </Button>
      ))}
    </div>
  );
}
