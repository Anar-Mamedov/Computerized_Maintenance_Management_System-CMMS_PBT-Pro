import React, { useEffect } from "react";
import AxiosInstance from "../../../../../../api/http";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function Sil({
  selectedRows,
  refreshTableData,
  disabled,
  hidePopover,
}) {
  // selectedRows.forEach((row, index) => {
  //   console.log(`Satır ${index + 1} ID: ${row.key}`);
  //   // Eğer id değerleri farklı bir özellikte tutuluyorsa, row.key yerine o özelliği kullanın. Örneğin: row.id
  // });

  // Sil düğmesini gizlemek için koşullu stil
  const buttonStyle = disabled ? { display: "none" } : {};

  // Silme işlemini tetikleyecek fonksiyon
  // const handleDelete = async () => {
  //   let isError = false;
  //   // Seçili satırlar üzerinde döngü yaparak her birini sil
  //   for (const row of selectedRows) {
  //     try {
  //       // Silme API isteğini gönder
  //       const response = await AxiosInstance.post(`IsTalepSil?talepID=${row.key}`);
  //       console.log("Silme işlemi başarılı:", response);
  //       // Burada başarılı silme işlemi sonrası yapılacak işlemler bulunabilir.
  //     } catch (error) {
  //       console.error("Silme işlemi sırasında hata oluştu:", error);
  //     }
  //   }
  //   // Tüm silme işlemleri tamamlandıktan sonra ve hata oluşmamışsa refreshTableData'i çağır
  //   if (!isError) {
  //     refreshTableData();
  //     hidePopover(); // Silme işlemi başarılı olursa Popover'ı kapat
  //   }
  // };

  const handleDelete = async () => {
    let isError = false;
    // Local storage'dan userId değerini al
    const user = JSON.parse(localStorage.getItem("user"));
    // Seçili satırlar üzerinde döngü yaparak her birini sil
    for (const row of selectedRows) {
      try {
        // Silme API isteğini gönder
        const response = await AxiosInstance.post(`IsEmriSil`, {
          ID: row.key,
          // KulID: user.userId,
        });
        console.log("Silme işlemi başarılı:", response);
        // Burada başarılı silme işlemi sonrası yapılacak işlemler bulunabilir.
      } catch (error) {
        console.error("Silme işlemi sırasında hata oluştu:", error);
      }
    }
    // Tüm silme işlemleri tamamlandıktan sonra ve hata oluşmamışsa refreshTableData'i çağır
    if (!isError) {
      refreshTableData();
      hidePopover(); // Silme işlemi başarılı olursa Popover'ı kapat
    }
  };

  return (
    <div style={buttonStyle}>
      <Button
        style={{ paddingLeft: "0px" }}
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={handleDelete}
      >
        Sil
      </Button>
    </div>
  );
}
