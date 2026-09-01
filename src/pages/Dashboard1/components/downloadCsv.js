import { saveAs } from "file-saver";

const escapeCell = (value) => {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * Widget verisini Excel'in ayraç olarak noktalı virgülü tanıdığı CSV formatında indirir.
 * @param {string} fileName Uzantısız dosya adı
 * @param {string[]} headers Kolon başlıkları
 * @param {Array<Array<string|number>>} rows Satır değerleri
 */
export default function downloadCsv(fileName, headers, rows) {
  const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(";"));
  const blob = new Blob([`\ufeff${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${fileName}.csv`);
}
