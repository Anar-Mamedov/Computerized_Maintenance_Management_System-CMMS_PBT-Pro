import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Input, message, Tooltip, Row, Col, Typography, Popconfirm } from "antd";
import AxiosInstance from "../../../../../../../../api/http";

const { Text } = Typography;

const FirmaEkleCikar = ({ visible, onCancel, onOk, firmalar = [], teklifId }) => {
  const [dataSource, setDataSource] = useState([]); // Sağ taraf (Mevcut ekli olanlar)
  const [externalFirmalar, setExternalFirmalar] = useState([]); // Sol taraf (API'den gelenler)
  
  // Arama ve Pagination State'leri
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0); // Toplam kayıt sayısı
  
  const [selectedFirmaIds, setSelectedFirmaIds] = useState([]);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Modal açıldığında mevcut firmaları yükle
  useEffect(() => {
    setDataSource(firmalar);
  }, [firmalar]);

  // --- API'den Tedarikçileri Çek (Server-side Pagination & Search) ---
  useEffect(() => {
    const fetchExternalFirmalar = async () => {
      setLoadingExternal(true);
      try {
        // Önceki örnekteki API formatına uygun istek
        const res = await AxiosInstance.get(
          `GetTedarikciList?aktif=1&searchText=${searchValue}&pagingDeger=${currentPage}&pageSize=10`
        );

        // Data kontrolü
        const list = Array.isArray(res?.data) ? res.data : [];
        setExternalFirmalar(list);

        // Pagination bilgisinden toplam kayıt sayısını al
        if (res.pagination && res.pagination.total_records) {
          setTotalRecords(res.pagination.total_records);
        } else {
          setTotalRecords(0);
        }

      } catch (err) {
        console.error(err);
        message.error("Tedarikçiler yüklenirken hata oluştu");
        setExternalFirmalar([]);
        setTotalRecords(0);
      } finally {
        setLoadingExternal(false);
      }
    };

    fetchExternalFirmalar();
  }, [currentPage, searchValue]);

  // --- Firma Silme İşlemi ---
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

  // --- Seçilenleri Ekleme İşlemi ---
  const handleAddSelected = async () => {
    if (!teklifId || selectedFirmaIds.length === 0) return;
    try {
      const payload = { TeklifId: teklifId, FirmaIdList: selectedFirmaIds };
      const response = await AxiosInstance.post("TeklifPaketiFirmaEkle", payload);
      
      if (response && !response.has_error && response.status_code === 200) {
        // API’den eklenen firmaları bul
        const addedFirmalar = externalFirmalar
          .filter(f => selectedFirmaIds.includes(f.TB_CARI_ID))
          .map(f => ({
            firmaId: f.TB_CARI_ID,      
            firmaTanim: f.CAR_TANIM,    
            firmaTip: f.CAR_TIP        
          }));
        
        // Mevcut tabloya ekle (zaten varsa ekleme)
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

  // --- Mevcut Firmalar Tablosu Kolonları ---
  const columnsCurrent = [
    { title: "Firma Adı", dataIndex: "firmaTanim", key: "firmaTanim" },
    {
      title: "İşlem",
      key: "action",
      width: 80,
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

  // --- API'den Gelen Firmalar Tablosu Kolonları ---
  const columnsExternal = [
    {
      title: "Firma",
      dataIndex: "CAR_TANIM",
      key: "CAR_TANIM",
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
            key="submit"
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
        {/* --- SOL TARA: Tedarikçi Listesi (API) --- */}
        <Col span={12}>
          <Text strong style={{ fontSize: 16 }}>Tedarikçi Listesi</Text>

          <Input.Search
            placeholder="Tedarikçi ara..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1); // Arama değişince 1. sayfaya dön
            }}
            onSearch={(value) => {
                setSearchValue(value);
                setCurrentPage(1);
            }}
            allowClear
            style={{ marginBottom: 10, marginTop: 5 }}
          />

          <Table
            columns={columnsExternal}
            dataSource={externalFirmalar}
            rowKey={record => record.TB_CARI_ID}
            size="small"
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedFirmaIds,
              onChange: keys => setSelectedFirmaIds(keys),
            }}
            loading={loadingExternal}
            // --- Pagination Ayarları ---
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: totalRecords, // API'den gelen toplam sayı
              onChange: page => setCurrentPage(page),
              showSizeChanger: false
            }}
            scroll={{ y: 400 }}
          />
        </Col>

        {/* --- SAĞ TARAF: Mevcut Tedarikçiler (Local) --- */}
        <Col span={12}>
          <Text strong style={{ fontSize: 16 }}>Mevcut Tedarikçiler</Text>

          <Input.Search
            placeholder="Mevcut tedarikçi ara..."
            allowClear
            // Burası local filtreleme olduğu için filter kullanıyoruz
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
            size="small"
            pagination={false}
            scroll={{ y: 400 }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default FirmaEkleCikar;