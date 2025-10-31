import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Spin,
  message,
  Divider,
  Typography,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import AxiosInstance from "../../../api/http";
import TalepDurumDagilimi from "./Components/TalepDurumDagilimi";
const { Title } = Typography;

/**
 * Yardımcı: "0,00" gibi Türkçe formatlı stringleri number'a çevirir
 */
const parseTurkishNumber = (str) => {
  if (str === null || str === undefined) return 0;
  if (typeof str === "number") return str;
  // örnek: "1.234,56" => "1234.56"
  const cleaned = String(str).replace(/\./g, "").replace(/,/g, ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF", "#FF6B8A"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // üst kartlar
  const [bekleyenMalzemeTalepleri, setBekleyenMalzemeTalepleri] = useState(0);
  const [bekleyenFiyatTeklifleri, setBekleyenFiyatTeklifleri] = useState(0);
  const [acikSiparisler, setAcikSiparisler] = useState(0);
  const [toplamSiparisTutar, setToplamSiparisTutar] = useState("0,00");

  // tablolar
  const [ozetRapor, setOzetRapor] = useState([]);
  const [teslimAlinmamisSiparisler, setTeslimAlinmamisSiparisler] = useState(
    []
  );
  const [malzemeKullanimlari, setMalzemeKullanimlari] = useState([]);

  // grafik verileri
  const [yillikHarcama, setYillikHarcama] = useState([]);
  const [malzemeSiparis, setMalzemeSiparis] = useState([]);
  const [talepDurumlari, setTalepDurumlari] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const calls = [
          AxiosInstance.get("/getBekleyenMalzemeTalepleri"),
          AxiosInstance.get("/getBekleyenFiyatTeklifleri"),
          AxiosInstance.get("/getAcikSiparisler"),
          AxiosInstance.get("/getToplamSiparisTutar"),
          AxiosInstance.get("/getOzetRapor"),
          AxiosInstance.get("/getTeslimAlinmamisSiparisler"),
          AxiosInstance.get("/getMalzemeKullanimlari"),
          AxiosInstance.get("/getYillikHarcama"),
          AxiosInstance.get("/getMalzemeSiparis"),
          AxiosInstance.get("/getMalzemeTalepleriDurumlari"),
        ];

        const [
          resBekMal,
          resBekFiyat,
          resAcikSip,
          resToplamTutar,
          resOzet,
          resTeslimAlinmamis,
          resMalzemeKull,
          resYillik,
          resMalzemeSip,
          resTalepDurum,
        ] = await Promise.all(calls);

        // üst kartlar
        setBekleyenMalzemeTalepleri(
          Number(resBekMal?.ADET ?? 0)
        );
        setBekleyenFiyatTeklifleri(Number(resBekFiyat?.ADET ?? 0));
        setAcikSiparisler(Number(resAcikSip?.ADET ?? 0));
        setToplamSiparisTutar(String(resToplamTutar?.TOPLAM_TUTAR ?? "0,00"));

        // tablolar
        setOzetRapor(Array.isArray(resOzet?.data) ? resOzet.data : []);
        setTeslimAlinmamisSiparisler(Array.isArray(resTeslimAlinmamis?.data) ? resTeslimAlinmamis.data : [] );
        setMalzemeKullanimlari( Array.isArray(resMalzemeKull?.data) ? resMalzemeKull.data : [] );

        // grafik verileri
        setYillikHarcama(Array.isArray(resYillik?.data) ? resYillik.data.map((r) => ({...r, ToplamTutarNumber: parseTurkishNumber(r.ToplamTutar), })) : [] );

        setMalzemeSiparis(Array.isArray(resMalzemeSip?.data) ? resMalzemeSip.data.map((r) => ({...r, ToplamTutarNumber: parseTurkishNumber(r.ToplamTutar), })) : [] );

        setTalepDurumlari(Array.isArray(resTalepDurum?.data) ? resTalepDurum.data : [] );
      } catch (err) {
        console.error(err);
        message.error("Dashboard verileri çekilirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Tablo sütun tanımları
  const ozetColumns = [
    {
      title: "Rapor Adı",
      dataIndex: "RaporAdi",
      key: "RaporAdi",
      ellipsis: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Değer",
      dataIndex: "RaporDegeri",
      key: "RaporDegeri",
      render: (val) => <strong>{val === null ? "-" : val}</strong>,
    },
  ];

  const teslimColumns = [
    // Burada API'nin döndüğü alana göre özelleştir
    { title: "Sipariş No", dataIndex: "Sipariş No", key: "Sipariş No" },
    { title: "Tedarikçi", dataIndex: "Tedarikçi", key: "Tedarikçi" },
    { title: "Tutar", dataIndex: "Sipariş Tutarı", key: "Sipariş Tutarı" },
    { title: "Durum", dataIndex: "Sipariş Durumu", key: "Sipariş Durumu" },
  ];

  const malzemeKullColumns = [
    { title: "Malzeme Tipi", dataIndex: "MALZEME_TIP_ADI", key: "MALZEME_TIP_ADI" },
    { title: "2025", dataIndex: "2025", key: "y2025", render: (v) => (v === null ? "-" : v) },
    { title: "2024", dataIndex: "2024", key: "y2024", render: (v) => (v === null ? "-" : v) },
    { title: "2023", dataIndex: "2023", key: "y2023", render: (v) => (v === null ? "-" : v) },
    { title: "2022", dataIndex: "2022", key: "y2022", render: (v) => (v === null ? "-" : v) },
    { title: "2021", dataIndex: "2021", key: "y2021", render: (v) => (v === null ? "-" : v) },
  ];

  const malzemeSiparisColumns = [
    { title: "Malzeme Tip Adı", dataIndex: "MalzemeTipAdi", key: "MalzemeTipAdi" },
    { title: "Sipariş Adedi", dataIndex: "SiparisAdedi", key: "SiparisAdedi" },
    {
      title: "Toplam Tutar",
      dataIndex: "ToplamTutarNumber",
      key: "ToplamTutarNumber",
      render: (v) => v ? v.toLocaleString() : "-",
    },
  ];

  return (
    <Spin spinning={loading} tip="Yükleniyor...">
      <div
  style={{
    display: "flex",
    flexDirection: "column",
    padding: 16,
    height: "80vh",          // ekran yüksekliğine tam otur
    boxSizing: "border-box",
  }}
>
  <Title level={4}>Satınalma Yönetici Paneli</Title>

  {/* Üst kartlar */}
  <Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={6}>
      <Card>
        <Statistic title="Bekleyen Malzeme Talepleri" value={bekleyenMalzemeTalepleri} />
      </Card>
    </Col>
    <Col xs={24} sm={12} md={6}>
      <Card>
        <Statistic title="Bekleyen Fiyat Teklifleri" value={bekleyenFiyatTeklifleri} />
      </Card>
    </Col>
    <Col xs={24} sm={12} md={6}>
      <Card>
        <Statistic title="Açık Siparişler" value={acikSiparisler} />
      </Card>
    </Col>
    <Col xs={24} sm={12} md={6}>
      <Card>
        <Statistic title="Toplam Sipariş Tutarı" value={toplamSiparisTutar ?? "0,00"} />
      </Card>
    </Col>
  </Row>

  <Divider />

  {/* İçeriği dikey scrollable yapmak için flex:1 */}
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",  // sadece dikey kaydırma
      overflowX: "hidden",
      gap: 16,
    }}
  >
    {/* 1. alt bölüm */}
    <Row gutter={[16, 16]} align="stretch">
      {/* Sol sütun */}
      <Col xs={24} lg={12} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Satınalma Genel Özet" style={{ flex: 1, minHeight: 320 }}>
          <Table
            dataSource={ozetRapor}
            columns={ozetColumns}
            rowKey="RaporAdi"
            pagination={{ pageSize: 5 }}
            size="small"
          />
        </Card>

        <Card title="Malzeme Talepleri Durum Dağılımı" style={{ flex: 1, minHeight: 320 }}>
          <TalepDurumDagilimi talepDurumlari={talepDurumlari} />
        </Card>
      </Col>

      {/* Sağ sütun */}
      <Col xs={24} lg={12} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Aylık Satınalma Trendi (2025)" style={{ flex: 1, minHeight: 320 }}>
  <div style={{ width: "100%", height: 300 }}> {/* burayı sabit 300px yap */}
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={yillikHarcama}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="AyAdi" />
        <YAxis />
        <ReTooltip />
        <Bar dataKey="ToplamTutarNumber" name="Toplam Tutar" fill="#1890ff" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</Card>

        <Card title="En Çok Talep Edilen Malzeme Grupları (2025)" style={{ flex: 1, minHeight: 320 }}>
  <div style={{ width: "100%", height: 300 }}> {/* sabit height */}
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={malzemeSiparis}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="MalzemeTipAdi" />
        <YAxis />
        <ReTooltip />
        <Bar dataKey="ToplamTutarNumber" name="Toplam Tutar" fill="#1890ff" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</Card>
      </Col>
    </Row>

    {/* 2. alt bölüm */}
    <Row gutter={[16, 16]} align="stretch">
      <Col xs={24} lg={12}>
        <Card title="Malzeme Kullanımları" style={{ height: "380px" }}>
          <Table
            dataSource={malzemeKullanimlari}
            columns={malzemeKullColumns}
            rowKey={(r, i) => r.MALZEME_TIP_ADI + i}
            pagination={{ pageSize: 5 }}
            size="small"
          />
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card title="Teslim Alınmamış Siparişler" style={{ height: "380px" }}>
          <Table
            dataSource={teslimAlinmamisSiparisler}
            columns={teslimColumns}
            rowKey={(r, i) => r.SiparisNo ?? i}
            pagination={false}
            locale={{ emptyText: "Kayıt bulunamadı" }}
            size="small"
          />
        </Card>
      </Col>
    </Row>
  </div>
</div>
    </Spin>
  );
}