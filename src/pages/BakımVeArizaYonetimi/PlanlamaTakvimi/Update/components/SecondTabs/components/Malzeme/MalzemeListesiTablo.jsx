import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";
import ContextMenu from "./components/ContextMenu";

export default function MalzemeListesiTablo({ isActive }) {
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
      title: "Stok",
      dataIndex: "IDM_STOK_DUS",
      key: "IDM_STOK_DUS",
      width: 120,
      ellipsis: true,
      render: (text, record) => {
        return record.IDM_STOK_DUS ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckOutlined style={{ color: "green" }} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloseOutlined style={{ color: "red" }} />
          </div>
        );
      },
    },
    {
      title: "G",
      dataIndex: "DKN_YAPILDI",
      key: "DKN_YAPILDI",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Malzeme Kodu",
      dataIndex: "IDM_STOK_KOD",
      key: "IDM_STOK_KOD",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Malzeme Tanımı",
      dataIndex: "IDM_STOK_TANIM",
      key: "IDM_STOK_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Depo",
      dataIndex: "IDM_DEPO",
      key: "IDM_DEPO",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Miktar",
      dataIndex: "IDM_MIKTAR",
      key: "IDM_MIKTAR",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Birim",
      dataIndex: "IDM_BIRIM",
      key: "IDM_BIRIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Birim Fiyat",
      dataIndex: "IDM_BIRIM_FIYAT",
      key: "IDM_BIRIM_FIYAT",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Maliyet",
      dataIndex: "IDM_TUTAR",
      key: "IDM_TUTAR",
      width: 200,
      ellipsis: true,
    },
  ];

  const secilenIsEmriID = watch("secilenIsEmriID");

  const fetch = useCallback(() => {
    if (isActive) {
      setLoading(true);
      AxiosInstance.get(`IsEmriMalzemeList?isemriID=${secilenIsEmriID}`)
        .then((response) => {
          const fetchedData = response.map((item) => ({
            ...item,
            key: item.TB_ISEMRI_MLZ_ID,
          }));
          setData(fetchedData);
        })
        .catch((error) => {
          // Hata işleme
          console.error("API isteği sırasında hata oluştu:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [secilenIsEmriID, isActive]); // secilenIsEmriID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    if (secilenIsEmriID) {
      // secilenIsEmriID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenIsEmriID, fetch]); // secilenIsEmriID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

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
    <div style={{ marginBottom: "25px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <ContextMenu onRefresh={refreshTable} secilenIsEmriID={secilenIsEmriID} />
      </div>
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
          secilenIsEmriID={secilenIsEmriID}
        />
      )}
    </div>
  );
}
