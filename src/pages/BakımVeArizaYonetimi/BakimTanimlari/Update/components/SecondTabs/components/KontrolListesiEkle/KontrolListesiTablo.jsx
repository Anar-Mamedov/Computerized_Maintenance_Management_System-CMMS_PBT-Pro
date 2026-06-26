import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Popconfirm, message } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function KontrolListesiTablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: "Sıra No",
      dataIndex: "ISK_SIRANO",
      key: "ISK_SIRANO",
      width: 40,
      ellipsis: true,
    },
    {
      title: "Tanım",
      dataIndex: "ISK_TANIM",
      key: "ISK_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Açıklama",
      dataIndex: "ISK_ACIKLAMA",
      key: "ISK_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`IsTanimKontrolList?isTanimID=${secilenBakimID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          key: item.TB_IS_TANIM_KONROLLIST_ID,
          ISK_SIRANO: item.ISK_SIRANO,
          ISK_TANIM: item.ISK_TANIM,
          ISK_ACIKLAMA: item.ISK_ACIKLAMA,
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        // Hata işleme
        console.error("API isteği sırasında hata oluştu:", error);
      })
      .finally(() => setLoading(false));
  }, [secilenBakimID]); // secilenBakimID değiştiğinde fetch fonksiyonunu güncelle

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

    // API tek bir ID alır (POST /api/IsTanimKontrolSil?id={id}), seçili her kayıt için ayrı istek atılır
    for (const id of selectedRowKeys) {
      try {
        const response = await AxiosInstance.post(`IsTanimKontrolSil?id=${id}`);
        if (response?.has_error) {
          message.warning(response.status || "Kayıt silinemedi.");
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
      message.success(`${successCount} adet kayıt başarıyla silindi.`);
      setSelectedRowKeys([]);
      refreshTable();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
        <Popconfirm
          title="Silme İşlemi"
          description={`${selectedRowKeys.length} adet kontrol listesi kaydını silmek istediğinize emin misiniz?`}
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
