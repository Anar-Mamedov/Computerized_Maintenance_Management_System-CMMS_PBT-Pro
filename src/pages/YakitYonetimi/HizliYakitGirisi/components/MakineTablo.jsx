import React, { useState, useEffect } from "react";
import { Modal, Table, Input, Button } from "antd";
import { SearchOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Controller, useFormContext, get } from "react-hook-form";
import AxiosInstance from "../../../../api/http";

export default function MakineSecim({
  control,
  setValue,
  errors,
  disabled = false,
  makineFieldName = "MKN_KOD_temp",
  makineIdFieldName = "TB_MAKINE_ID_temp",
  onMakinelerSecildi, // Seçilen tüm satırları ana tabloya fırlatacak callback
  secilenMakineIdleri = [], // 🌟 Ana tablodaki mevcut makinelerin ID listesi (Dışlama için)
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Çoklu seçim için state
  const [selectedRows, setSelectedRows] = useState([]); 
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleModalToggle = () => {
    if (!isModalVisible) {
      setSelectedRows([]); // Modal her açıldığında seçimleri temizle
      setCurrentPage(1);   // Sayfayı 1'e çek
    }
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (isModalVisible) {
      setLoading(true);

      // Dokümandaki formata uygun request body
      const payload = {
        Parametre: searchTerm,
        PagingDeger: currentPage,
        PageSize: 10,
        EklenenMakineIds: secilenMakineIdleri || [], // 🌟 Seçili olanları backend'e gönderiyoruz ki gizlesin
      };

      // 🌟 Yeni API Endpoint'i: GetYakitMakineList
      AxiosInstance.post(`GetYakitMakineList`, payload)
        .then((res) => {
          // Backend'den hata dönmediyse listeyi state'e bas
          if (res && !res.has_error) {
            const items = res?.makine_listesi || [];
            setData(items);
            setTotalCount(res?.kayit_sayisi || 0);
          } else {
            clearTable();
          }
        })
        .catch(() => {
          clearTable();
        })
        .finally(() => setLoading(false));
    }
  }, [isModalVisible, searchTerm, currentPage, secilenMakineIdleri]);

  const clearTable = () => {
    setData([]);
    setTotalCount(0);
  };

  // Olayı radyo butonundan Checkbox'a çeviren kısım
  const rowSelection = {
    type: "checkbox", 
    selectedRowKeys: selectedRows.map(row => row.TB_MAKINE_ID),
    onChange: (keys, rows) => {
      setSelectedRows(rows); 
    },
  };

  const handleModalOk = () => {
    if (selectedRows && selectedRows.length > 0) {
      if (typeof setValue === "function") {
        setValue(makineFieldName, selectedRows[0].MKN_KOD);
        setValue(makineIdFieldName, selectedRows[0].TB_MAKINE_ID);
      }

      if (typeof onMakinelerSecildi === "function") {
        onMakinelerSecildi(selectedRows);
      }
    }
    setIsModalVisible(false);
  };

  const handleClear = () => {
    if (typeof setValue === "function") {
      setValue(makineFieldName, "");
      setValue(makineIdFieldName, "");
    }
    if (typeof onMakinelerSecildi === "function") {
      onMakinelerSecildi([]); 
    }
  };

  // Dokümandan dönen yeni alan isimlerine göre kolon başlıkları güncellendi
  const columns = [
    { title: "Ekipman Kodu", dataIndex: "MKN_KOD", key: "MKN_KOD", width: 150, ellipsis: true },
    { title: "Ekipman Tanımı", dataIndex: "MKN_TANIM", key: "MKN_TANIM", width: 250, ellipsis: true },
    {
      title: "Aktif",
      dataIndex: "MKN_AKTIF",
      key: "MKN_AKTIF",
      width: 100,
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          {text ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}
        </div>
      ),
    },
    { title: "Ekipman Durumu", dataIndex: "MKN_DURUM", key: "MKN_DURUM", width: 150, ellipsis: true },
    { title: "Lokasyon", dataIndex: "MKN_LOKASYON", key: "MKN_LOKASYON", width: 150, ellipsis: true },
    { title: "Ekipman Tipi", dataIndex: "MKN_TIP", key: "MKN_TIP", width: 150, ellipsis: true },
    { title: "Kategori", dataIndex: "MKN_KATEGORI", key: "MKN_KATEGORI", width: 150, ellipsis: true },
    { title: "Marka", dataIndex: "MKN_MARKA", key: "MKN_MARKA", width: 150, ellipsis: true },
    { title: "Model", dataIndex: "MKN_MODEL", key: "MKN_MODEL", width: 150, ellipsis: true },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name={makineFieldName}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              status={get(errors, makineFieldName) ? "error" : ""}
              style={{ width: "100%", maxWidth: "630px" }}
              disabled
            />
          )}
        />

        <Controller
          name={makineIdFieldName}
          control={control}
          render={({ field }) => <Input {...field} type="hidden" />}
        />

        <div style={{ display: "flex", gap: "5px" }}>
          <Button disabled={disabled} onClick={handleModalToggle}>
            +
          </Button>
          <Button onClick={handleClear}>-</Button>
        </div>
      </div>

      <Modal
        width="1200px"
        title="Ekipman Seçimi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}
        destroyOnClose
      >
        <Input
          style={{ width: "250px", marginBottom: "10px" }}
          placeholder="Ekipman ara..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Arama yapılınca sayfalama 1'e dönsün kanka
          }}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
        />

        <Table
          rowKey="TB_MAKINE_ID"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ y: "calc(100vh - 450px)" }}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: totalCount,
            showSizeChanger: false, // Dokümana göre sabit 10'arlı sayfalama
            onChange: (page) => setCurrentPage(page),
            showTotal: (total) => `Toplam ${total} Kayıt`,
          }}
        />
      </Modal>
    </div>
  );
}