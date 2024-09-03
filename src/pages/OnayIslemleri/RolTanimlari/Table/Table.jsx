import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
import CreateModal from "../Insert/CreateModal.jsx";
import EditModal from "../Update/EditModal.jsx";

export default function MainTable({ isActive }) {
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
      title: "İş Tanımı",
      dataIndex: "ROL_TANIM",
      key: "ROL_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Oluşturma Tarihi",
      dataIndex: "ROL_OLUSTURMA_TAR",
      key: "ROL_OLUSTURMA_TAR",
      width: 200,
      ellipsis: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Değiştirme Tarihi",
      dataIndex: "ROL_DEGISTIRME_TAR",
      key: "ROL_DEGISTIRME_TAR",
      width: 200,
      ellipsis: true,
      render: (text) => formatDate(text),
    },
  ];

  const secilenIsEmriID = watch("secilenIsEmriID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.post(`GetOnayRolTanim`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_ROL_ID,
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        // Hata işleme
        console.error("API isteği sırasında hata oluştu:", error);
      })
      .finally(() => setLoading(false));
  }, [secilenIsEmriID]); // secilenIsEmriID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    // secilenIsEmriID'nin varlığını ve geçerliliğini kontrol edin
    fetch(); // fetch fonksiyonunu çağırın
  }, [fetch]); // secilenIsEmriID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

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
      <CreateModal onRefresh={refreshTable} secilenIsEmriID={secilenIsEmriID} />
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
