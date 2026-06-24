import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Popconfirm, message } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
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

  const columns = [
    {
      title: "Sira No",
      dataIndex: "IOC_SIRA_NO",
      key: "IOC_SIRA_NO",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Tanım",
      dataIndex: "IOC_TANIM",
      key: "IOC_TANIM",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Hedef Değer",
      dataIndex: "IOC_HEDEF_DEGER",
      key: "IOC_HEDEF_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Ondalık",
      dataIndex: "IOC_FORMAT",
      key: "IOC_FORMAT",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Limit",
      dataIndex: "IOC_MIN_MAX_DEGER",
      key: "IOC_MIN_MAX_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Min Değer",
      dataIndex: "IOC_MIN_DEGER",
      key: "IOC_MIN_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Max Değer",
      dataIndex: "IOC_MAX_DEGER",
      key: "IOC_MAX_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetIsTanimOlcum?isTanimID=${secilenBakimID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          key: item.TB_IS_TANIM_OLCUM_PARAMETRE_ID,
          IOC_IS_TANIM_ID: item.IOC_IS_TANIM_ID,
          IOC_SIRA_NO: item.IOC_SIRA_NO,
          IOC_TANIM: item.IOC_TANIM,
          IOC_BIRIM_KOD_ID: item.IOC_BIRIM_KOD_ID,
          IOC_BIRIM: item.IOC_BIRIM,
          IOC_HEDEF_DEGER: item.IOC_HEDEF_DEGER,
          IOC_MIN_MAX_DEGER: item.IOC_MIN_MAX_DEGER,
          IOC_MIN_DEGER: item.IOC_MIN_DEGER,
          IOC_MAX_DEGER: item.IOC_MAX_DEGER,
          IOC_FORMAT: item.IOC_FORMAT,
          IOC_OLUSTURAN_ID: item.IOC_OLUSTURAN_ID,
          IOC_OLUSTURMA_TARIH: item.IOC_OLUSTURMA_TARIH,
          IOC_DEGISTIREN_ID: item.IOC_DEGISTIREN_ID,
          IOC_DEGISTIRME_TARIH: item.IOC_DEGISTIRME_TARIH,
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
    setSelectedRowKeys(selectedKeys);
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
  }, [fetch]);

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Lütfen silinecek kayıtları seçin.");
      return;
    }

    let successCount = 0;

    // API tek bir ID alır (POST /api/IsTanimOlcumParametreSil?id={id}), seçili her kayıt için ayrı istek atılır
    for (const id of selectedRowKeys) {
      try {
        const response = await AxiosInstance.post(`IsTanimOlcumParametreSil?id=${id}`);
        if (response?.has_error) {
          message.warning(response.status || "Ölçüm parametresi silinemedi.");
        } else {
          successCount++;
        }
      } catch (error) {
        const errorMessage = error.response?.data?.status || "Sunucu hatası, silinemedi.";
        message.error(errorMessage);
        console.error("Silme hatası:", error);
      }
    }

    if (successCount > 0) {
      message.success(`${successCount} adet ölçüm parametresi başarıyla silindi.`);
      setSelectedRowKeys([]);
      refreshTable();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
        <Popconfirm
          title="Silme İşlemi"
          description={`${selectedRowKeys.length} adet ölçüm parametresini silmek istediğinize emin misiniz?`}
          onConfirm={handleDelete}
          okText="Evet"
          cancelText="Hayır"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          disabled={selectedRowKeys.length === 0}
        >
          <Button type="default" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} style={{ marginBottom: "10px" }}>
            Sil
          </Button>
        </Popconfirm>
        <CreateModal onRefresh={refreshTable} secilenBakimID={secilenBakimID} />
      </div>
      <Table
        rowSelection={{
          type: "checkbox",
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
