import React, { useState } from "react";
import { Modal, message } from "antd";
import Forms from "./components/Forms";
import { useForm, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";
import { CloseCircleOutlined } from "@ant-design/icons"; // İkon eklendi

export default function Iptal({ selectedRows, refreshTableData, iptalDisabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const methods = useForm({
    defaultValues: {
      nedenKodId: null,
      aciklama: "",
    },
  });
  const { reset } = methods;

  const containerStyle = {
    display: iptalDisabled ? "none" : "flex",
    alignItems: "flex-start",
    gap: "12px",
    cursor: "pointer",
    padding: "10px 12px",
    transition: "background-color 0.3s",
    width: "100%",
  };

  const onSubmited = (data) => {
    if (!selectedRows || selectedRows.length === 0) {
      message.warning("Lütfen önce bir satır seçin.");
      return;
    }
    const Body = {
      siparisId: selectedRows[0].key,
      islem: "iptal",
      nedenKodId: data.nedenKodId,
      aciklama: data.aciklama || "",
    };

    AxiosInstance.post("SatinalmaSiparisDurum", Body)
      .then((response) => {
        reset();
        setIsModalOpen(false);
        refreshTableData();

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("İşlem başarılı.");
        } else if (response.status_code === 401) {
          message.error("Yetkiniz yok.");
        } else {
          message.error("İşlem başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Hata oluştu.");
      });
  };

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
    if (!isModalOpen) reset();
  };

  return (
    <FormProvider {...methods}>
      <div
        className="menu-item-hover"
        style={containerStyle}
        onClick={handleModalToggle}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <div>
          <CloseCircleOutlined style={{ color: "#d48806", fontSize: "18px", marginTop: "4px" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "500", color: "#262626", fontSize: "14px", lineHeight: "1.2" }}>
            İptal Et
          </span>
          <span style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px", lineHeight: "1.4" }}>
            Siparişi iptal eder, raporlarda iptal statüsü ile görünür.
          </span>
        </div>
      </div>

      <Modal
        title="Satınalma Siparişi İptal"
        open={isModalOpen}
        onOk={methods.handleSubmit(onSubmited)}
        onCancel={handleModalToggle}
      >
        <form onSubmit={methods.handleSubmit(onSubmited)}>
          <Forms isModalOpen={isModalOpen} selectedRows={selectedRows} />
        </form>
      </Modal>
    </FormProvider>
  );
}