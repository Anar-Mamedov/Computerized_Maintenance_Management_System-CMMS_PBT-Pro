import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Input, message, Tooltip, Row, Col, Typography, Popconfirm } from "antd";
import AxiosInstance from "../../../../../../../../api/http";

const { Text } = Typography;

const FirmaEkleCikar = ({ visible, onCancel, onOk, firmalar = [], teklifId }) => {
  const [dataSource, setDataSource] = useState([]);
  const [externalFirmalar, setExternalFirmalar] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFirmaIds, setSelectedFirmaIds] = useState([]);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setDataSource(firmalar);
  }, [firmalar]);

  useEffect(() => {
    const fetchExternalFirmalar = async () => {
      try {
        setLoadingExternal(true);
        const res = await AxiosInstance.get(
          `GetFirmaList?pagingDeger=${currentPage}&search=${searchValue}`
        );
        const list = Array.isArray(res?.Firma_Liste) ? res.Firma_Liste : [];
        setExternalFirmalar(list);
      } catch (err) {
        console.error(err);
        message.error("Tedarikçiler yüklenirken hata oluştu");
        setExternalFirmalar([]);
      } finally {
        setLoadingExternal(false);
      }
    };
    fetchExternalFirmalar();
  }, [currentPage, searchValue]);

  const handleDelete = async (firmaId) => {
    if (!teklifId) return message.error("Teklif ID bulunamadı!");
    try {
      setDeletingId(firmaId);
      const payload = { TeklifId: teklifId, FirmaIdList: [firmaId] };
      const response = await AxiosInstance.post("TeklifPaketiFirmaCikar", payload);
      if (response && !response.has_error && response.status_code === 200) {
        message.success("Firma başarıyla kaldırıldı!");
        setDataSource(prev => prev.filter(f => f.firmaId !== firmaId));
      } else {
        message.error("Firma silinirken bir hata oluştu!");
      }
    } catch (err) {
      console.error(err);
      message.error("Sunucuya bağlanırken bir hata oluştu!");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddSelected = async () => {
  if (!teklifId || selectedFirmaIds.length === 0) return;
  try {
    const payload = { TeklifId: teklifId, FirmaIdList: selectedFirmaIds };
    const response = await AxiosInstance.post("TeklifPaketiFirmaEkle", payload);
    if (response && !response.has_error && response.status_code === 200) {
      // API’den eklenen firmaları al
      const addedFirmalar = externalFirmalar
  .filter(f => selectedFirmaIds.includes(f.TB_CARI_ID))
  .map(f => ({
    firmaId: f.TB_CARI_ID,      // Mevcut tabloya uygun
    firmaTanim: f.CAR_TANIM,    // Tanımı da gelsin
    firmaTip: f.CAR_TIP         // Opsiyonel, istersen tabloya ekleyebilirsin
  }));
      
      // Mevcut tabloda yoksa ekle
      setDataSource(prev => [
  ...prev,
  ...addedFirmalar.filter(f => !prev.some(p => p.firmaId === f.firmaId))
]);

      setSelectedFirmaIds([]);
      message.success("Firmalar başarıyla eklendi!");
    } else {
      message.error("Firmalar eklenirken hata oluştu!");
    }
  } catch (err) {
    console.error(err);
    message.error("Sunucuya bağlanırken bir hata oluştu!");
  }
};

  const columnsCurrent = [
    { title: "Firma Adı", dataIndex: "firmaTanim", key: "firmaTanim" },
    {
    title: "İşlem",
    key: "action",
    render: (_, record) => (
      <Popconfirm
        title={`"${record.firmaTanim}" tedarikçisini silmek istediğinizden emin misiniz?`}
        onConfirm={() => handleDelete(record.firmaId)}
        okText="Evet"
        cancelText="Hayır"
      >
        <Button type="link" danger loading={deletingId === record.firmaId}>
          Sil
        </Button>
      </Popconfirm>
    ),
  },
  ];

  const columnsExternal = [
    {
      title: "Firma",
      dataIndex: "CAR_TANIM",
      key: "CAR_TANIM",
      ellipsis: true,
      render: text => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: "Tip",
      dataIndex: "CAR_TIP",
      key: "CAR_TIP",
      ellipsis: true,
      render: text => <Tooltip title={text}>{text}</Tooltip>,
    },
  ];

  return (
    <Modal
      open={visible}
      title={<span style={{ fontWeight: 650, fontSize: 20 }}>Tedarikçi Ekle / Sil</span>}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Button key="cancel" onClick={onCancel}>İptal</Button>,
        <Button
            type="primary"
            onClick={handleAddSelected}
            disabled={selectedFirmaIds.length === 0}
            style={{ marginBottom: 8 }}
          >
            Seçilenleri Ekle
          </Button>
      ]}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Text strong style={{ fontSize: 16 }}>Tedarikçi Listesi</Text>

          <Input.Search
            placeholder="Tedarikçi ara..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={(value) => setSearchValue(value)}
            allowClear
            style={{ marginBottom: 10, marginTop: 5 }}
          />

          <Table
            columns={columnsExternal}
            dataSource={externalFirmalar}
            rowKey={record => record.TB_CARI_ID}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedFirmaIds,
              onChange: keys => setSelectedFirmaIds(keys),
            }}
            loading={loadingExternal}
            pagination={{
              current: currentPage,
              pageSize: 10,
              onChange: page => setCurrentPage(page),
            }}
          />
        </Col>

        <Col span={12}>
          <Text strong style={{ fontSize: 16 }}>Mevcut Tedarikçiler</Text>

          <Input.Search
            placeholder="Mevcut tedarikçi ara..."
            allowClear
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              setDataSource(
                firmalar.filter((f) =>
                  f.firmaTanim?.toLowerCase().includes(value)
                )
              );
            }}
            style={{ marginBottom: 10, marginTop: 5 }}
          />

          <Table
            columns={columnsCurrent}
            dataSource={dataSource}
            rowKey="firmaId"
            pagination={false}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default FirmaEkleCikar;