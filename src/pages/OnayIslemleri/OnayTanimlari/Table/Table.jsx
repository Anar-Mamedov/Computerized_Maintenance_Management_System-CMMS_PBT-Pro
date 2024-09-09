import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Switch, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
import CreateModal from "../Insert/CreateModal.jsx";
import EditModal from "../Update/EditModal.jsx";
import ContextMenu from "../components/ContextMenu/ContextMenu.jsx";
import EditModal1 from "../../Kurallar/Update/EditModal.jsx";
import { GiCog } from "react-icons/gi";
import dayjs from "dayjs";

export default function MainTable({ isActive }) {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // New state for selected rows
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal1Visible, setIsModal1Visible] = useState(false);
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
      title: "Onay Tanımı",
      dataIndex: "ONY_TANIM",
      key: "ONY_TANIM",
      width: 200,
      ellipsis: true,
      onCell: (record) => ({
        onClick: () => {
          setSelectedRow(record);
          setIsModalVisible(true);
        },
      }),
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Açıklama",
      dataIndex: "ONY_ACIKLAMA",
      key: "ONY_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Aktif",
      dataIndex: "ONY_AKTIF",
      key: "ONY_AKTIF",
      width: 100,
      render: (text, record) => <Switch checked={record.ONY_AKTIF} onChange={(checked) => handleSwitchChange(checked, record)} />,
    },
    {
      title: "Kural",
      dataIndex: "",
      key: "Kural",
      width: 80,
      ellipsis: true,
      align: "center", // Center the title
      onCell: (record) => ({
        onClick: () => {
          setSelectedRow(record);
          setIsModal1Visible(true);
        },
      }),
      render: () => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <GiCog style={{ color: "#2bc770", cursor: "pointer", fontSize: "22px" }} />
        </div>
      ),
    },
  ];

  const handleSwitchChange = (checked, record) => {
    const Body = {
      TB_ONAY_ID: record.TB_ONAY_ID,
      ONY_TANIM: record.ONY_TANIM,
      ONY_ACIKLAMA: record.ONY_ACIKLAMA,
      ONY_DEGISTIRME_TAR: dayjs().format("YYYY-MM-DD"),
      ONY_AKTIF: checked,
    };

    AxiosInstance.post(`UpdateOnayTanim`, Body)
      .then((response) => {
        console.log("Data sent successfully:", response);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Güncelleme Başarılı.");
          refreshTable(); // Tabloyu yenile
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Güncelleme Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });
  };

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.post(`GetOnayTanimFullList`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_ONAY_ID,
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

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
    setSelectedRowKeys([]); // Clear selected row keys
    setSelectedRows([]); // Clear selected rows data
  }, [fetch]);

  return (
    <div style={{ marginBottom: "25px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {/*<ContextMenu selectedRows={selectedRows} refreshTableData={refreshTable} />*/}
        {/*  <CreateModal onRefresh={refreshTable} />*/}
      </div>
      <Table
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: onRowSelectChange,
        }}
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
      {isModal1Visible && (
        <EditModal1
          selectedRow={selectedRow}
          isModalVisible={isModal1Visible}
          onModalClose={() => {
            setIsModal1Visible(false);
            setSelectedRow(null);
          }}
          onRefresh={refreshTable}
        />
      )}
    </div>
  );
}
