import React, { useState, useEffect } from "react";
import { Table, InputNumber, Select, Typography, Card, Button, Space, Radio, Tabs, Spin, message, Modal, Input, DatePicker } from "antd";
import { FileExcelOutlined, PrinterOutlined, PlusOutlined, CheckCircleOutlined, SaveOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../api/http";
import TedarikciEkle from "./FirmaEkleCikar";
import MalzemeEkle from "./MalzemeEkleCikar";
import TeklifiSipariseAktar from "./TeklifSipariseAktar/EditDrawer";
import KodIDSelectbox from "../../../../../../../../utils/components/KodIDSelectbox";
import dayjs from "dayjs";

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
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false);
  const [editingCell, setEditingCell] = useState(null);

  // Paketler ilk yüklendiğinde renkleri ata
  useEffect(() => {
    if (paketler.length === 0) return;
    
    // NOT: `if (Object.keys(paketRenkleri).length > 0) return;` satırını kaldırdık.
    // Çünkü bu satır yüzünden yeni eklenenlere renk vermiyordu.

    setPaketRenkleri(prev => {
      // Önceki renkleri kopyala (State'i korumak için)
      const guncelRenkler = { ...prev };

      paketler.forEach((paket, paketIndex) => {
        // Eğer o paket için henüz renk objesi yoksa oluştur
        if (!guncelRenkler[paketIndex]) {
          guncelRenkler[paketIndex] = {};
        }

        (paket.firmaTotaller || []).forEach(firma => {
          // KRİTİK NOKTA BURASI:
          // Eğer bu firmanın zaten bir rengi varsa onu KORU (değiştirme).
          // Eğer rengi yoksa (yeni eklendiyse) ona özel yeni random renk üret.
          if (!guncelRenkler[paketIndex][firma.firmaId]) {
            
            // Senin orijinal random mantığın aynen burada
            const min = 205;
            const max = 230;

            const r = Math.floor(Math.random() * (max - min) + min);
            const g = Math.floor(Math.random() * (max - min) + min);
            const b = Math.floor(Math.random() * (max - min) + min);
            
            guncelRenkler[paketIndex][firma.firmaId] = `rgb(${r}, ${g}, ${b})`;
          }
        });
      });

      return guncelRenkler;
    });
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
          const data = res.data || {};

          // 1. Malzemeleri Hazırla
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

          // 2. Detayları Firmalara Eşle
          if (data.firmaTotaller) {
            const detaylar = data.teklifDetaylar || [];
            
            data.firmaTotaller = data.firmaTotaller.map(firma => {
              const detay = detaylar.find(d => d.TFD_CARI_ID === firma.firmaId);

              const checkDate = (dateVal) => {
                if (!dateVal || dateVal.startsWith("1900-01-01") || dateVal.startsWith("0001-01-01")) return null;
                return dateVal;
              };

              return {
                ...firma,
                teklifTarihi: checkDate(detay?.TFD_TEKLIF_TARIH),
                gecerlilikTarihi: checkDate(detay?.TFD_GECERLILIK_TARIH),
                teslimTarihi: checkDate(detay?.TFD_TESLIM_TARIH),
                teslimYeri: detay?.TFD_TESLIM_YERI || "",
                sevkSekli: detay?.TFD_SEVK_SEKLI_ID || null, 
                odemeBilgisi: detay?.TFD_ODEME_SEKLI_ID || null,
                yetkili: detay?.TFD_YETKILI || "",
                telefon: detay?.TFD_TELEFON || "",
                aciklama: detay?.TFD_ACIKLAMA || "",
                toplamKDVtutar: firma.toplamKDVtutar, 
                toplamIndirim: firma.toplamIndirim,
                genelToplam: firma.genelToplam
              };
            });
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
      // 1. Ara Toplam
      const araToplam = (malzemeler || []).reduce((acc, m) => {
        const f = (m.firmalar || []).find((x) => x.firmaId === firma.firmaId);
        return acc + (Number(f?.tutar ?? 0));
      }, 0);

      // 2. İndirim
      const indirimOrani = Number(firma.indirimOrani ?? 0);
      const indirimTutar = araToplam * (indirimOrani / 100);

      // 3. KDV Hesaplama (Dahil/Hariç Kontrolü)
      const kdvOrani = Number(firma.kdvOrani ?? 0);
      const matrah = araToplam - indirimTutar; // İndirim düşülmüş tutar
      const kdvDurum = firma.kdvDurum || "Hariç"; // Default Hariç olsun

      let kdvTutar = 0;
      let genelToplam = 0;

      if (kdvDurum === "Hariç") {
        // --- HARİÇ HESABI ---
        // Matrah + (Matrah * Oran)
        kdvTutar = matrah * (kdvOrani / 100);
        genelToplam = matrah + kdvTutar;
      } else {
        // --- DAHİL HESABI (İçyüzde Yöntemi) ---
        // KDV = Tutar - (Tutar / (1 + Oran/100))
        // Genel Toplam = Matrah (Çünkü KDV zaten içindeydi)
        kdvTutar = matrah - (matrah / (1 + (kdvOrani / 100)));
        genelToplam = matrah; 
      }

      return {
        ...firma,
        araToplam,
        indirimTutar,
        kdvTutar,
        genelToplam,
        kdvDurum, // Durumu kaybetmemek için geri dönüyoruz
      };
    });
  };

  // InputNumber değiştiğinde çağrılır
  const handleValueChange = (paketIndex, malzemeId, firmaId, field, value) => {
    setHasChanges(true);
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

  const handleTutarChange = (paketIndex, firmaId, field, value) => {
    setHasChanges(true);
    const girilenTutar = value == null ? 0 : Number(value); // Örn: 1000 TL

    setPaketler((prev) => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;

        const paket = { ...p };
        
        // 1. Ara Toplamı Bul (Yüzdeyi hesaplamak için lazım)
        const araToplam = (paket.malzemeler || []).reduce((acc, m) => {
          const f = (m.firmalar || []).find((x) => x.firmaId === firmaId);
          return acc + (Number(f?.tutar ?? 0));
        }, 0);

        // 2. Yüzdeyi Hesapla (Tutar / Ara Toplam * 100)
        let yeniOran = 0;
        if (araToplam > 0) {
          if (field === "indirimOrani") {
             // İndirim Oranı Hesabı
             yeniOran = (girilenTutar / araToplam) * 100;
          } else if (field === "kdvOrani") {
             // KDV Oranı Hesabı (Matrah üzerinden)
             // Matrah = Ara Toplam - İndirim Tutarı
             const mevcutIndirimOrani = paket.firmaTotaller.find(f => f.firmaId === firmaId)?.indirimOrani || 0;
             const indirimTutari = araToplam * (mevcutIndirimOrani / 100);
             const matrah = araToplam - indirimTutari;
             
             if (matrah > 0) {
                yeniOran = (girilenTutar / matrah) * 100;
             }
          }
        }

        // 3. Yeni Oranı Kaydet
        paket.firmaTotaller = (paket.firmaTotaller || []).map((f) => {
          if (f.firmaId !== firmaId) return f;
          return { ...f, [field]: yeniOran };
        });

        // 4. Tutarları Tekrar Hesapla (State güncellensin)
        paket.firmaTotaller = computeFirmaTotals(paket.malzemeler, paket.firmaTotaller);
        return paket;
      });
    });
  };

  const renderEditableSummaryCell = (paketIndex, firmaId, field, amountValue, percentValue) => {
    const isEditing = editingCell?.paketIndex === paketIndex && 
                      editingCell?.firmaId === firmaId && 
                      editingCell?.field === field;

    if (isEditing) {
      return (
        <InputNumber
          autoFocus
          min={0}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          value={Number(amountValue.toFixed(2))}
          onChange={(val) => handleTutarChange(paketIndex, firmaId, field, val)}
          onBlur={() => setEditingCell(null)}
          onPressEnter={() => setEditingCell(null)}
          size="small"
          style={{ width: "110px" }}
          placeholder="Tutar Gir"
        />
      );
    }

    return (
      <div 
        onClick={() => {
          if (!isDisabled) {
            setEditingCell({ paketIndex, firmaId, field });
          }
        }}
        style={{ 
          cursor: isDisabled ? "default" : "pointer", 
          border: "1px solid transparent",
          padding: "4px 8px",
          borderRadius: "4px",
          transition: "all 0.3s",
          textAlign: "right",
          minHeight: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end"
        }}
        className="editable-cell-hover"
      >
        {/* strong propunu kaldırdık, artık normal yazı */}
        <Text>
           % {Number(percentValue).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </div>
    );
  };

  const handleKdvDurumChange = (paketIndex, firmaId, value) => {
    setHasChanges(true);
    setPaketler((prev) => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;

        const paket = { ...p };
        paket.firmaTotaller = (paket.firmaTotaller || []).map((f) => {
          if (f.firmaId !== firmaId) return f;
          return { ...f, kdvDurum: value };
        });

        // Yeni duruma göre tekrar hesapla
        paket.firmaTotaller = computeFirmaTotals(paket.malzemeler, paket.firmaTotaller);
        return paket;
      });
    });
  };

  const handleFirmaDetailChange = (paketIndex, firmaId, field, value) => {
    setHasChanges(true);
    setPaketler((prev) => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;

        const newPaket = { ...p };
        // Firma listesinde ilgili firmayı bulup alanını güncelliyoruz
        newPaket.firmaTotaller = (newPaket.firmaTotaller || []).map((f) => {
          if (f.firmaId !== firmaId) return f;
          return { ...f, [field]: value };
        });
        return newPaket;
      });
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

  const upsertTeklifKarsilastirma = async (paketIndex, showMessage = true) => {
    if (!paketler[paketIndex]) return;

    const paket = paketler[paketIndex];

    // 1. Malzemeler Payload Hazırlığı
    const malzemelerPayload = (paket.malzemeler || []).map((m) => ({
      malzemeId: m.malzemeId,
      firmalar: (m.firmalar || []).map((f) => ({
        firmaId: f.firmaId,
        marka: f.marka || "", 
        miktar: Number(f.miktar ?? 0),
        fiyat: Number(f.fiyat ?? 0),
        tutar: Number(f.tutar ?? 0),
        secili: f.secili ? 1 : 0,
      })),
    }));

    // 2. Firma Detayları Payload Hazırlığı (JSON Formatına Göre)
    const firmaDetaylarPayload = (paket.firmaTotaller || []).map((f) => ({
      firmaId: f.firmaId,
      teklifTarihi: f.teklifTarihi || null,
      teklifGecerlilikTarihi: f.gecerlilikTarihi || null,
      teslimTarihi: f.teslimTarihi || null,
      
      teslimYeri: f.teslimYeri || "",
      
      // Selectboxlar string değer tutuyor, ID isteniyorsa 0 gönderiyoruz.
      // Veri kaybolmasın diye string değerleri de ekliyoruz.
      sevkSekliId: f.sevkSekli || 0, 
      odemeSekliId: f.odemeBilgisi || 0,
      
      yetkili: f.yetkili || "",
      telefon: f.telefon || "",
      aciklama: f.aciklama || "",
    }));

    // 3. Ana Payload
    const payload = {
      teklifId: paket.id || 0,
      malzemeler: malzemelerPayload,
      firmaDetaylar: firmaDetaylarPayload,
    };

    try {
      const res = await AxiosInstance.post("/UpsertTeklifKarsilastirma", payload);
      if (showMessage) {
        message.success("Teklif başarıyla kaydedildi!");
      }
      setKaydedildi(true);
      setHasChanges(false);
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
    setHasChanges(true);
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

  const handleMarkaChange = (paketIndex, val, malzemeId, firmaId) => {
    setHasChanges(true);
    setPaketler((prev) => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;

        const newPaket = { ...p };
        newPaket.malzemeler = newPaket.malzemeler.map((m) => {
          // 3. Doğru satırı (malzemeId) bul
          if (m.malzemeId !== malzemeId) return m;

          return {
            ...m,
            firmalar: m.firmalar.map((f) => {
              if (f.firmaId !== firmaId) return f;
              return { ...f, marka: val };
            }),
          };
        });
        return newPaket;
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

  // Tab değiştirme fonksiyonu
  const handleTabChange = (newKey) => {
    if (hasChanges) {
      Modal.confirm({
        title: "Kaydedilmemiş Değişiklikler Var",
        content: "Yaptığınız değişiklikleri kaydetmeden diğer sekmeye geçmek istediğinize emin misiniz?",
        okText: "Evet, Geç",
        cancelText: "İptal",
        onOk: () => {
          setHasChanges(false);
          setActiveTab(newKey);
        },
        onCancel: () => {
        },
      });
    } else {
      setActiveTab(newKey);
    }
  };


  return (
    <Card
      title={`Satınalma Teklif Kıyaslama - ${fisNo}`}
      extra={
        <Space>
          <Button icon={<FileExcelOutlined />}>Excel</Button>
          <Button icon={<PrinterOutlined />}>Yazdır/PDF</Button>
          <Button 
            icon={<PlusOutlined />} 
            loading={saving}
            disabled={disabled || isDisabled || saving}
            onClick={async () => {
              try {
                setSaving(true);
                await upsertTeklifKarsilastirma(aktifPaketIndex, false);
                setTedarikciModalOpen(true);
              } catch (error) {
              } finally {
                setSaving(false);
              }
            }} 
          >
            Tedarikçi Ekle / Sil
          </Button>
          <Button 
            icon={<PlusOutlined />} 
            loading={saving} 
            disabled={disabled || isDisabled || saving} 
            onClick={async () => {
              try {
                setSaving(true);
                await upsertTeklifKarsilastirma(aktifPaketIndex, false);
                setMalzemeModalOpen(true);
              } catch (error) {
              } finally {
                setSaving(false);
              }
            }} 
          >
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
                if (hasChanges) {
                    Modal.confirm({
                        title: "Kaydedilmemiş Değişiklikler Var",
                        content: "Onaya göndermeden önce değişiklikleri kaydetmeniz gerekiyor. Şimdi kaydedip devam etmek ister misiniz?",
                        okText: "Kaydet ve Gönder",
                        cancelText: "İptal",
                        onOk: async () => {
                            await upsertTeklifKarsilastirma(aktifPaketIndex);
                            onOnayaGonder(teklifId, true);
                        }
                    });
                } else {
                    onOnayaGonder(teklifId);
                }
              } else {
                setSelectedRow(teklifId);
                setSiparisModalOpen(true);
              }
            }}
            disabled={disabled || (isDisabled && aktifPaketDurumID !== 3)}
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
        onChange={handleTabChange}
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
                  width: 5,
                  align: "center",
                  onCell: () => ({ style: { backgroundColor: pastelColor } }),
                  render: (_, record) => {
                    const firmaData = record.firmalar.find(f => f.firmaId === firma.firmaId);
                    const isSecili = firmaData?.secili;
                    const isRenkliAmaKilitli = isDisabled && isSecili;

                    return (
                      <Select
                        style={{ 
                          width: "100%", 
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
                  width: 200,
                  align: "center",
                  onCell: () => ({ style: { backgroundColor: pastelColor } }),
                  render: (_, record) => {
                    const f = record?.firmalar?.find((x) => x.firmaId === firma.firmaId) || {};
                    const isSelected = f.secili;
                    const shouldBeDisabled = isDisabled && !isSelected;
                    const isLockedMode = isDisabled;
                    return (
                      <Input
                        value={f.marka || ""}
                        onChange={(e) => handleMarkaChange(paketIndex, e.target.value, record.key, firma.firmaId)}
                        style={{
                          width: "90%",
                          pointerEvents: isLockedMode ? "none" : "auto",
                        }}
                        disabled={shouldBeDisabled}
                        placeholder="Marka giriniz."
                      />
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
                  title: "Birim Fiyat",
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
                  ({DURUM_STYLES[durumID]?.text || ""})
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
                  // Ortalamak için standart stil
                  const cellWrapperStyle = { 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '100%' 
                  };
                  
                  // Bileşenlerin genişliği (Hepsi aynı olsun)
                  const componentStyle = { width: "50%" };

                  return (
                    <>
                      {/* --- BOŞLUK SATIRI --- */}
                      <Table.Summary.Row style={{ height: "30px", background: "transparent" }}>
                         <Table.Summary.Cell index={0} colSpan={columns.length} />
                      </Table.Summary.Row>

                      {/* --- NORMAL TOPLAMLAR (RENKLİ) --- */}
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>ARA TOPLAM</Text></Table.Summary.Cell>
                          {firmalar.map(firma => {
                            const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                            return (
                              <Table.Summary.Cell key={`toplam-${firma.firmaId}`} colSpan={5} align="right" style={{ backgroundColor: pastelColor }}>
                                {(firma.araToplam ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                              </Table.Summary.Cell>
                            );
                          })}
                      </Table.Summary.Row>

                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>İNDİRİM</Text></Table.Summary.Cell>
                          {firmalar.map(firma => {
                            const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                            return (
                              <Table.Summary.Cell key={`indirim-${firma.firmaId}`} colSpan={5} align="right" style={{ backgroundColor: pastelColor }}>
                                {renderEditableSummaryCell(
                                  paketIndex, 
                                  firma.firmaId, 
                                  "indirimOrani", 
                                  firma.indirimTutar ?? 0, 
                                  firma.indirimOrani ?? 0 
                                )}
                              </Table.Summary.Cell>
                            );
                          })}
                      </Table.Summary.Row>

                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>KDV</Text></Table.Summary.Cell>
                          {firmalar.map(firma => {
                            const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                            return (
                              <Table.Summary.Cell key={`kdv-${firma.firmaId}`} colSpan={5} align="right" style={{ backgroundColor: pastelColor }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                                  <Radio.Group 
                                    options={[{ label: 'Hariç', value: 'Hariç' }, { label: 'Dahil', value: 'Dahil' }]}
                                    onChange={(e) => handleKdvDurumChange(paketIndex, firma.firmaId, e.target.value)}
                                    value={firma.kdvDurum || "Hariç"}
                                    optionType="button"
                                    buttonStyle="solid"
                                    size="small"
                                    disabled={isDisabled}
                                  />
                                  <InputNumber
                                    min={0} max={100}
                                    formatter={value => `% ${value}`}
                                    parser={value => value.replace('% ', '')}
                                    value={firma.kdvOrani}
                                    onChange={(val) => handleKdvRateChange(paketIndex, firma.firmaId, val)}
                                    disabled={isDisabled}
                                    size="small"
                                    style={{ width: "60px" }}
                                  />
                                  <Text>{(firma.kdvTutar ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</Text>
                                </div>
                              </Table.Summary.Cell>
                            );
                          })}
                      </Table.Summary.Row>

                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><Text strong>GENEL TOPLAM</Text></Table.Summary.Cell>
                          {firmalar.map(firma => {
                            const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                            return (
                              <Table.Summary.Cell key={`genel-${firma.firmaId}`} colSpan={5} align="right" style={{ backgroundColor: pastelColor }}>
                                {(firma.genelToplam ?? 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                              </Table.Summary.Cell>
                            );
                          })}
                      </Table.Summary.Row>

                      {/* --- DETAY BİLGİLERİ (HEPSİ ORTALI VE AYNI HİZADA) --- */}
                      {detayGosterilenPaket === paketIndex && (
                        <>
                          <Table.Summary.Row style={{ height: "20px", background: "transparent" }}>
                             <Table.Summary.Cell index={0} colSpan={columns.length} />
                          </Table.Summary.Row>

                          {/* TEKLİF TARİHİ */}
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><Text strong>TEKLİF TARİHİ</Text></Table.Summary.Cell>
                            {firmalar.map(firma => {
                              const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                              return (
                                <Table.Summary.Cell key={`tarih-${firma.firmaId}`} colSpan={5} align="center" style={{ backgroundColor: pastelColor }}>
                                  <div style={cellWrapperStyle}>
                                    <DatePicker 
                                      style={componentStyle}
                                      format="DD.MM.YYYY"
                                      value={firma.teklifTarihi ? dayjs(firma.teklifTarihi) : null}
                                      onChange={(date) => handleFirmaDetailChange(paketIndex, firma.firmaId, "teklifTarihi", date ? date.toISOString() : null)}
                                      disabled={isDisabled}
                                      placeholder="Tarih Seç"
                                    />
                                  </div>
                                </Table.Summary.Cell>
                              );
                            })}
                          </Table.Summary.Row>

                          {/* GEÇERLİLİK TARİHİ */}
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><Text strong>GEÇERLİLİK TARİHİ</Text></Table.Summary.Cell>
                            {firmalar.map(firma => {
                              const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                              return (
                                <Table.Summary.Cell key={`gecerlilik-${firma.firmaId}`} colSpan={5} align="center" style={{ backgroundColor: pastelColor }}>
                                  <div style={cellWrapperStyle}>
                                    <DatePicker 
                                      style={componentStyle}
                                      format="DD.MM.YYYY"
                                      value={firma.gecerlilikTarihi ? dayjs(firma.gecerlilikTarihi) : null}
                                      onChange={(date) => handleFirmaDetailChange(paketIndex, firma.firmaId, "gecerlilikTarihi", date ? date.toISOString() : null)}
                                      disabled={isDisabled}
                                      placeholder="Tarih Seç"
                                    />
                                  </div>
                                </Table.Summary.Cell>
                              );
                            })}
                          </Table.Summary.Row>

                          {/* TESLİM TARİHİ */}
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><Text strong>TESLİM TARİHİ</Text></Table.Summary.Cell>
                            {firmalar.map(firma => {
                              const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                              return (
                                <Table.Summary.Cell key={`teslimT-${firma.firmaId}`} colSpan={5} align="center" style={{ backgroundColor: pastelColor }}>
                                  <div style={cellWrapperStyle}>
                                    <DatePicker 
                                      style={componentStyle}
                                      format="DD.MM.YYYY"
                                      value={firma.teslimTarihi ? dayjs(firma.teslimTarihi) : null}
                                      onChange={(date) => handleFirmaDetailChange(paketIndex, firma.firmaId, "teslimTarihi", date ? date.toISOString() : null)}
                                      disabled={isDisabled}
                                      placeholder="Tarih Seç"
                                    />
                                  </div>
                                </Table.Summary.Cell>
                              );
                            })}
                          </Table.Summary.Row>

                          {/* TESLİM YERİ */}
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><Text strong>TESLİM YERİ</Text></Table.Summary.Cell>
                            {firmalar.map(firma => {
                              const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                              return (
                                <Table.Summary.Cell key={`teslimY-${firma.firmaId}`} colSpan={5} align="center" style={{ backgroundColor: pastelColor }}>
                                  <div style={cellWrapperStyle}>
                                    <Input
                                      style={componentStyle}
                                      value={firma.teslimYeri} 
                                      onChange={(e) => handleFirmaDetailChange(paketIndex, firma.firmaId, "teslimYeri", e.target.value)}
                                      disabled={isDisabled}
                                    />
                                  </div>
                                </Table.Summary.Cell>
                              );
                            })}
                          </Table.Summary.Row>

                          {/* SEVK ŞEKLİ */}
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><Text strong>SEVK ŞEKLİ</Text></Table.Summary.Cell>
                            {firmalar.map(firma => {
                              const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                              return (
                                <Table.Summary.Cell key={`sevk-${firma.firmaId}`} colSpan={5} align="center" style={{ backgroundColor: pastelColor }}>
                                  <div style={cellWrapperStyle}>
                                    <div style={componentStyle}>
                                      <KodIDSelectbox 
                                        name1="sevkKodId" 
                                        kodID={13071} 
                                        isRequired={false} 
                                        value={firma.sevkSekli} 
                                        onChange={(val) => handleFirmaDetailChange(paketIndex, firma.firmaId, "sevkSekli", val)}
                                        disabled={isDisabled}
                                      />
                                    </div>
                                  </div>
                                </Table.Summary.Cell>
                              );
                            })}
                          </Table.Summary.Row>

                          {/* ÖDEME BİLGİSİ */}
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><Text strong>ÖDEME BİLGİSİ</Text></Table.Summary.Cell>
                            {firmalar.map(firma => {
                              const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                              return (
                                <Table.Summary.Cell key={`odeme-${firma.firmaId}`} colSpan={5} align="center" style={{ backgroundColor: pastelColor }}>
                                  <div style={cellWrapperStyle}>
                                    <div style={componentStyle}>
                                      <KodIDSelectbox 
                                        name1="odemeSekliKodId" 
                                        kodID={33021} 
                                        isRequired={false}
                                        value={firma.odemeBilgisi} 
                                        onChange={(val) => handleFirmaDetailChange(paketIndex, firma.firmaId, "odemeBilgisi", val)}
                                        disabled={isDisabled}
                                      />
                                    </div>
                                  </div>
                                </Table.Summary.Cell>
                              );
                            })}
                          </Table.Summary.Row>

                          {/* YETKİLİ */}
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><Text strong>YETKİLİ</Text></Table.Summary.Cell>
                            {firmalar.map(firma => {
                              const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                              return (
                                <Table.Summary.Cell key={`yetkili-${firma.firmaId}`} colSpan={5} align="center" style={{ backgroundColor: pastelColor }}>
                                  <div style={cellWrapperStyle}>
                                    <Input 
                                      style={componentStyle}
                                      value={firma.yetkili} 
                                      onChange={(e) => handleFirmaDetailChange(paketIndex, firma.firmaId, "yetkili", e.target.value)}
                                      disabled={isDisabled}
                                    />
                                  </div>
                                </Table.Summary.Cell>
                              );
                            })}
                          </Table.Summary.Row>

                          {/* TELEFON */}
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><Text strong>TELEFON</Text></Table.Summary.Cell>
                            {firmalar.map(firma => {
                              const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                              return (
                                <Table.Summary.Cell key={`telefon-${firma.firmaId}`} colSpan={5} align="center" style={{ backgroundColor: pastelColor }}>
                                  <div style={cellWrapperStyle}>
                                    <Input 
                                      style={componentStyle}
                                      value={firma.telefon} 
                                      onChange={(e) => handleFirmaDetailChange(paketIndex, firma.firmaId, "telefon", e.target.value)}
                                      disabled={isDisabled}
                                    />
                                  </div>
                                </Table.Summary.Cell>
                              );
                            })}
                          </Table.Summary.Row>

                          {/* AÇIKLAMA */}
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><Text strong>AÇIKLAMA</Text></Table.Summary.Cell>
                            {firmalar.map(firma => {
                              const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
                              return (
                                <Table.Summary.Cell key={`aciklama-${firma.firmaId}`} colSpan={5} align="center" style={{ backgroundColor: pastelColor }}>
                                  <div style={cellWrapperStyle}>
                                    <Input.TextArea 
                                      style={componentStyle}
                                      value={firma.aciklama} 
                                      onChange={(e) => handleFirmaDetailChange(paketIndex, firma.firmaId, "aciklama", e.target.value)}
                                      disabled={isDisabled}
                                      autoSize={{ minRows: 1, maxRows: 3 }}
                                    />
                                  </div>
                                </Table.Summary.Cell>
                              );
                            })}
                          </Table.Summary.Row>
                        </>
                      )}
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