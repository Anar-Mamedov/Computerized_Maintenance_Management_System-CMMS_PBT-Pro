import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function KontrolListesiTablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long"; // Tam ad ("January")
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short"; // Üç harfli kısaltma ("Jan")
    } else {
      monthFormat = "2-digit"; // Sayısal gösterim ("01")
    }

    // Kullanıcı için tarihi formatla
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  const columns = [
    {
      title: "S.N.",
      dataIndex: "PSE_SERTIFIKA_TIP",
      key: "PSE_SERTIFIKA_TIP",
      width: 120,
      ellipsis: true,
    },
    {
      title: "İş Tanımı",
      dataIndex: "PSE_BELGE_NO",
      key: "PSE_BELGE_NO",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Personel",
      dataIndex: "PSE_VERILIS_TARIH",
      key: "PSE_VERILIS_TARIH",
      width: 200,
      ellipsis: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Maliyet",
      dataIndex: "PSE_BITIS_TARIH",
      key: "PSE_BITIS_TARIH",
      width: 200,
      ellipsis: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Süre",
      dataIndex: "PSE_ACIKLAMA",
      key: "PSE_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Açıklama",
      dataIndex: "PSE_ACIKLAMA",
      key: "PSE_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
  ];

  const secilenPersonelID = watch("secilenPersonelID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`PersonelSertifikaList?personelId=${secilenPersonelID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_PERSONEL_SERTIFIKA_ID,
          PSE_SERTIFIKA_TIP: item.PSE_SERTIFIKA_TIP,
          PSE_SERTIFIKA_TIP_KOD_ID: item.PSE_SERTIFIKA_TIP_KOD_ID,
          PSE_BELGE_NO: item.PSE_BELGE_NO,
          PSE_VERILIS_TARIH: item.PSE_VERILIS_TARIH,
          PSE_BITIS_TARIH: item.PSE_BITIS_TARIH,
          PSE_ACIKLAMA: item.PSE_ACIKLAMA,
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        // Hata işleme
        console.error("API isteği sırasında hata oluştu:", error);
      })
      .finally(() => setLoading(false));
  }, [secilenPersonelID]); // secilenPersonelID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    if (secilenPersonelID) {
      // secilenPersonelID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenPersonelID, fetch]); // secilenPersonelID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
  }, [fetch]);

  return (
    <div>
      <CreateModal onRefresh={refreshTable} secilenPersonelID={secilenPersonelID} />
      <Table
        rowSelection={{
          type: "radio",
          selectedRowKeys,
          onChange: onRowSelectChange,
        }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{
          // x: "auto",
          y: "calc(100vh - 360px)",
        }}
      />
      {isModalVisible && (
        <EditModal
          selectedRow={selectedRow}
          isModalVisible={isModalVisible}
          onModalClose={() => {
            setIsModalVisible(false);
            setSelectedRow(null);
          }}
          onRefresh={refreshTable}
        />
      )}
    </div>
  );
}
