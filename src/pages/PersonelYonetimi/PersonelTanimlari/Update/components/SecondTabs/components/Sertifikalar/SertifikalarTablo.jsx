import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // Örnek olarak Türkçe dil paketi yükleniyor, gerekirse değiştirilebilir
import localizedFormat from "dayjs/plugin/localizedFormat"; // Tarihleri yerel olarak biçimlendirmek için dayjs eklentisini kullanın
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function SertifikalarTablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // tarihi yerel olarak biçimlendirmek için dayjs eklentisini kullanın

  dayjs.extend(localizedFormat);
  const userLocale = navigator.language; // Kullanıcının yerel ayarını al
  dayjs.locale(userLocale); // Day.js yerel ayarlarını belirle

  const formatDate = (date) => {
    return dayjs(date).format("L"); // 'L' formatı yerel tarih formatını temsil eder
  };

  // tarihi yerel olarak biçimlendirmek için dayjs eklentisini kullanın sonu

  const columns = [
    {
      title: "Sertifika Tipi",
      dataIndex: "PSE_SERTIFIKA_TIP",
      key: "PSE_SERTIFIKA_TIP",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Belge No",
      dataIndex: "PSE_BELGE_NO",
      key: "PSE_BELGE_NO",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Veriliş Tarihi",
      dataIndex: "PSE_VERILIS_TARIH",
      key: "PSE_VERILIS_TARIH",
      width: 200,
      ellipsis: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "PSE_BITIS_TARIH",
      key: "PSE_BITIS_TARIH",
      width: 200,
      ellipsis: true,
      render: (text) => formatDate(text),
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
          key: item.TB_PERSONEL_SERTIFIKA_ID,
          PSE_SERTIFIKA_TIP: item.PSE_SERTIFIKA_TIP,
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
