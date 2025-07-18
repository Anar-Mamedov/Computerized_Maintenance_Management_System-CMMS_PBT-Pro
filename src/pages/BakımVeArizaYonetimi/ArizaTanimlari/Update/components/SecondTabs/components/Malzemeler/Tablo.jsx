import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function Tablo() {
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
      title: "Malzeme Kodu",
      dataIndex: "ISM_STOK_KOD",
      key: "ISM_STOK_KOD",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Malzeme Tanımı",
      dataIndex: "ISM_STOK_TANIM",
      key: "ISM_STOK_TANIM",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Miktar",
      dataIndex: "ISM_MIKTAR",
      key: "ISM_MIKTAR",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Birim",
      dataIndex: "ISM_BIRIM",
      key: "ISM_BIRIM",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Birim Fiyat",
      dataIndex: "ISM_BIRIM_FIYAT",
      key: "ISM_BIRIM_FIYAT",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Maliyet",
      dataIndex: "ISM_TUTAR",
      key: "ISM_TUTAR",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Açıklama",
      dataIndex: "ISM_ACIKLAMA",
      key: "ISM_ACIKLAMA",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetIsTanimMazleme?isTanimID=${secilenBakimID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          key: item.TB_IS_TANIM_MLZ_ID,
          ISM_STOK_ID: item.ISM_STOK_ID,
          ISM_IS_TANIM_ID: item.ISM_IS_TANIM_ID,
          ISM_DEPO_ID: item.ISM_DEPO_ID,
          ISM_STOK_KOD: item.ISM_STOK_KOD,
          ISM_STOK_TANIM: item.ISM_STOK_TANIM,
          ISM_STOK_TIP_KOD_ID: item.ISM_STOK_TIP_KOD_ID,
          ISM_STOK_TIP: item.ISM_STOK_TIP,
          ISM_MIKTAR: item.ISM_MIKTAR,
          ISM_TUTAR: item.ISM_TUTAR,
          ISM_BIRIM_FIYAT: item.ISM_BIRIM_FIYAT,
          ISM_BIRIM_KOD_ID: item.ISM_BIRIM_KOD_ID,
          ISM_BIRIM: item.ISM_BIRIM,
          ISM_OLUSTURMA_TARIH: item.ISM_OLUSTURMA_TARIH,
          ISM_DEGISTIRME_TARIH: item.ISM_DEGISTIRME_TARIH,
          ISM_OLUSTURAN_ID: item.ISM_OLUSTURAN_ID,
          ISM_DEGISTIREN_ID: item.ISM_DEGISTIREN_ID,
          ISM_ACIKLAMA: item.ISM_ACIKLAMA,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [secilenBakimID]);

  useEffect(() => {
    if (secilenBakimID) {
      // secilenBakimID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenBakimID, fetch]); // secilenBakimID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

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
      <CreateModal onRefresh={refreshTable} secilenBakimID={secilenBakimID} />
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
