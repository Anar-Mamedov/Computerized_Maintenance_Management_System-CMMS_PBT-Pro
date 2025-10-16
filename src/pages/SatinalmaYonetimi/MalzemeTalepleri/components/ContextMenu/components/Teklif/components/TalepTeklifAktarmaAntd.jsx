import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, Table, Card, Tag, Divider, message, Tooltip, Space, DatePicker, Popconfirm, Typography } from "antd";
import { SendOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";

const { Search } = Input;
const { Text } = Typography;

export default function TalepTeklifeAktarmaAntd({ fisId, baslik, fisNo }) {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // seçilen malzeme satırları
  const [selectedSuppliersData, setSelectedSuppliersData] = useState([]); // seçilen tedarikçi satırları
  const [teklifPaketleri, setTeklifPaketleri] = useState([]);
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const [selectedSupplierKeys, setSelectedSupplierKeys] = useState([]);
  const [teklifNo, setTeklifNo] = useState(null);
  const [duzenlemeTarihi, setDuzenlemeTarihi] = useState(dayjs()); // Bugünün tarihi
  const [konu, setKonu] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  // --- Malzemeleri getir
  const fetchMalzemeler = async () => {
    if (!fisId) return;
    setLoading(true);

    try {
      const result = await AxiosInstance.get(`GetTalepMaterialMovements?fisId=${fisId}`);
      const materials = Array.isArray(result.materialMovements) ? result.materialMovements : [];
      setData(materials);
    } catch (err) {
      console.error("API Hatası:", err);
      message.error("Malzemeler yüklenirken hata oluştu");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Tedarikçi listesi
  useEffect(() => {
  if (!currentPage) setCurrentPage(1);

  AxiosInstance.get(`GetFirmaList?pagingDeger=${currentPage}&search=${searchValue}`)
    .then((res) => {
      // res.Firma_Liste array mi kontrol et
      const list = Array.isArray(res.Firma_Liste) ? res.Firma_Liste : [];
      setSuppliers(list);
    })
    .catch(() => {
      message.error("Tedarikçiler yüklenirken hata oluştu");
      setSuppliers([]);
    });
}, [currentPage, searchValue]);

  // --- Tablo kolonları
  const itemColumns = [
  {
    title: "Malzeme Kodu",
    dataIndex: "stokKod",
    key: "stokKod",
    ellipsis: true,
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
  {
    title: "Malzeme Tanımı",
    dataIndex: "stokAdi",
    key: "stokAdi",
    ellipsis: true,
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
  {
    title: "Miktar",
    dataIndex: "miktar",
    key: "miktar",
    width: 90,
  },
  {
    title: "Birim",
    dataIndex: "birim",
    key: "birim",
    width: 110,
  },
  {
    title: "Tip",
    dataIndex: "tip",
    key: "tip",
    render: (t) => (t ? <Tag>{t}</Tag> : "-"),
  },
];

const supplierColumns = [
  {
    title: "Firma",
    dataIndex: "CAR_TANIM",
    key: "CAR_TANIM",
    ellipsis: true,
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
  {
    title: "Tip",
    dataIndex: "CAR_TIP",
    key: "CAR_TIP",
    ellipsis: true,
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
];

// İlk açılışta yükle
useEffect(() => {
  fetchMalzemeler();
  fetchTeklifPaketleri();
  fetchTeklifNo();
}, [fisId]);

  // --- Malzeme seçimleri
const itemRowSelection = {
  selectedRowKeys: selectedItemKeys,
  onChange: (keys, rows) => {
    setSelectedItemKeys(keys);
    setSelectedItems(rows); // full satırları yakala
  },
};

  // --- Tedarikçi seçimleri
const supplierRowSelection = {
  selectedRowKeys: selectedSupplierKeys,
  onChange: (keys, rows) => {
    setSelectedSupplierKeys(keys);
    setSelectedSuppliersData(rows); // full satırları yakala
  },
};

// Teklif Numarası getiren fonksiyon
const fetchTeklifNo = async () => {
  try {
    const res = await AxiosInstance.get("ModulKoduGetir?modulKodu=SAT_TEKLIF_NO");

    if (res && typeof res === "string" && res.trim() !== "") {
      setTeklifNo(res.trim());
    } else if (res && typeof res === "object" && res.data && res.data.trim() !== "") {
      setTeklifNo(res.data.trim());
    } else {
      message.warning("Teklif numarası alınamadı");
    }
  } catch (err) {
    console.error("Teklif numarası alınırken hata:", err);
    message.error("Teklif numarası alınırken hata oluştu");
  }
};

// --- Teklif Oluştur
const handleCreateTeklif = async () => {
  if (!selectedSuppliersData.length) {
    return message.warning("Lütfen en az bir tedarikçi seçin.");
  }
  if (!selectedItems.length) {
    return message.warning("Lütfen en az bir malzeme seçin.");
  }
  if (!teklifNo) {
    return message.warning("Teklif numarası henüz alınamadı, lütfen bekleyin.");
  }

  const payload = {
    TeklifNo: teklifNo,
    TalepId: fisId,
    TalepKodu: fisNo,
    Baslik: konu, // 👈 Artık buradan geliyor
    SurecKodId: null,
    FirmaIdList: selectedSuppliersData.map((s) => s.TB_CARI_ID),
    Malzemeler: selectedItems.map((m) => ({
      StokId: m.stokId,
      Miktar: m.miktar,
      BirimKodId: m.birimKodId ?? 16,
      AnaBirimMiktar: m.anaBirimMiktar ?? m.miktar,
      TalepDetayId: m.talepDetayId,
      SinifId: m.sinifId ?? null,
      AlternatifStokId: -1,
    })),
  };

  try {
    await AxiosInstance.post("CreateTeklifPaketi", payload);
    message.success("Teklif başarıyla oluşturuldu");
    fetchMalzemeler();
    fetchTeklifPaketleri();
    setSelectedSupplierKeys([]);
    setSelectedSuppliersData([]);
    fetchTeklifNo();
  } catch (err) {
    console.error("Teklif oluşturulurken hata:", err);
    message.error("Teklif oluşturulurken bir hata oluştu");
  }
};

// --- Teklif Paketlerini getir
const fetchTeklifPaketleri = async () => {
  if (!fisId) return;

  try {
    const res = await AxiosInstance.get(`ListTeklifPaketleriByTalep?talepId=${fisId}`);
    if (res?.items) {
      setTeklifPaketleri(res.items);
    } else {
      setTeklifPaketleri([]);
    }
  } catch (err) {
    console.error("Teklif paketleri alınırken hata:", err);
    message.error("Teklif paketleri alınırken hata oluştu");
  }
};

const handleCompareTeklifler = () => {
  message.info("Malzeme listesi boş → Teklifleri karşılaştır işlemi tetiklendi.");
};

// --- Teklif Paketini Sil
const handleDelete = async (teklifId) => {
  let isError = false;

  try {
    const response = await AxiosInstance.post(`DeleteTeklifPaketi?TeklifId=${teklifId}`);

    if (response.status_code === 200 || response.status_code === 201) {
      message.success("Teklif paketi ve tüm ilişkili kayıtlar başarıyla silindi.");
    } else if (response.status_code === 401) {
      message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
    } else {
      message.error("Silme işlemi başarısız.");
    }
    fetchTeklifPaketleri();
  } catch (error) {
    isError = true;
    console.error("Silme işlemi sırasında hata oluştu:", error);
    message.error("Sunucu hatası.");
  }
};

// --- fisNo değiştiğinde konu'yu otomatik ayarla
useEffect(() => {
  if (fisNo) {
    setKonu(`${fisNo} Talebin Fiyat Teklifi`);
  }
}, [fisNo]);

// Paket Başlık Değiştirme Fonksiyonları Başlangıç
const handleEditClick = (id) => {
  setTeklifPaketleri((prev) =>
    prev.map((t) =>
      t.teklifId === id ? { ...t, editing: true } : t
    )
  );
};

const handleTitleChange = (id, value) => {
  setTeklifPaketleri((prev) =>
    prev.map((t) =>
      t.teklifId === id ? { ...t, baslik: value } : t
    )
  );
};

const handleFinishEditing = async (id) => {
  const paket = teklifPaketleri.find((t) => t.teklifId === id);
  if (!paket) return;

  setTeklifPaketleri((prev) =>
    prev.map((t) =>
      t.teklifId === id ? { ...t, editing: false } : t
    )
  );

  try {
    await AxiosInstance.post("/UpdateTeklifPaketiBaslik", {
      TeklifId: id,
      Baslik: paket.baslik,
    });
    console.log("Başlık güncellendi:", paket.baslik);
  } catch (error) {
    console.error("Başlık güncelleme hatası:", error);
  }
};
// Paket Başlık Değiştirme Fonksiyonları Bitiş

  return (
    <div style={{ padding: 20, background: "#f5f7fa", height: "77vh", width: "70vw", overflowY: "auto" }}>
      <Card>
        <Row justify="space-between" align="middle">
          <Col flex="auto">
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ marginBottom: 4, color: "#000000", fontSize: 15, fontWeight: 500 }}>
                  Düzenleme Tarihi
                </div>
                <DatePicker
                  style={{ width: "100%" }}
                  value={duzenlemeTarihi}
                  onChange={(date) => setDuzenlemeTarihi(date)}
                  format="DD.MM.YYYY"
                  placeholder="Düzenleme Tarihi"
                />
              </Col>
              <Col span={6}>
  <div
    style={{
      marginBottom: 4,
      color: "#000000",
      fontSize: 15,
      fontWeight: 500,
    }}
  >
    Konu
  </div>
  <Input
    value={konu}
    onChange={(e) => setKonu(e.target.value)}
    placeholder="Konu"
  />
</Col>
            </Row>
          </Col>
          {/* <Col>
    <Button type="primary" icon={<SendOutlined />} disabled={loading}>
      Teklif İste
    </Button>
  </Col> */}
        </Row>
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card style={{ height: 425, display: "flex", flexDirection: "column" }}>
            <Search
              placeholder="Malzeme ara..."
              allowClear
              onSearch={(v) => setSearchValue(v)}
              style={{ marginBottom: 12 }}
            />
              <Divider />
            <Table
              size="small"
              columns={itemColumns}
              dataSource={data}
              rowSelection={itemRowSelection}
              rowKey={(record) =>
                record.stokId !== -1
                ? record.stokId
                : `tmp-${record.stokKod ?? Math.random()}`
              }
              loading={loading}
              pagination={{ pageSize: 5 }}
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card style={{ height: 425, display: "flex", flexDirection: "column" }}>
            <Search
              placeholder="Tedarikçi ara..."
              allowClear
              onSearch={(v) => setSearchValue(v)}
              style={{ marginBottom: 12 }}
            />
              <Divider />
            <Table
              size="small"
              columns={supplierColumns}
              dataSource={suppliers}
              rowSelection={supplierRowSelection}
              rowKey={(record) => record.TB_CARI_ID ?? Math.random()}
              pagination={{ pageSize: 5 }}
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
  <Row justify="space-between" align="middle">
    <Col></Col>
    <Col>
      <Button
        type="primary"
        icon={<SendOutlined />}
        loading={loading}
        onClick={data.length > 0 ? handleCreateTeklif : handleCompareTeklifler} // Buton davranışı değişiyor
      >
        {data.length > 0 ? "Teklif Oluştur" : "Teklifleri Karşılaştır"}
      </Button>
    </Col>
  </Row>
</Card>

    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      {teklifPaketleri.map((t) => (
  <Col xs={24} sm={12} md={8} key={t.teklifId}>
    <Card
      size="small"
      title={
        <Text strong style={{ fontSize: 16 }}>
          {t.editing ? ( // Eğer düzenleme modundaysa input göster
            <Input
              value={t.baslik}
              onChange={(e) => handleTitleChange(t.teklifId, e.target.value)}
              onPressEnter={() => handleFinishEditing(t.teklifId)}
              onBlur={() => handleFinishEditing(t.teklifId)}
              autoFocus
            />
          ) : (
            `RFQ — ${t.baslik}`
          )}
        </Text>
      }
      extra={
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(t.teklifId)}
          />
          <Popconfirm
            title="Bu teklifi silmek istediğine emin misin?"
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => handleDelete(t.teklifId)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      }
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        height: "100%",
      }}
    >
      <div style={{ marginBottom: 6 }}>
        <Text>
          <b>Kalem:</b> {t.kalemSayisi} • <b>Tedarikçi:</b> {t.tedarikcSayisi}
        </Text>
      </div>

      <div style={{ marginBottom: 6 }}>
        <Text>
          <b>Tedarikçiler:</b> {t.tedarikciler?.trim() || "-"}
        </Text>
      </div>

      <div style={{ marginBottom: 6 }}>
        <Text>
          <b>Oluşturma Tarihi:</b>{" "}
          {dayjs(t.olusturmaTarih).format("DD.MM.YYYY HH:mm")}
        </Text>
      </div>
    </Card>
  </Col>
))}
    </Row>
    </div>
  );
}