import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Input, message, Tooltip, Row, Col, Typography, Popconfirm } from "antd";
import AxiosInstance from "../../../../../../../../api/http";

const { Text } = Typography;

const MalzemeEkleCikar = ({ visible, onCancel, malzemeler = [], teklifId }) => {
  const [dataSource, setDataSource] = useState([]);
  const [externalMalzemeler, setExternalMalzemeler] = useState([]);
  const [filteredCurrent, setFilteredCurrent] = useState([]);
  const [filteredExternal, setFilteredExternal] = useState([]);
  const [selectedMalzemeIds, setSelectedMalzemeIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [totalExternalCount, setTotalExternalCount] = useState(0);

  // Mevcut malzemeler
  useEffect(() => {
    setDataSource(malzemeler);
    setFilteredCurrent(malzemeler);
  }, [malzemeler]);

  // Dış kaynaklı malzemeleri API’den çek
  useEffect(() => {
    const fetchExternalMalzemeler = async () => {
      try {
        setLoadingExternal(true);
        const res = await AxiosInstance.get(
          `Stok?modulNo=1&page=${currentPage}&pageSize=10`
        );

        const list = Array.isArray(res?.Data) ? res.Data : [];
        const formattedList = list.map((item) => ({
          TB_STOK_ID: item.TB_STOK_ID,
          STK_KOD: item.STK_KOD,
          STK_TANIM: item.STK_TANIM,
          STK_BIRIM_KOD_ID: item.STK_BIRIM_KOD_ID,
        }));

        setExternalMalzemeler(formattedList);
        setFilteredExternal(formattedList);
        setTotalExternalCount(res.TotalCount || 0);
      } catch (err) {
        console.error(err);
        message.error("Malzemeler yüklenirken hata oluştu!");
        setExternalMalzemeler([]);
        setFilteredExternal([]);
        setTotalExternalCount(0);
      } finally {
        setLoadingExternal(false);
      }
    };

    fetchExternalMalzemeler();
  }, [currentPage]);

  // Silme
  const handleDelete = async (malzemeId) => {
    if (!teklifId) return message.error("Teklif ID bulunamadı!");
    try {
      setDeletingId(malzemeId);
      const payload = { TeklifId: teklifId, StokIdList: [malzemeId] };
      const response = await AxiosInstance.post("TeklifPaketiMalzemeCikar", payload);

      if (response && !response.has_error && response.status_code === 200) {
        message.success("Malzeme başarıyla kaldırıldı!");
        const newData = dataSource.filter((m) => m.malzemeId !== malzemeId);
        setDataSource(newData);
        setFilteredCurrent(newData);
      } else {
        message.error("Malzeme silinirken bir hata oluştu!");
      }
    } catch (err) {
      console.error(err);
      message.error("Sunucuya bağlanırken bir hata oluştu!");
    } finally {
      setDeletingId(null);
    }
  };

  // Ekleme
  const handleAddSelected = async () => {
    if (!teklifId || selectedMalzemeIds.length === 0) return;

    try {
      const payload = {
        TeklifId: teklifId,
        Malzemeler: selectedMalzemeIds.map((id) => {
          const malzeme = externalMalzemeler.find((m) => m.TB_STOK_ID === id);
          return { StokId: malzeme.TB_STOK_ID, BirimKodId: malzeme.STK_BIRIM_KOD_ID };
        }),
      };

      const response = await AxiosInstance.post("TeklifPaketiMalzemeEkle", payload);

      if (response && !response.has_error && response.status_code === 200) {
        const addedMalzemeler = externalMalzemeler
          .filter((m) => selectedMalzemeIds.includes(m.TB_STOK_ID))
          .map((m) => ({ malzemeId: m.TB_STOK_ID, malzeme: m.STK_TANIM }));

        const newData = [
          ...dataSource,
          ...addedMalzemeler.filter((m) => !dataSource.some((p) => p.malzemeId === m.malzemeId)),
        ];

        setDataSource(newData);
        setFilteredCurrent(newData);
        setSelectedMalzemeIds([]);
        message.success("Malzemeler başarıyla eklendi!");
      } else {
        message.error("Malzemeler eklenirken hata oluştu!");
      }
    } catch (err) {
      console.error(err);
      message.error("Sunucuya bağlanırken bir hata oluştu!");
    }
  };

  const columnsCurrent = [
    { title: "Malzeme", dataIndex: "malzeme", key: "malzeme" },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title={`"${record.malzeme}" malzemesini silmek istiyor musunuz?`}
          onConfirm={() => handleDelete(record.malzemeId)}
          okText="Evet"
          cancelText="Hayır"
        >
          <Button type="link" danger loading={deletingId === record.malzemeId}>
            Sil
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const columnsExternal = [
    { title: "Malzeme Kod", dataIndex: "STK_KOD", key: "STK_KOD", render: (text) => <Tooltip title={text}>{text}</Tooltip> },
    { title: "Malzeme Tanımı", dataIndex: "STK_TANIM", key: "STK_TANIM", render: (text) => <Tooltip title={text}>{text}</Tooltip> },
  ];

  return (
    <Modal
      open={visible}
      title={<span style={{ fontWeight: 650, fontSize: 20 }}>Malzeme Ekle / Sil</span>}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Button key="cancel" onClick={onCancel}>İptal</Button>,
        <Button key="add" type="primary" onClick={handleAddSelected} disabled={selectedMalzemeIds.length === 0}>
          Seçilenleri Ekle
        </Button>,
      ]}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Text strong style={{ fontSize: 16 }}>Harici Malzemeler</Text>
          <Input
            placeholder="Malzeme ara..."
            allowClear
            style={{ marginBottom: 10, marginTop: 5 }}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              setFilteredExternal(
                externalMalzemeler.filter((m) => m.STK_TANIM.toLowerCase().includes(value))
              );
            }}
          />
          <Table
  columns={columnsExternal}
  dataSource={filteredExternal}
  rowKey={(record) => record.TB_STOK_ID}
  rowSelection={{
    type: "checkbox",
    selectedRowKeys: selectedMalzemeIds,
    onChange: (keys) => setSelectedMalzemeIds(keys),
  }}
  loading={loadingExternal}
  pagination={{
    current: currentPage,
    pageSize: 10,
    total: totalExternalCount,
    onChange: (page) => setCurrentPage(page),
  }}
/>
        </Col>

        <Col span={12}>
          <Text strong style={{ fontSize: 16 }}>Mevcut Malzemeler</Text>
          <Input
            placeholder="Mevcut malzeme ara..."
            allowClear
            style={{ marginBottom: 10, marginTop: 5 }}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              setFilteredCurrent(
                dataSource.filter((m) => m.malzeme.toLowerCase().includes(value))
              );
            }}
          />
          <Table
            columns={columnsCurrent}
            dataSource={filteredCurrent}
            rowKey="malzemeId"
            pagination={false}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default MalzemeEkleCikar;