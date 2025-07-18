import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../../../../api/http";
import { Button, message, Popconfirm, Modal } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { BsSendCheck } from "react-icons/bs";
import Onaylayicilar from "../../../../../OnayIslemleri/Onaylayicilar/Table/Table";

export default function OnayaGonderOnaylayiciList({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRows1, setSelectedRows1] = useState([]); // New state for selected rows
  // Sil düğmesini gizlemek için koşullu stil
  const buttonStyle = disabled ? { display: "none" } : {};

  // Silme işlemini tetikleyecek fonksiyon
  const handleDelete = async () => {
    let isError = false;

    // selectedRows1 içerisindeki ONYK_KUL_ID'leri virgüllerle birleştir
    const onykKulIds = selectedRows1.map((item) => item.ONYK_KUL_ID).join(",");

    // Seçili satırlar üzerinde döngü yaparak her birini sil
    for (const row of selectedRows) {
      try {
        // Silme API isteğini gönder
        const response = await AxiosInstance.post(`OnayaGonderManuel`, {
          ONAY_TABLO_ID: Number(row.key),
          ONAY_TABLO_KOD: row.ISEMRI_NO,
          ONYK_KUL_ID: onykKulIds,
          ONAY_ONYTANIM_ID: 1,
        });
        console.log("Silme işlemi başarılı:", response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem Başarılı.");
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("İşlem Başarısız.");
        }
        // Burada başarılı silme işlemi sonrası yapılacak işlemler bulunabilir.
      } catch (error) {
        console.error("Silme işlemi sırasında hata oluştu:", error);
      }
    }
    // Tüm silme işlemleri tamamlandıktan sonra ve hata oluşmamışsa refreshTableData'i çağır
    if (!isError) {
      refreshTableData();
      hidePopover(); // Silme işlemi başarılı olursa Popover'ı kapat
      setIsModalVisible(false);
      setSelectedRows1([]);
    }
  };

  return (
    <div style={buttonStyle}>
      <Popconfirm
        title="Onaya Gönderme İşlemi"
        description="Bu öğeyi onaya göndermek istediğinize emin misiniz?"
        onConfirm={() => setIsModalVisible(true)}
        okText="Evet"
        cancelText="Hayır"
        icon={
          <QuestionCircleOutlined
            style={{
              color: "red",
            }}
          />
        }
      >
        <Button style={{ paddingLeft: "0px", display: "flex", alignItems: "center" }} type="link" icon={<BsSendCheck />}>
          Onaya Gönder
        </Button>
      </Popconfirm>
      <Modal
        title="Onaylayıcıları Seç"
        open={isModalVisible}
        width={1200}
        onOk={handleDelete}
        destroyOnClose
        onCancel={() => setIsModalVisible(false)}
        okText="Gönder"
        cancelText="İptal"
        okButtonProps={{ disabled: selectedRows1.length === 0 }} // Boşsa buton devre dışı bırakılır
      >
        <Onaylayicilar selectedRows1={selectedRows1} setSelectedRows1={setSelectedRows1} />
      </Modal>
    </div>
  );
}
