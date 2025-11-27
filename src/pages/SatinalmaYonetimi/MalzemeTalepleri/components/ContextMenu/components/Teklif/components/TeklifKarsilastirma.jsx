import React, { useState, useEffect } from "react";
import { Table, InputNumber, Select, Typography, Card, Button, Space, Radio, Tabs, Spin, message } from "antd";
import { FileExcelOutlined, PrinterOutlined, PlusOutlined, CheckCircleOutlined, SaveOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../api/http";
import TedarikciEkle from "./FirmaEkleCikar";
import MalzemeEkle from "./MalzemeEkleCikar";
import TeklifiSipariseAktar from "./TeklifSipariseAktar/EditDrawer";

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const TeklifKarsilastirma = ({ teklifIds, teklifDurumlari, fisNo, fisId, disabled = false, onDurumGuncelle }) => {
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
  const aktifPaketDurumID = teklifDurumlari?.find(d => d.teklifId === aktifPaket.id)?.durumID || null;
  const isDisabled = !(aktifPaketDurumID === 1 || aktifPaketDurumID === 4);
  const [detayGosterilenPaket, setDetayGosterilenPaket] = useState(null);
  const DURUM_STYLES = {
    1: { text: "TEKLİFLER TOPLANIYOR", backgroundColor: "#e1f7d5", color: "#3c763d" },
    2: { text: "ONAYA GÖNDERİLDİ", backgroundColor: "#fff4d6", color: "#b8860b" },
    3: { text: "ONAYLANDI", backgroundColor: "#d4f8e8", color: "#207868" },
    4: { text: "REDDEDİLDİ", backgroundColor: "#fde2e4", color: "#c63b3b" },
    5: { text: "SİPARİŞ", backgroundColor: "#e6f7ff", color: "#096dd9" }
  };
  const [onayCheck, setOnayCheck] = useState({ ONY_AKTIF: 0, ONY_MANUEL: 0 });
  const showOnayaGonder = onayCheck && aktifPaketDurumID !== 3 && aktifPaketDurumID !== 2;
  const [siparisModalOpen, setSiparisModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Paketler ilk yüklendiğinde renkleri ata
useEffect(() => {
  if (paketler.length === 0) return;
  if (Object.keys(paketRenkleri).length > 0) return;

  const renkler = {};
  paketler.forEach((paket, paketIndex) => {
    renkler[paketIndex] = {};
    (paket.firmaTotaller || []).forEach(firma => {
      
      // MANTIK: 200 ile 230 arasında rastgele sayı üretiyoruz.
      // 255 (Beyaz) sınırına yaklaşmadığımız için beyaz çıkmaz.
      // 200'ün altına inmediğimiz için koyu çıkmaz.
      const min = 205;
      const max = 230;

      const r = Math.floor(Math.random() * (max - min) + min);
      const g = Math.floor(Math.random() * (max - min) + min);
      const b = Math.floor(Math.random() * (max - min) + min);
      
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

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await AxiosInstance.post(`GetOnayCheck?TB_ONAY_ID=4`); // API URL'niz
          if (response[0].ONY_AKTIF === 1) {
            setOnayCheck(true);
          } else {
            setOnayCheck(false);
          }
        } catch (error) {
          console.error("API isteğinde hata oluştu:", error);
        }
      };
  
      fetchData();
    }, []);

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

  const onOnayaGonder = async (paketId) => {
  const paket = paketler.find(p => {
    return p.teklifId === paketId || p.id === paketId || p.teklifBaslik?.teklifId === paketId;
  });

  if (!paket) {
    message.error("Paket bulunamadı!");
    return;
  }

  const onayTabloId = paket.teklifId || paket.id || paket.teklifBaslik?.teklifId || 0;

  try {
    const response = await AxiosInstance.post(`/OnayaGonder`, {
      ONAY_TABLO_ID: Number(onayTabloId) || 0,
      ONAY_TABLO_KOD: fisNo || "",
      ONAY_ONYTANIM_ID: 4
    });

    if (response.status_code === 200 || response.status_code === 201) {
      message.success("Teklif onaya gönderildi.");
      if (typeof onDurumGuncelle === "function") {
        onDurumGuncelle({ teklifId: paketId, durumID: 2 }); // 2 = Onaya Gönderildi
      }
    } else if (response.status_code === 401) {
      message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
    } else {
      message.error("İşlem Başarısız.");
    }

  } catch (error) {
    console.error("Onaya gönderme sırasında hata oluştu:", error);
    message.error("Onaya gönderme sırasında hata oluştu.");
  }
};

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
        secili: f.secili ? 1 : 0,
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

  const handleSecimChange = (paketIndex, malzemeId, firmaId, val) => {
    setPaketler(prev => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;
        const paket = { ...p };
        paket.malzemeler = paket.malzemeler.map(m => {
          if (m.malzemeId !== malzemeId) return m;

          return {
            ...m,
            firmalar: m.firmalar.map(f => {
              if (val === "true") {
                return { ...f, secili: f.firmaId === firmaId }; // sadece tıklanan firma true
              } else {
                return { ...f, secili: false }; // x yapınca tüm firmalar false
              }
            }),
          };
        });
        return paket;
      });
    });
  };

  const handleRadioClick = (paketIndex, firmaId) => {
  setSelectedFirmaId(prev => prev === firmaId ? null : firmaId); // tekrar tıklayınca kaldır

  setPaketler(prev => {
    const updated = [...prev];
    const paket = updated[paketIndex];

    paket.malzemeler = (paket.malzemeler || []).map(m => ({
      ...m,
      firmalar: m.firmalar.map(f => {
        if (prev === firmaId) return { ...f, secili: false }; // tekrar tıklayınca tümünü kaldır
        return { ...f, secili: f.firmaId === firmaId }; // aksi halde tüm malzemeleri o firma seçili yap
      }),
    }));

    return updated;
  });
};

  return (
    <Card
      title="Satınalma Teklif Kıyaslama"
      extra={
        <Space>
          <Button icon={<FileExcelOutlined />}>Excel</Button>
          <Button icon={<PrinterOutlined />}>Yazdır/PDF</Button>
          <Button icon={<PlusOutlined />} onClick={() => setTedarikciModalOpen(true)} disabled={disabled || isDisabled} >
            Tedarikçi Ekle / Sil
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => setMalzemeModalOpen(true)} disabled={disabled || isDisabled} >
            Malzeme Ekle / Sil
          </Button>
          <Button
            icon={<SaveOutlined />}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", color: "#fff" }}
            onClick={() => upsertTeklifKarsilastirma(aktifPaketIndex)}
            disabled={disabled || isDisabled}
          >
            Teklifi Kaydet
          </Button>
          <Button
            type="primary"
            icon={showOnayaGonder ? <CheckCircleOutlined /> : <ShoppingCartOutlined />}
            style={{
              backgroundColor: showOnayaGonder ? "#52c41a" : "#00BBFF",
              borderColor: showOnayaGonder ? "#52c41a" : "#2BC770",
              color: "#fff"
            }}
            onClick={() => {
              if (!aktifPaket) return message.error("Aktif paket bulunamadı!");

              const teklifId = aktifPaket.teklifId || aktifPaket.id;
              if (!teklifId) return message.error("Teklif ID bulunamadı!");

              if (showOnayaGonder) {
                onOnayaGonder(teklifId);
              } else {
                setSelectedRow(teklifId);
                setSiparisModalOpen(true);
              }
            }}
              disabled={disabled || isDisabled}
            >
              {showOnayaGonder ? "Onaya Gönder" : "Siparişe Aktar"}
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
          const durumID = teklifDurumlari?.find(d => d.teklifId === paket.id)?.durumID || null;

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
                    <Radio
                      checked={selectedFirmaId === firma.firmaId}
                      onChange={() => handleRadioClick(aktifPaketIndex, firma.firmaId)}
                    />
                  </div>
                </div>
              ),
              children: [
                {
                  title: "Seç",
                  dataIndex: `secili${firma.firmaId}`,
                  width: 100,
                  align: "center",
                  onCell: () => ({ style: { backgroundColor: pastelColor } }),
                  render: (_, record) => {
                    const firmaData = record.firmalar.find(f => f.firmaId === firma.firmaId);
                    const isSecili = firmaData?.secili;
                    const isRenkliAmaKilitli = isDisabled && isSecili;

                    return (
                      <Select
                        style={{ 
                          width: "90%", 
                          pointerEvents: isRenkliAmaKilitli ? 'none' : 'auto' 
                        }} 
                        disabled={isRenkliAmaKilitli ? false : isDisabled}
                        open={isRenkliAmaKilitli ? false : undefined}
                        showArrow={!isRenkliAmaKilitli}
                        value={firmaData?.secili ? "true" : "false"}
                        onChange={(val) =>
                          handleSecimChange(paketIndex, record.malzemeId, firma.firmaId, val)
                        }
                      >
                        <Select.Option value="true">
                          <span style={{ color: "green", fontWeight: "bold" }}>✓</span>
                        </Select.Option>
                        <Select.Option value="false">
                          <span style={{ color: "red", fontWeight: "bold" }}>X</span>
                        </Select.Option>
                      </Select>
                    );
                  },
                },
                {
                  title: "Marka",
                  dataIndex: `marka_${firma.firmaId}`,
                  width: 100,
                  align: "center",
                  onCell: () => ({ style: { backgroundColor: pastelColor } }),
                  render: (_, record) => {
                    const f = record?.firmalar?.find(x => x.firmaId === firma.firmaId) || {};
                    const isSelected = f.secili;
                    const shouldBeDisabled = isDisabled && !isSelected;
                    const isLockedMode = isDisabled; 

                    return (
                      <Select 
                        value={f.marka || undefined} 
                        style={{ 
                          width: "90%",
                          pointerEvents: isLockedMode ? 'none' : 'auto'
                        }} 
                        disabled={shouldBeDisabled}
                        open={isLockedMode ? false : undefined}
                        showArrow={!isLockedMode}
                      >
                      </Select>
                    );
                  },
                },
                {
                  title: "Miktar",
                  dataIndex: `miktar_${firma.firmaId}`,
                  width: 100,
                  align: "center",
                  onCell: () => ({ style: { backgroundColor: pastelColor } }),
                  render: (_, record) => {
                    const f = record?.firmalar?.find(x => x.firmaId === firma.firmaId) || {};
                    const isSelected = f.secili;
                    const shouldBeDisabled = isDisabled && !isSelected;

                    return (
                      <InputNumber
                        min={0}
                        value={Number(f.miktar ?? 0)}
                        style={{ width: "90%" }}
                        disabled={shouldBeDisabled}
                        readOnly={isDisabled}
                        onChange={(val) => handleValueChange(paketIndex, record.malzemeId, firma.firmaId, "miktar", val)}
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
                    const isSelected = f.secili;
                    const shouldBeDisabled = isDisabled && !isSelected;

                    return (
                      <InputNumber
                        min={0}
                        value={Number(f.fiyat ?? 0)}
                        style={{ width: "90%" }}
                        disabled={shouldBeDisabled}
                        readOnly={isDisabled}
                        onChange={(val) => handleValueChange(paketIndex, record.malzemeId, firma.firmaId, "fiyat", val)}
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
            <TabPane
              tab={ 
                <div 
                  style={{backgroundColor: DURUM_STYLES[durumID]?.backgroundColor, color: DURUM_STYLES[durumID]?.color, padding: "4px 12px", borderRadius: 6, fontWeight: "bold" }}
                >
                  {paket?.teklifBaslik?.baslik || `Teklif ${paketIndex + 1}`} - 
                  {" "}
                  {DURUM_STYLES[durumID]?.text || ""}
                </div>
              } key={`${paketIndex + 1}`}
            >
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
                            <Table.Summary.Cell key={`toplam-${firma.firmaId}`} colSpan={5} align="right">
                              {(firma.araToplam ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                            </Table.Summary.Cell>
                          ))}
                      </Table.Summary.Row>

                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>İNDİRİM</Text></Table.Summary.Cell>
                          {firmalar.map(firma => (
                            <Table.Summary.Cell key={`indirim-${firma.firmaId}`} colSpan={5} align="right">
                              {(firma.indirimTutar ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                            </Table.Summary.Cell>
                          ))}
                      </Table.Summary.Row>

                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>KDV</Text></Table.Summary.Cell>
                          {firmalar.map(firma => (
                            <Table.Summary.Cell key={`kdv-${firma.firmaId}`} colSpan={5} align="right">
                              {(firma.kdvTutar ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                            </Table.Summary.Cell>
                          ))}
                      </Table.Summary.Row>

                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>GENEL TOPLAM</Text></Table.Summary.Cell>
                          {firmalar.map(firma => (
                            <Table.Summary.Cell key={`genel-${firma.firmaId}`} colSpan={5} align="right">
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
      <TeklifiSipariseAktar
        open={siparisModalOpen}
        onCloseModal={() => setSiparisModalOpen(false)}
        teklifId={selectedRow}
        fisId={fisId}
        onSiparisGuncelle={(siparisData) => {
    // Burada önceki ekrana güncelleme yapılacak
    message.success("Sipariş başarıyla oluşturuldu!");
    // Örneğin, aktif paketin durumunu 5 = Sipariş Alındı olarak güncelle
    if (typeof onDurumGuncelle === "function") {
      onDurumGuncelle({ teklifId: selectedRow, durumID: 5 });
    }
  }}
      />
    </Card>
  );
};

export default TeklifKarsilastirma;