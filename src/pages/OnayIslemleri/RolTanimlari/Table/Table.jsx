import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
import CreateModal from "../Insert/CreateModal.jsx";
import EditModal from "../Update/EditModal.jsx";
import ContextMenu from "../components/ContextMenu/ContextMenu.jsx";

export default function MainTable({ isActive }) {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // New state for selected rows
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
      title: "Rol Tanımı",
      dataIndex: "ROL_TANIM",
      key: "ROL_TANIM",
      width: 200,
      ellipsis: true,
    },

    {
      title: "Açıklama",
      dataIndex: "ROL_ACIKLAMA",
      key: "ROL_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
  ];

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
  }, []); // secilenIsEmriID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    // secilenIsEmriID'nin varlığını ve geçerliliğini kontrol edin
    fetch(); // fetch fonksiyonunu çağırın
  }, [fetch]); // secilenIsEmriID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const onRowSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows); // Update selected rows data
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
    setSelectedRowKeys([]); // Clear selected row keys
    setSelectedRows([]); // Clear selected rows data
  }, [fetch]);

  return (
    <div style={{ marginBottom: "25px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTable} />
        <CreateModal onRefresh={refreshTable} />
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
        />
      )}
    </div>
  );
}
