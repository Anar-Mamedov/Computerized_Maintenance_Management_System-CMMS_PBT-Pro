import React, { useState, useEffect } from "react";
import { Table, InputNumber, Select, Typography, Card, Button, Space, Radio, Tabs, Spin, message } from "antd";
import { FileExcelOutlined, PrinterOutlined, PlusOutlined, CheckCircleOutlined, SaveOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../api/http";
import TedarikciEkle from "./FirmaEkleCikar";
import MalzemeEkle from "./MalzemeEkleCikar";

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const TeklifKarsilastirma = ({ teklifIds = [], disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const [paketler, setPaketler] = useState([]);
  const [paketRenkleri, setPaketRenkleri] = useState({});
  const [selectedFirmaId, setSelectedFirmaId] = useState(null);
  const [kaydedildi, setKaydedildi] = useState(true);
  const [isTedarikciModalOpen, setTedarikciModalOpen] = useState(false);
  const [isMalzemeModalOpen, setMalzemeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const aktifPaketIndex = Number(activeTab) - 1;
  const aktifPaket = paketler[aktifPaketIndex] || {};
  const [detayGosterilenPaket, setDetayGosterilenPaket] = useState(null);

  // Paketler ilk yüklendiğinde renkleri ata
  useEffect(() => {
  if (paketler.length === 0) return;

  if (Object.keys(paketRenkleri).length > 0) return;

  const renkler = {};
  paketler.forEach((paket, paketIndex) => {
    renkler[paketIndex] = {};
    (paket.firmaTotaller || []).forEach(firma => {
      // Bir tık daha koyu pastel
      const r = Math.floor(Math.random() * 15 + 230); // 230-245
      const g = Math.floor(Math.random() * 15 + 230);
      const b = Math.floor(Math.random() * 15 + 230);
      renkler[paketIndex][firma.firmaId] = `rgb(${r}, ${g}, ${b})`;
    });
  });
  setPaketRenkleri(renkler);
}, [paketler]);

// Teklifler için API isteği
  useEffect(() => {
    if (teklifIds.length > 0) {
      fetchAllTeklifler(teklifIds);
    }
  }, [teklifIds]);

  const fetchAllTeklifler = async (ids) => {
  try {
    setLoading(true);
    if (!Array.isArray(ids)) ids = [ids];
      const results = await Promise.all(
        ids.map(async (id) => {
          const res = await AxiosInstance.get(`/GetTeklifKarsilastirmaDetay?TeklifId=${id}`);
          // ensure shapes: miktar,fiyat,tutar numeric
          const data = res.data || {};
          if (data.malzemeler) {
            data.malzemeler = data.malzemeler.map((m) => ({
              ...m,
              firmalar: (m.firmalar || []).map((f) => ({
                ...f,
                miktar: Number(f.miktar ?? 0),
                fiyat: Number(f.fiyat ?? 0),
                tutar: Number(f.tutar ?? (Number(f.miktar ?? 0) * Number(f.fiyat ?? 0))),
              })),
            }));
          }
          return { id, ...(data || {}) };
        })
      );
      setPaketler(results);
    } catch (err) {
      console.error("Teklif detay hatası:", err);
      message.error("Teklif detayları alınırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // sayfadan çıkarken kaydedilmemiş değişiklik uyarısı
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!kaydedildi) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [kaydedildi]);

  // firma toplamlarını güncelleme
const computeFirmaTotals = (malzemeler = [], firmaTotaller = []) => {
  return (firmaTotaller || []).map((firma) => {
    // Ara Toplam = tüm malzemelerin tutarları
    const araToplam = (malzemeler || []).reduce((acc, m) => {
      const f = (m.firmalar || []).find((x) => x.firmaId === firma.firmaId);
      return acc + (Number(f?.tutar ?? 0));
    }, 0);

    const indirimOrani = Number(firma.indirimOrani ?? 0); // % indirim, API'den gelmezse 0
    const indirimTutar = araToplam * indirimOrani;

    const kdvOrani = Number(firma.kdvOrani ?? 0); // %20 örnek, API'den gelmezse default
    const kdvTutar = (araToplam - indirimTutar) * kdvOrani;

    const genelToplam = araToplam - indirimTutar + kdvTutar;

    return {
      ...firma,
      araToplam,
      indirimTutar,
      kdvTutar,
      genelToplam,
    };
  });
};

// InputNumber değiştiğinde çağrılır
const handleValueChange = (paketIndex, malzemeId, firmaId, field, value) => {
  const val = value == null ? 0 : Number(value);

  setPaketler((prev) => {
    const updated = prev.map((p, idx) => {
      if (idx !== paketIndex) return p;
      const paket = { ...p };
      paket.malzemeler = (p.malzemeler || []).map((m) => {
        if (m.malzemeId !== malzemeId) return { ...m, firmalar: (m.firmalar || []).map(x => ({ ...x })) };
        const newFirmalar = (m.firmalar || []).map((f) => {
          if (f.firmaId !== firmaId) return { ...f };
          const yeni = { ...f, [field]: val };
          yeni.tutar = Number(yeni.miktar ?? 0) * Number(yeni.fiyat ?? 0);
          return yeni;
        });
        return { ...m, firmalar: newFirmalar };
      });

      paket.firmaTotaller = computeFirmaTotals(paket.malzemeler, paket.firmaTotaller || []);
      return paket;
    });
    return updated;
  });
};

  const onOnayaGonder = () => {
    if (!selectedFirmaId) {
      alert("Lütfen bir firma seçin!");
      return;
    }
    const firmaAd = paketler[0]?.firmaTotaller?.find(f => f.firmaId === selectedFirmaId)?.firmaTanim || "";
    alert(`Onaya gönderilen firma: ${firmaAd}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const upsertTeklifKarsilastirma = async (paketIndex) => {
    if (!paketler[paketIndex]) return;

    const paket = paketler[paketIndex];

    const malzemelerPayload = (paket.malzemeler || []).map((m) => ({
      malzemeId: m.malzemeId,
      firmalar: (m.firmalar || []).map((f) => ({
        firmaId: f.firmaId,
        markaId: 0,
        miktar: Number(f.miktar ?? 0),
        fiyat: Number(f.fiyat ?? 0),
        tutar: Number(f.tutar ?? 0),
      })),
    }));

    const firmaDetaylarPayload = (paket.firmaTotaller || []).map((f) => ({
      firmaId: f.firmaId,
      teslimSuresi: 0,
      odemeSekliId: 0,
      sevkSekliId: 0,
      aciklama: "",
    }));

    const payload = {
      teklifId: paket.id || 0,
      malzemeler: malzemelerPayload,
      firmaDetaylar: firmaDetaylarPayload,
    };

    try {
      const res = await AxiosInstance.post("/UpsertTeklifKarsilastirma", payload);
      message.success("Teklif başarıyla kaydedildi!");
      console.log("API Response:", res.data);
      setKaydedildi(true);
    } catch (err) {
      console.error("UpsertTeklifKarsilastirma hatası:", err);
      message.error("Teklif kaydedilirken hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const malzemeListesi = paketler.length
  ? paketler.flatMap(p => p.malzemeler || []).map(m => ({
      id: m.malzemeId,
      tanim: m.malzeme,
    }))
  : [];

  return (
    <Card
      title="Satınalma Teklif Kıyaslama"
      extra={
        <Space>
          <Button icon={<FileExcelOutlined />}>Excel</Button>
          <Button icon={<PrinterOutlined />}>Yazdır/PDF</Button>
          <Button icon={<PlusOutlined />} onClick={() => setTedarikciModalOpen(true)} disabled={disabled} >
            Tedarikçi Ekle / Sil
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => setMalzemeModalOpen(true)} disabled={disabled} >
            Malzeme Ekle / Sil
          </Button>
          <Button
            icon={<SaveOutlined />}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", color: "#fff" }}
            onClick={() => upsertTeklifKarsilastirma(0)}
            disabled={disabled}
          >
            Teklifi Kaydet
          </Button>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={onOnayaGonder} disabled={disabled} >
            Onaya Gönder
          </Button>
        </Space>
      }
      bordered={false}
      style={{ width: "100%", overflowX: "auto" }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        defaultActiveKey="1"
      >
        {paketler.map((paket, paketIndex) => {
          const malzemeler = paket.malzemeler || [];
          const firmalar = paket.firmaTotaller || [];

          const firmaColumns = (firma, paketIndex) => {
          // Paket renkleri yalnızca ilk yüklemede atandı
          const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";

          return [
            {
              title: (
                <div style={{
                  backgroundColor: pastelColor,
                  padding: "8px 0",
                  borderRadius: 4,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column"
                }}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
                    <span>{firma.firmaTanim}</span>
                    <Radio checked={selectedFirmaId === firma.firmaId} onChange={() => setSelectedFirmaId(firma.firmaId)} style={{ marginLeft: 8 }} />
                  </div>
                </div>
              ),
              children: [
                {
                  title: "Marka",
                  dataIndex: `marka_${firma.firmaId}`,
                  width: 150,
                  align: "center",
                  onCell: () => ({ style: { backgroundColor: pastelColor } }),
                  render: (_, record) => (
                    <Select value={record?.firmalar?.find(f => f.firmaId === firma.firmaId)?.marka || undefined} style={{ width: "90%" }} disabled={disabled} >
                      <Option value="Bosch">Bosch</Option>
                      <Option value="Mann">Mann</Option>
                      <Option value="Castrol">Castrol</Option>
                    </Select>
                  ),
                },
                {
                  title: "Miktar",
                  dataIndex: `miktar_${firma.firmaId}`,
                  width: 100,
                  align: "center",
                  onCell: () => ({ style: { backgroundColor: pastelColor } }),
                  render: (_, record) => {
                    const f = record?.firmalar?.find(x => x.firmaId === firma.firmaId) || {};
                    return (
                      <InputNumber
                        min={0}
                        value={Number(f.miktar ?? 0)}
                        style={{ width: "90%" }}
                        onChange={(val) => handleValueChange(paketIndex, record.malzemeId, firma.firmaId, "miktar", val)}
                        disabled={disabled}
                      />
                    );
                  },
                },
                {
                  title: "Fiyat",
                  dataIndex: `fiyat_${firma.firmaId}`,
                  width: 125,
                  align: "center",
                  onCell: () => ({ style: { backgroundColor: pastelColor } }),
                  render: (_, record) => {
                    const f = record?.firmalar?.find(x => x.firmaId === firma.firmaId) || {};
                    return (
                      <InputNumber
                        min={0}
                        value={Number(f.fiyat ?? 0)}
                        style={{ width: "90%" }}
                        // onChange verirsek anında günceller; istersen onBlur ile de yapabilirsin
                        onChange={(val) => handleValueChange(paketIndex, record.malzemeId, firma.firmaId, "fiyat", val)}
                        disabled={disabled}
                      />
                    );
                  },
                },
                {
                  title: "Tutar",
                  dataIndex: `tutar_${firma.firmaId}`,
                  width: 125,
                  align: "center",
                  onCell: () => ({ style: { backgroundColor: pastelColor } }),
                  render: (_, record) => {
                    const f = record?.firmalar?.find(x => x.firmaId === firma.firmaId) || {};
                    return <Text strong style={{ display: "block", textAlign: "right" }}>{Number(f.tutar ?? (Number(f.miktar ?? 0) * Number(f.fiyat ?? 0))).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</Text>;
                  },
                },
              ],
            },
          ];
        };

        const columns = [
          {
            title: (
              <div style={{ backgroundColor: "#f0f0f0", padding: "8px 0", borderRadius: 4, fontWeight: "bold", textAlign: "center" }}>
                 Malzeme Kodu / Adı
              </div>
            ),
            key: "malzemeKodAd",
            fixed: "left",
            width: 250,
            render: (_, record) => <Text strong>{record.malzeme}</Text>,
          },
          ...firmalar.flatMap(firma => firmaColumns(firma, paketIndex)),
        ];

        const dataSource = malzemeler.map((m) => ({
          key: m.malzemeId,
          malzeme: m.malzeme,
          malzemeId: m.malzemeId,
          firmalar: m.firmalar,
        }));

        const kdvOrani = paket.kdvOrani ?? 0;

          return (
            <TabPane tab={paket.teklifBaslik?.baslik || `Teklif ${paketIndex + 1}`} key={`${paketIndex + 1}`}>
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered
                scroll={{ x: "max-content" }}
                summary={() => {
                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>ARA TOPLAM</Text></Table.Summary.Cell>
                          {firmalar.map(firma => (
                            <Table.Summary.Cell key={`toplam-${firma.firmaId}`} colSpan={4} align="right">
                              {(firma.araToplam ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                            </Table.Summary.Cell>
                          ))}
                      </Table.Summary.Row>

                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>İNDİRİM</Text></Table.Summary.Cell>
                          {firmalar.map(firma => (
                            <Table.Summary.Cell key={`indirim-${firma.firmaId}`} colSpan={4} align="right">
                              {(firma.indirimTutar ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                            </Table.Summary.Cell>
                          ))}
                      </Table.Summary.Row>

                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>KDV</Text></Table.Summary.Cell>
                          {firmalar.map(firma => (
                            <Table.Summary.Cell key={`kdv-${firma.firmaId}`} colSpan={4} align="right">
                              {(firma.kdvTutar ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                            </Table.Summary.Cell>
                          ))}
                      </Table.Summary.Row>

                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>GENEL TOPLAM</Text></Table.Summary.Cell>
                          {firmalar.map(firma => (
                            <Table.Summary.Cell key={`genel-${firma.firmaId}`} colSpan={4} align="right">
                              {(firma.genelToplam ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                            </Table.Summary.Cell>
                          ))}
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
              <div style={{ marginTop: 16, textAlign: "right" }}>
                <a
                  onClick={() =>
                    setDetayGosterilenPaket(detayGosterilenPaket === paketIndex ? null : paketIndex)
                  }
                >
                  {detayGosterilenPaket === paketIndex ? "Detayı Gizle" : "Detay Gör"}
                </a>
              </div>

              {detayGosterilenPaket === paketIndex && (
                <div style={{ marginTop: 16 }}>
                  <Table
                    dataSource={(paket.teklifDetaylar || []).map((d, i) => ({
                      key: i,
                      ...d,
                    }))}
                    bordered
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Detay No",
                        dataIndex: "detayNo",
                        key: "detayNo",
                        width: 120,
                      },
                      {
                        title: "Açıklama",
                        dataIndex: "aciklama",
                        key: "aciklama",
                      },
                      {
                        title: "Tarih",
                        dataIndex: "tarih",
                        key: "tarih",
                        width: 160,
                        render: (val) => (val ? new Date(val).toLocaleDateString("tr-TR") : "-"),
                      },
                      {
                        title: "Durum",
                        dataIndex: "durum",
                        key: "durum",
                        width: 150,
                      },
                    ]}
                    locale={{ emptyText: "Detay bilgisi bulunamadı." }}
                  />
                </div>
              )}
            </TabPane>
          );
        })}
      </Tabs>
      <TedarikciEkle
        visible={isTedarikciModalOpen}
        firmalar={paketler[activeTab - 1]?.firmaTotaller || []}
        teklifId={paketler[activeTab - 1]?.teklif?.teklifId || paketler[activeTab - 1]?.teklifBaslik?.teklifId}
        onCancel={() => {
          setTedarikciModalOpen(false);
          const allTeklifIds = paketler.map(p => p.id);
          if (allTeklifIds.length) fetchAllTeklifler(allTeklifIds); // tüm teklifler için fetch
        }}
        onOk={(guncelFirmalar) => {
          setPaketler((prev) => {
            const updated = [...prev];
            updated[activeTab - 1].firmaTotaller = guncelFirmalar;
            return updated;
          });
          setTedarikciModalOpen(false);
          message.success("Firmalar güncellendi!");

          const allTeklifIds = paketler.map(p => p.id);
          if (allTeklifIds.length) fetchAllTeklifler(allTeklifIds); // tüm teklifler için fetch
        }}
      />
      <MalzemeEkle
        visible={isMalzemeModalOpen}
        teklifId={paketler[activeTab - 1]?.teklif?.teklifId || paketler[activeTab - 1]?.teklifBaslik?.teklifId}
        onCancel={() => {
          setMalzemeModalOpen(false);
          const allTeklifIds = paketler.map(p => p.id);
          if (allTeklifIds.length) fetchAllTeklifler(allTeklifIds); // tüm teklifler için fetch
        }}
        malzemeler={
          paketler[activeTab - 1]?.malzemeler?.map((m) => ({
          malzemeId: m.malzemeId,  // 👈 malzemeId kesin gelmeli
          stokId: m.stokId ?? null, // 👈 stokId opsiyonel
          malzeme: m.malzeme,
          })) || []
        }
      />
    </Card>
  );
};

export default TeklifKarsilastirma;