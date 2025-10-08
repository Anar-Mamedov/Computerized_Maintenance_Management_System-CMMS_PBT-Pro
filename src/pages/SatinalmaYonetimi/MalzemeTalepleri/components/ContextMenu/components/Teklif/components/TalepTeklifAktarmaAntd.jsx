import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, Table, Card, Tag, Divider, message, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../api/http";

const { Search } = Input;

export default function TalepTeklifeAktarmaAntd({ fisId, baslik, fisNo }) {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // seçilen malzeme satırları
  const [selectedSuppliersData, setSelectedSuppliersData] = useState([]); // seçilen tedarikçi satırları
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const [selectedSupplierKeys, setSelectedSupplierKeys] = useState([]);
  const [teklifNo, setTeklifNo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  // --- Malzemeleri getir
  useEffect(() => {
    if (!fisId) return;
    setLoading(true);

    AxiosInstance.get(`GetTalepMaterialMovements?fisId=${fisId}`)
      .then((result) => {
        const materials = Array.isArray(result.materialMovements) ? result.materialMovements : [];
        setData(materials);
      })
      .catch((err) => {
        console.error("API Hatası:", err);
        message.error("Malzemeler yüklenirken hata oluştu");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [fisId]);

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

useEffect(() => {
  const fetchTeklifNo = async () => {
    try {
      const res = await AxiosInstance.get("ModulKoduGetir?modulKodu=SAT_TEKLIF_NO");

      // Eğer res doğrudan string olarak geliyorsa
      if (res && typeof res === "string" && res.trim() !== "") {
        setTeklifNo(res.trim());
      }
      // Eğer res bir obje içinde geliyorsa
      else if (res && typeof res === "object" && res.data && res.data.trim() !== "") {
        setTeklifNo(res.data.trim());
      }
      else {
        message.warning("Teklif numarası alınamadı");
      }
    } catch (err) {
      console.error("Teklif numarası alınırken hata:", err);
      message.error("Teklif numarası alınırken hata oluştu");
    }
  };
  fetchTeklifNo();
}, []);

// Teklif Oluştur
const handleCreateTeklif = async () => {
  if (!selectedSuppliersData.length) {
    return message.warning("Lütfen en az bir tedarikçi seçin.");
  }
  if (!selectedItems.length) {
    return message.warning("Lütfen en az bir malzeme seçin.");
  }

  // Teklif numarası API cevabından state'e atandı mı kontrol et
  if (!teklifNo) {
    return message.warning("Teklif numarası henüz alınamadı, lütfen bekleyin.");
  }

  // Teklif numarasını payload içinde kullanıyoruz
  const payload = {
    TeklifNo: teklifNo, // API cevabı burada
    TalepId: fisId,
    TalepKodu: fisNo,
    Baslik: baslik,
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
  } catch (err) {
    console.error("Teklif oluşturulurken hata:", err);
    message.error("Teklif oluşturulurken bir hata oluştu");
  }
};



  return (
    <div style={{ padding: 20, background: "#f5f7fa", height: "72vh", width: "70vw", overflowY: "auto" }}>
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <h2 style={{ margin: 0 }}>Talep → Teklife Aktarma</h2>
          </Col>
          <Col>
            <Button type="primary" icon={<SendOutlined />} disabled={loading}>
              Teklif İste
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card style={{ height: 425, display: "flex", flexDirection: "column" }}>
            <Search
              placeholder="Kalem ara..."
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
          <Col>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={loading}
              onClick={handleCreateTeklif}
            >
              Teklif Oluştur
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}