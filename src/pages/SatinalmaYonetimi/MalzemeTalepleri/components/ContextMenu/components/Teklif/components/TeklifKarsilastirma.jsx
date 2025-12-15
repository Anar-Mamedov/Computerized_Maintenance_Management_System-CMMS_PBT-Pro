import React, { useState, useEffect, useRef } from "react";
import { Table, InputNumber, Select, Typography, Card, Button, Space, Radio, Tabs, Spin, message, Modal, Input, DatePicker, Divider } from "antd";
import { FileExcelOutlined, PrinterOutlined, PlusOutlined, CheckCircleOutlined, SaveOutlined, ShoppingCartOutlined, UnorderedListOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../api/http"; // Yolunu kendi projene göre ayarla
import TedarikciEkle from "./FirmaEkleCikar";
import MalzemeEkle from "./MalzemeEkleCikar";
import TeklifiSipariseAktar from "./TeklifSipariseAktar/EditDrawer";
import Siparislerim from "../../SatinalmaSiparisleri";
import MalzemeTalepModal from "../../../../../Update/EditDrawer";
import SatinalmaSiparisModal from "../../../../../../SatinalmaSiparisleri/Update/EditDrawer";
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// --- ÖZEL SELECTBOX BİLEŞENİ ---
const SimpleKodSelectbox = ({ kodID, value, onChange, disabled, style, placeholder }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  const fetchData = async (force = false) => {
    if (!force && options.length > 0) return options;
    
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`KodList?grup=${kodID}`);
      if (response) {
        setOptions(response);
        return response; 
      }
      return [];
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kodID) {
      fetchData();
    }
  }, [kodID]);

  const addItem = (e) => {
    e.preventDefault();
    const textToAdd = name.trim(); 

    if (textToAdd !== "") {
      if (options.some((option) => option.KOD_TANIM === textToAdd)) {
        message.warning("Bu kayıt zaten var!");
        return;
      }

      setLoading(true);
      
      AxiosInstance.post(`AddKodList?entity=${textToAdd}&grup=${kodID}`)
        .then(async (response) => {
            message.success("Eklendi ve Seçildi.");
            setName(""); 
            const guncelListe = await fetchData(true);
            const eklenenKayit = guncelListe.find(item => item.KOD_TANIM === textToAdd);
            if (eklenenKayit && onChange) {
                onChange(eklenenKayit.TB_KOD_ID);
            }
        })
        .catch((err) => {
            console.error(err);
            message.error("Hata oluştu, eklenemedi.");
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Select
      style={{ width: "100%", ...style }}
      disabled={disabled}
      showSearch
      allowClear
      placeholder={placeholder || "Seçiniz"}
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      value={value === 0 || value === null ? null : value} 
      onChange={onChange}
      onDropdownVisibleChange={(open) => {
        if (open && options.length === 0) {
          fetchData();
        }
      }}
      dropdownRender={(menu) => (
        <Spin spinning={loading}>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <Space style={{ padding: "0 8px 4px" }}>
            <Input
              placeholder="Yeni ekle..."
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()} 
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Ekle
            </Button>
          </Space>
        </Spin>
      )}
      options={options.map((item) => ({
        value: item.TB_KOD_ID,
        label: item.KOD_TANIM,
      }))}
    />
  );
};

// -----------------------------------------------------------------------
// `teklifDurumlari` propunu artık kullanmıyoruz ama uyumluluk için parametrede bıraktım.
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
  
  // --- DEĞİŞİKLİK 1: Durumu artık paketin içinden okuyoruz ---
  const aktifPaketDurumID = aktifPaket?.teklifBaslik?.teklifDurum ?? null;
  // ----------------------------------------------------------

  const isDisabled = !(aktifPaketDurumID === 1 || aktifPaketDurumID === 4);
  const [siparislerimOpen, setSiparislerimOpen] = useState(false);
  const isSiparis = aktifPaketDurumID === 5;
  const [talepModalOpen, setTalepModalOpen] = useState(false); 

  // 2. Tablo içindeki Talep No linki için
  const [talepDetayId, setTalepDetayId] = useState(0);
  const [isTalepModalOpen, setIsTalepModalOpen] = useState(false);

  // 3. Tablo içindeki Sipariş No linki için
  const [siparisDetayId, setSiparisDetayId] = useState(0);
  const [isSiparisModalOpen, setIsSiparisModalOpen] = useState(false);
  
  const [detayGosterilenPaket, setDetayGosterilenPaket] = useState(null);

  const lastFetchedIds = useRef("");
  
  const DURUM_STYLES = {
    1: { text: "TEKLİFLER TOPLANIYOR", backgroundColor: "#e1f7d5", color: "#3c763d" },
    2: { text: "ONAYA GÖNDERİLDİ", backgroundColor: "#fff4d6", color: "#b8860b" },
    3: { text: "ONAYLANDI", backgroundColor: "#d4f8e8", color: "#207868" },
    4: { text: "REDDEDİLDİ", backgroundColor: "#fde2e4", color: "#c63b3b" },
    5: { text: "SİPARİŞ", backgroundColor: "#e6f7ff", color: "#096dd9" }
  };

  const [onayCheck, setOnayCheck] = useState({ ONY_AKTIF: 0, ONY_MANUEL: 0 });
  const showOnayaGonder = onayCheck?.ONY_AKTIF === 1 && aktifPaketDurumID !== 3 && aktifPaketDurumID !== 2;
  
  const [siparisModalOpen, setSiparisModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false);
  const [editingCell, setEditingCell] = useState(null);

  const cellWrapperStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' };
  const componentStyle = { width: "90%" }; 

  useEffect(() => {
    const currentIdsString = JSON.stringify(teklifIds);
    if (teklifIds.length > 0 && lastFetchedIds.current !== currentIdsString) {
      lastFetchedIds.current = currentIdsString;
      fetchAllTeklifler(teklifIds);
    }
  }, [teklifIds]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.post(`/GetOnayCheck?TB_ONAY_ID=4`); 
        if (response.data && response.data.length > 0) setOnayCheck(response.data[0]);
        else if (Array.isArray(response) && response.length > 0) setOnayCheck(response[0]);
      } catch (error) {
        console.error("Onay API hatası:", error);
      }
    };
    fetchData();
  }, []);

  const fetchAllTeklifler = async (ids) => {
  try {
    setLoading(true);
    if (!Array.isArray(ids)) ids = [ids];
    
    // 1. VERİLERİ ÇEK
    const results = await Promise.all(
      ids.map(async (id) => {
        const res = await AxiosInstance.get(`/GetTeklifKarsilastirmaDetay?TeklifId=${id}`);
        const backendData = res.data || {};
        const data = backendData.data || backendData;

        if (data.malzemeler) {
          data.malzemeler = data.malzemeler.map((m) => ({
            ...m,
            firmalar: (m.firmalar || []).map((f) => ({
              ...f,
              miktar: Number(f.miktar ?? 0),
              fiyat: Number(f.fiyat ?? 0),
              tutar: Number(f.tutar ?? (Number(f.miktar ?? 0) * Number(f.fiyat ?? 0))),
              secili: f.secili === true || f.secili === 1,
            })),
          }));
        }

        if (data.firmaTotaller) {
          const detaylar = data.teklifDetaylar || [];
          data.firmaTotaller = data.firmaTotaller.map(firma => {
            const detay = detaylar.find(d => Number(d.TFD_CARI_ID) === Number(firma.firmaId));
            const checkDate = (dateVal) => {
              if (!dateVal || dateVal.startsWith("1900-01-01") || dateVal.startsWith("0001-01-01")) return null;
              return dateVal;
            };

            return {
              ...firma,
              indirimOrani: firma.indirimOran || 0,
              kdvOrani: firma.kdvOran ?? 0,
              kdvDurum: firma.kdvDurum || "Hariç",
              teklifTarihi: checkDate(detay?.TFD_TEKLIF_TARIH),
              gecerlilikTarihi: checkDate(detay?.TFD_GECERLILIK_TARIH),
              teslimTarihi: checkDate(detay?.TFD_TESLIM_TARIH),
              teslimYeri: detay?.TFD_TESLIM_YERI || "",
              sevkSekli: Number(detay?.TFD_SEVK_SEKLI_ID) || null,
              odemeBilgisi: Number(detay?.TFD_ODEME_SEKLI_ID) || null,
              yetkili: detay?.TFD_YETKILI || "",
              telefon: detay?.TFD_TELEFON || "",
              aciklama: detay?.TFD_ACIKLAMA || "",
              toplamKDVtutar: firma.toplamKDVtutar || 0,
              toplamIndirim: firma.toplamIndirim || 0,
              genelToplam: firma.genelToplam || 0
            };
          });
          data.firmaTotaller = computeFirmaTotals(data.malzemeler, data.firmaTotaller);
        }
        return { id, ...(data || {}) };
      })
    );

    // 2. RENKLERİ HESAPLA (State yerine burada hesaplıyoruz)
    // Mevcut renkleri koruyup yenilerini ekleyeceğiz
    let guncelRenkler = { ...paketRenkleri }; 
    results.forEach((paket, paketIndex) => {
      if (!guncelRenkler[paketIndex]) {
        guncelRenkler[paketIndex] = {};
      }
      (paket.firmaTotaller || []).forEach(firma => {
        if (!guncelRenkler[paketIndex][firma.firmaId]) {
          const min = 205; const max = 230;
          const r = Math.floor(Math.random() * (max - min) + min);
          const g = Math.floor(Math.random() * (max - min) + min);
          const b = Math.floor(Math.random() * (max - min) + min);
          guncelRenkler[paketIndex][firma.firmaId] = `rgb(${r}, ${g}, ${b})`;
        }
      });
    });

    // 3. SEÇİLİ FİRMAYI HESAPLA
    // Aktif tab'a göre paket seçimi
    const currentPaketIndex = Number(activeTab) - 1;
    const currentPaket = results[currentPaketIndex];
    let fullSeciliFirmaId = null;

    if (currentPaket && currentPaket.malzemeler && currentPaket.firmaTotaller) {
        for (const firma of currentPaket.firmaTotaller) {
            const isAllSelected = currentPaket.malzemeler.every((malzeme) => {
                const firmaDetay = malzeme.firmalar.find((f) => f.firmaId === firma.firmaId);
                return firmaDetay && (firmaDetay.secili === true || firmaDetay.secili === 1);
            });
            if (isAllSelected) {
                fullSeciliFirmaId = firma.firmaId;
                break;
            }
        }
    }

    // 4. HEPSİNİ TEK SEFERDE GÜNCELLE (Batch Update)
    setPaketRenkleri(guncelRenkler);
    if (fullSeciliFirmaId !== null) {
        setSelectedFirmaId(fullSeciliFirmaId);
    }
    setPaketler(results);

  } catch (err) {
    console.error("Teklif detay hatası:", err);
    message.error("Teklif detayları alınırken hata oluştu.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Eğer disabled ise değişiklik olsa bile sorma
      if (!kaydedildi && !isDisabled) {
        e.preventDefault(); e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [kaydedildi, isDisabled]);

  const computeFirmaTotals = (malzemeler = [], firmaTotaller = []) => {
    return (firmaTotaller || []).map((firma) => {
      const araToplam = (malzemeler || []).reduce((acc, m) => {
        const f = (m.firmalar || []).find((x) => x.firmaId === firma.firmaId);
        return acc + (Number(f?.tutar ?? 0));
      }, 0);

      const indirimOrani = Number(firma.indirimOrani ?? 0);
      const indirimTutar = araToplam * (indirimOrani / 100);
      const kdvOrani = Number(firma.kdvOrani ?? 0);
      const matrah = araToplam - indirimTutar; 
      const kdvDurum = firma.kdvDurum || "Hariç";

      let kdvTutar = 0;
      let genelToplam = 0;

      if (kdvDurum === "Hariç") {
        kdvTutar = matrah * (kdvOrani / 100);
        genelToplam = matrah + kdvTutar;
      } else {
        kdvTutar = matrah - (matrah / (1 + (kdvOrani / 100)));
        genelToplam = matrah; 
      }

      return { ...firma, araToplam, indirimTutar, kdvTutar, genelToplam, kdvDurum };
    });
  };

  const handleValueChange = (paketIndex, malzemeId, firmaId, field, value) => {
    // Kanka buraya da ekledim, kilitliyse state değişmesin hiç
    if (isDisabled) return;

    setHasChanges(true); setKaydedildi(false);
    const val = value == null ? 0 : Number(value);
    setPaketler((prev) => {
      const updated = prev.map((p, idx) => {
        if (idx !== paketIndex) return p;
        const paket = { ...p };
        paket.malzemeler = (p.malzemeler || []).map((m) => {
          if (m.malzemeId !== malzemeId) return { ...m };
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
    if (isDisabled) return;

    setHasChanges(true); setKaydedildi(false);
    const girilenTutar = value == null ? 0 : Number(value);
    setPaketler((prev) => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;
        const paket = { ...p };
        const araToplam = (paket.malzemeler || []).reduce((acc, m) => {
          const f = (m.firmalar || []).find((x) => x.firmaId === firmaId);
          return acc + (Number(f?.tutar ?? 0));
        }, 0);

        let yeniOran = 0;
        if (araToplam > 0) {
          if (field === "indirimOrani") {
             yeniOran = (girilenTutar / araToplam) * 100;
          } else if (field === "kdvOrani") {
             const currentFirma = paket.firmaTotaller.find(f => f.firmaId === firmaId);
             const mevcutIndirim = araToplam * ((currentFirma?.indirimOrani || 0) / 100);
             const matrah = araToplam - mevcutIndirim;
             if (matrah > 0) yeniOran = (girilenTutar / matrah) * 100;
          }
        }
        paket.firmaTotaller = (paket.firmaTotaller || []).map((f) => {
          if (f.firmaId !== firmaId) return f;
          return { ...f, [field]: yeniOran };
        });
        paket.firmaTotaller = computeFirmaTotals(paket.malzemeler, paket.firmaTotaller);
        return paket;
      });
    });
  };

  const handleKdvRateChange = (paketIndex, firmaId, value) => {
    if (isDisabled) return;
    setHasChanges(true); setKaydedildi(false);
    const yeniOran = value == null ? 0 : Number(value);
    setPaketler((prev) => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;
        const paket = { ...p };
        paket.firmaTotaller = (paket.firmaTotaller || []).map((f) => {
            if (f.firmaId !== firmaId) return f;
            return { ...f, kdvOrani: yeniOran };
        });
        paket.firmaTotaller = computeFirmaTotals(paket.malzemeler, paket.firmaTotaller);
        return paket;
      });
    });
  };

  const handleKdvDurumChange = (paketIndex, firmaId, value) => {
    if (isDisabled) return;
    setHasChanges(true); setKaydedildi(false);
    setPaketler((prev) => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;
        const paket = { ...p };
        paket.firmaTotaller = (paket.firmaTotaller || []).map((f) => {
          if (f.firmaId !== firmaId) return f;
          return { ...f, kdvDurum: value };
        });
        paket.firmaTotaller = computeFirmaTotals(paket.malzemeler, paket.firmaTotaller);
        return paket;
      });
    });
  };

  const handleFirmaDetailChange = (paketIndex, firmaId, field, value) => {
    if (isDisabled) return;
    setHasChanges(true); setKaydedildi(false);
    setPaketler((prev) => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;
        const newPaket = { ...p };
        newPaket.firmaTotaller = (newPaket.firmaTotaller || []).map((f) => {
          if (f.firmaId !== firmaId) return f;
          return { ...f, [field]: value };
        });
        return newPaket;
      });
    });
  };

  const renderEditableSummaryCell = (paketIndex, firmaId, field, amountValue, percentValue) => {
    const isEditing = editingCell?.paketIndex === paketIndex && editingCell?.firmaId === firmaId && editingCell?.field === field;
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
        />
      );
    }
    return (
      <div 
        onClick={() => { if (!isDisabled) setEditingCell({ paketIndex, firmaId, field }); }}
        style={{ cursor: isDisabled ? "default" : "pointer", padding: "4px 8px", textAlign: "right", minHeight: "24px", display: "flex", alignItems: "center", justifyContent: "flex-end" }}
      >
        <Text>% {Number(percentValue).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
      </div>
    );
  };

  const onOnayaGonder = async (paketId) => {
    const paket = paketler.find(p => p.teklifId === paketId || p.id === paketId || p.teklifBaslik?.teklifId === paketId);
    if (!paket) { message.error("Paket bulunamadı!"); return; }
    const onayTabloId = paket.teklifId || paket.id || paket.teklifBaslik?.teklifId || 0;
    try {
      const response = await AxiosInstance.post(`/OnayaGonder`, {
        ONAY_TABLO_ID: Number(onayTabloId) || 0,
        ONAY_TABLO_KOD: fisNo || "",
        ONAY_ONYTANIM_ID: 4
      });
      if (response.data?.status_code === 200 || response.status === 200 || response.status_code === 201) {
        message.success("Teklif onaya gönderildi.");
        if (typeof onDurumGuncelle === "function") onDurumGuncelle({ teklifId: paketId, durumID: 2 });
        // Durumu güncellemek için verileri tekrar çekebiliriz veya state'i manuel güncelleyebiliriz
        const allIds = paketler.map(p => p.id || p.teklifBaslik?.teklifId);
        fetchAllTeklifler(allIds);
      } else if (response.status === 401) message.error("Yetkiniz yok.");
      else message.error("İşlem Başarısız.");
    } catch (error) { console.error(error); message.error("Hata oluştu."); }
  };

  const upsertTeklifKarsilastirma = async (paketIndex, showMessage = true) => {
    if (!paketler[paketIndex]) return;
    const paket = paketler[paketIndex];

    // --- DEĞİŞİKLİK 3: Kayıt öncesi durum kontrolü ---
    const currentDurumID = paket.teklifBaslik?.teklifDurum ?? null;
    // ------------------------------------------------

    const isEditable = (currentDurumID === 1 || currentDurumID === 4);

    if (!isEditable) {
        if(showMessage) message.warning("Bu teklif durumu nedeniyle değişiklikler kaydedilemez.");
        // Kaydedildi varsayıp çıkıyoruz ki loop'a girmesin
        setKaydedildi(true); 
        setHasChanges(false);
        return; 
    }
    // ----------------------------------------------

    const safeNumber = (val) => {
       if (val && typeof val === 'object' && val.value) return Number(val.value);
       return Number(val || 0);
    };

    const malzemelerPayload = (paket.malzemeler || []).map((m) => {
        const mappedFirmalar = (m.firmalar || []).map((f) => {
            const firmaOzet = (paket.firmaTotaller || []).find(ft => ft.firmaId === f.firmaId) || {};
            const miktar = Number(f.miktar ?? 0);
            const fiyat = Number(f.fiyat ?? 0);
            const satirBrutTutar = Number(f.tutar ?? (miktar * fiyat));
            const indirimOran = Number(firmaOzet.indirimOrani ?? 0);
            const satirIndirimTutar = satirBrutTutar * (indirimOran / 100);
            const satirNetTutar = satirBrutTutar - satirIndirimTutar;
            const kdvOran = Number(firmaOzet.kdvOrani ?? 0);
            const kdvDurumStr = firmaOzet.kdvDurum || "Hariç";
            const kdvDahilHaric = kdvDurumStr === "Dahil" ? 1 : 0; 
            let satirKdvTutar = 0;
            if (kdvDahilHaric === 1) satirKdvTutar = satirNetTutar - (satirNetTutar / (1 + (kdvOran / 100)));
            else satirKdvTutar = satirNetTutar * (kdvOran / 100);
            return {
              firmaId: f.firmaId || 0,
              miktar: miktar,
              fiyat: fiyat,
              tutar: Number(satirBrutTutar.toFixed(2)),
              secili: f.secili ? 1 : 0,
              marka: f.marka || "",
              alternatifStokId: f.alternatifStokId || 0,
              indirimOran: indirimOran,
              indirimTutar: Number(satirIndirimTutar.toFixed(2)),
              kdvOran: kdvOran,
              kdvTutar: Number(satirKdvTutar.toFixed(2)), 
              kdvDahilHaric: kdvDahilHaric
            };
        });
        return { malzemeId: m.malzemeId || 0, firmalar: mappedFirmalar };
    });

    const firmaDetaylarPayload = (paket.firmaTotaller || []).map((f) => ({
      firmaId: f.firmaId || 0,
      teklifTarihi: f.teklifTarihi || null,
      teklifGecerlilikTarihi: f.gecerlilikTarihi || null,
      teslimTarihi: f.teslimTarihi || null,
      teslimYeri: f.teslimYeri || "",
      sevkSekliId: safeNumber(f.sevkSekli),
      odemeSekliId: safeNumber(f.odemeBilgisi),
      yetkili: f.yetkili || "",
      telefon: f.telefon || "",
      aciklama: f.aciklama || "",
    }));

    const payload = {
      teklifId: paket.id || paket.teklifId || paket.teklifBaslik?.teklifId || 0,
      malzemeler: malzemelerPayload,
      firmaDetaylar: firmaDetaylarPayload,
    };

    try {
      await AxiosInstance.post("/UpsertTeklifKarsilastirma", payload);
      if (showMessage) message.success("Teklif başarıyla kaydedildi!");
      setKaydedildi(true); setHasChanges(false);
    } catch (err) { console.error(err); message.error("Hata oluştu."); }
  };

  const handleSecimChange = (paketIndex, malzemeId, firmaId, val) => {
    if (isDisabled) return;
    setHasChanges(true); setKaydedildi(false);
    setPaketler(prev => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;
        const paket = { ...p };
        paket.malzemeler = paket.malzemeler.map(m => {
          if (m.malzemeId !== malzemeId) return m;
          return {
            ...m,
            firmalar: m.firmalar.map(f => {
              if (val === "true") return { ...f, secili: f.firmaId === firmaId }; 
              else return { ...f, secili: false }; 
            }),
          };
        });
        return paket;
      });
    });
  };

  const handleMarkaChange = (paketIndex, val, malzemeId, firmaId) => {
    if (isDisabled) return;
    setHasChanges(true); setKaydedildi(false);
    setPaketler((prev) => {
      return prev.map((p, idx) => {
        if (idx !== paketIndex) return p;
        const newPaket = { ...p };
        newPaket.malzemeler = newPaket.malzemeler.map((m) => {
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
    if (isDisabled) return;
    setSelectedFirmaId(prev => prev === firmaId ? null : firmaId);
    setHasChanges(true);
    setPaketler(prev => {
      const updated = [...prev];
      const paket = updated[paketIndex];
      paket.malzemeler = (paket.malzemeler || []).map(m => ({
        ...m,
        firmalar: m.firmalar.map(f => {
          if (selectedFirmaId === firmaId) return { ...f, secili: false }; 
          return { ...f, secili: f.firmaId === firmaId }; 
        }),
      }));
      return updated;
    });
  };

  const handleTabChange = (newKey) => {
    // --- KRİTİK DÜZELTME: Eğer disabled ise hiçbir şey sorma, direkt geç ---
    if (isDisabled) {
        setActiveTab(newKey);
        setHasChanges(false); // Varsa değişikliği unut
        return;
    }
    // ----------------------------------------------------------------------

    if (hasChanges) {
      Modal.confirm({
        title: "Kaydedilmemiş Değişiklikler Var",
        content: "Diğer sekmeye geçmeden önce kaydetmek ister misiniz?",
        okText: "Kaydet ve Geç",
        cancelText: "Kaydetmeden Geç",
        onOk: async () => { await upsertTeklifKarsilastirma(aktifPaketIndex); setActiveTab(newKey); },
        onCancel: () => { setActiveTab(newKey); setHasChanges(false); },
      });
    } else { setActiveTab(newKey); }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>;

  return (
    <Card
      title={
        <span>
          Satınalma Teklif Kıyaslama -{" "}
          <a 
            onClick={() => setTalepModalOpen(true)} 
            style={{ color: "#1890ff", textDecoration: "underline", cursor: "pointer" }}
          >
            {fisNo || ""}
          </a>
          
          {aktifPaket?.teklifBaslik?.TalepLokasyon && (
             <span style={{ fontWeight: 'normal', color: '#595959' }}>
                {" "} - {aktifPaket.teklifBaslik.TalepLokasyon}
             </span>
          )}

        </span>
      }
      extra={
        <Space>
          <Button icon={<FileExcelOutlined />}>Excel</Button>
          <Button icon={<PrinterOutlined />}>Yazdır/PDF</Button>
          <Button 
            icon={<PlusOutlined />} 
            loading={saving}
            disabled={disabled || isDisabled || saving}
            onClick={async () => { setSaving(true); await upsertTeklifKarsilastirma(aktifPaketIndex, false); setSaving(false); setTedarikciModalOpen(true); }} 
          >
            Tedarikçi Ekle / Sil
          </Button>
          <Button 
            icon={<PlusOutlined />} 
            loading={saving} 
            disabled={disabled || isDisabled || saving} 
            onClick={async () => { setSaving(true); await upsertTeklifKarsilastirma(aktifPaketIndex, false); setSaving(false); setMalzemeModalOpen(true); }} 
          >
            Malzeme Ekle / Sil
          </Button>
          <Button
            icon={<SaveOutlined />}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", color: "#fff" }}
            onClick={() => upsertTeklifKarsilastirma(aktifPaketIndex)}
            loading={saving}
          >
            Teklifi Kaydet
          </Button>
          <Button
            type="primary"
    icon={isSiparis ? <UnorderedListOutlined /> : (showOnayaGonder ? <CheckCircleOutlined /> : <ShoppingCartOutlined />)}
    style={{
        backgroundColor: isSiparis ? "#fa8c16" : (showOnayaGonder ? "#52c41a" : "#00BBFF"),
        borderColor: isSiparis ? "#fa8c16" : (showOnayaGonder ? "#2BC770" : "#00BBFF"),
        color: "#fff"
    }}
    disabled={disabled || (!isSiparis && isDisabled && aktifPaketDurumID !== 3)}
    onClick={() => {
        if (isSiparis) {
            setSiparislerimOpen(true);
            return;
        }

        if (!aktifPaket) return message.error("Aktif paket bulunamadı!");
        const teklifId = aktifPaket.teklifId || aktifPaket.id || aktifPaket.teklifBaslik?.teklifId;
        
        if (showOnayaGonder) {
            if (hasChanges) {
                Modal.confirm({
                    title: "Kaydedilmemiş Değişiklikler Var",
                    content: "Onaya göndermeden önce değişiklikleri kaydetmeniz gerekiyor. Şimdi kaydedip devam etmek ister misiniz?",
                    okText: "Kaydet ve Gönder",
                    cancelText: "İptal",
                    onOk: async () => { await upsertTeklifKarsilastirma(aktifPaketIndex, false); onOnayaGonder(teklifId); }
                });
            } else { onOnayaGonder(teklifId); }
        } else { setSelectedRow(teklifId); setSiparisModalOpen(true); }
    }}
>
    {isSiparis ? "Siparişlerim" : (showOnayaGonder ? "Onaya Gönder" : "Siparişe Aktar")}
</Button>
        </Space>
      }
      bordered={false}
      style={{ width: "100%", overflowX: "auto" }}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange} defaultActiveKey="1">
        {paketler.map((paket, paketIndex) => {
          const malzemeler = paket.malzemeler || [];
          const firmalar = paket.firmaTotaller || [];

          // --- DEĞİŞİKLİK 4: Tab başlığında durumu paketten oku ---
          const durumID = paket.teklifBaslik?.teklifDurum ?? null;
          // API'den gelen durum açıklamasını kullan, yoksa hardcoded listeye bak
          const durumAciklama = paket.teklifBaslik?.STI_DURUM_ACIKLAMA || DURUM_STYLES[durumID]?.text || "";
          // --------------------------------------------------------

          const isFirmaFullSelected = (firmaId) => {
            if (malzemeler.length === 0) return false;
            return malzemeler.every(m => {
              const f = m.firmalar.find(x => x.firmaId === firmaId);
              return f && (f.secili === true || f.secili === 1); 
            });
          };

          const getFirmaColumnStyle = (firmaId, isHeader = false, isLastRow = false) => {
    const isSelected = isFirmaFullSelected(firmaId);
    const pastelColor = paketRenkleri[paketIndex]?.[firmaId] || "#fff";
    
    // Eğer hepsi seçiliyse yeşil border, değilse standart gri
    const borderColor = isSelected ? "#52c41a" : "#f0f0f0"; 
    const borderWidth = isSelected ? "2px" : "1px";
    // Seçiliyse arka planı çok hafif yeşil yapalım, değilse kendi rengi
    const backgroundColor = isSelected ? "#f6ffed" : pastelColor;

    let style = {
      backgroundColor: backgroundColor,
      borderLeft: `${borderWidth} solid ${borderColor}`,
      borderRight: `${borderWidth} solid ${borderColor}`,
    };

    if (isHeader) {
      style.borderTop = `${borderWidth} solid ${borderColor}`;
      style.borderBottom = "none"; // Header ile body arası çizgi olmasın bütünlük için
    }

    if (isLastRow && isSelected) {
      style.borderBottom = `${borderWidth} solid ${borderColor}`;
    }

    return style;
  };

          const firmaColumns = (firma) => {
             const pastelColor = paketRenkleri[paketIndex]?.[firma.firmaId] || "#fff";
             const cellStyle = getFirmaColumnStyle(firma.firmaId, false);

             const noBorderStyle = { ...cellStyle, borderLeft: 'none', borderRight: 'none' };
             return [
               {
                 title: (
                   <div style={{ backgroundColor: pastelColor, padding: "8px 0", borderRadius: 4, textAlign: "center" }}>
                     <div>{firma.firmaTanim}  <Radio checked={selectedFirmaId === firma.firmaId} onClick={() => handleRadioClick(paketIndex, firma.firmaId)} disabled={isDisabled} /></div>
                   </div>
                 ),
                 children: [
          {
            title: "Seç",
            width: 60,
            align: "center",
            onCell: () => ({ style: { ...cellStyle, borderRight: 'none' } }), // Sol border var, sağ yok
            render: (_, record) => {
              const f = record.firmalar.find((x) => x.firmaId === firma.firmaId);
              const val = f?.secili ? "true" : "false";
              return (
                <Select
                  size="small"
                  value={val}
                  style={{ width: "100%" }}
                  onChange={(v) => handleSecimChange(paketIndex, record.malzemeId, firma.firmaId, v)}
                >
                  <Option value="true"><span style={{ color: "green", fontWeight: "bold" }}>✓</span></Option>
                  <Option value="false"><span style={{ color: "red", fontWeight: "bold" }}>X</span></Option>
                </Select>
              );
            },
          },
          {
            title: "Marka",
            width: 100,
            onCell: () => ({ style: noBorderStyle }), // Ortadaki kolon, border yok
            render: (_, record) => {
              const f = record.firmalar.find((x) => x.firmaId === firma.firmaId) || {};
              return (
                <Input
                  size="small"
                  value={f.marka}
                  onChange={(e) => handleMarkaChange(paketIndex, e.target.value, record.malzemeId, firma.firmaId)}
                  disabled={isDisabled && !f.secili}
                />
              );
            },
          },
          {
            title: "Miktar",
            width: 70,
            onCell: () => ({ style: noBorderStyle }),
            render: (_, record) => {
              const f = record.firmalar.find((x) => x.firmaId === firma.firmaId) || {};
              return (
                <InputNumber
                  size="small"
                  min={0}
                  value={f.miktar}
                  onChange={(v) => handleValueChange(paketIndex, record.malzemeId, firma.firmaId, "miktar", v)}
                  disabled={isDisabled && !f.secili}
                  style={{ width: "100%" }}
                />
              );
            },
          },
          {
            title: "Birim Fiyat",
            width: 90,
            onCell: () => ({ style: noBorderStyle }),
            render: (_, record) => {
              const f = record.firmalar.find((x) => x.firmaId === firma.firmaId) || {};
              return (
                <InputNumber
                  size="small"
                  min={0}
                  value={f.fiyat}
                  onChange={(v) => handleValueChange(paketIndex, record.malzemeId, firma.firmaId, "fiyat", v)}
                  disabled={isDisabled && !f.secili}
                  style={{ width: "100%" }}
                />
              );
            },
          },
          {
            title: "Tutar",
            width: 90,
            align: "right",
            onCell: () => ({ style: { ...cellStyle, borderLeft: 'none' } }), // Sağ border var, sol yok
            render: (_, record) => {
              const f = record.firmalar.find((x) => x.firmaId === firma.firmaId) || {};
              return (
                <Text strong>
                  {Number(f.tutar).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              );
            },
          },
        ],
      },
    ];
  };

  const columns = [
    {
      title: "MALZEME", // Başlık
      key: "malzeme",
      fixed: "left",
      width: 250,
      render: (_, r) => (
        // --- BURASI GÖRSELDEKİ TASARIM ---
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {/* KOD KISMI: Gri kutucuk */}
            <span style={{ 
                backgroundColor: '#f5f5f5', 
                color: '#595959', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontSize: '11px', 
                marginBottom: '4px',
                border: '1px solid #d9d9d9',
                display: 'inline-block'
            }}>
                {r.malzemeKodu || r.stokKodu || "KOD"} {/* Backend'den gelen kod alanı */}
            </span>
            {/* İSİM KISMI: Kalın yazı */}
            <Text strong style={{ fontSize: '13px', lineHeight: '1.2' }}>
                {r.malzeme}
            </Text>
        </div>
      ),
    },
    ...firmalar.flatMap((f, index) => {
      const cols = firmaColumns(f);
      // Firmalar arası boşluk
      if (index < firmalar.length - 1) {
        return [
          ...cols,
          {
            title: "",
            dataIndex: `spacer_${f.firmaId}`,
            width: 15,
            onHeaderCell: () => ({ style: { border: "none", background: "transparent" } }),
            onCell: () => ({ style: { border: "none", background: "transparent" } }),
          },
        ];
      }
      return cols;
    }),
  ];

const dataSource = malzemeler.map((m) => ({ key: m.malzemeId, ...m }));

          return (
            <TabPane
              tab={
                <div style={{ backgroundColor: DURUM_STYLES[durumID]?.backgroundColor || "#f0f0f0", color: DURUM_STYLES[durumID]?.color || "#000", padding: "4px 12px", borderRadius: 6, fontWeight: "bold" }}>
                   {paket.teklifBaslik?.baslik || `Teklif ${paketIndex + 1}`} ({durumAciklama})
                </div>
              }
              key={`${paketIndex + 1}`}
            >
               <Table
  columns={columns}
  dataSource={dataSource}
  pagination={false}
  bordered={false} // Kenarlık çakışmasını önlemek için false yapıp css ile yönetmek gerekebilir ama şimdilik böyle kalsın
  scroll={{ x: "max-content" }}
  summary={() => {
    return (
      <>
        {/* 1. DİKEY BOŞLUK İÇİN BOŞ SATIR */}
        <Table.Summary.Row style={{ height: "30px", background: "transparent" }}>
             <Table.Summary.Cell index={0} colSpan={columns.length} style={{ border: "none" }} />
        </Table.Summary.Row>

        {/* ARA TOPLAM SATIRI */}
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}><Text strong>Ara Toplam</Text></Table.Summary.Cell>
          {firmalar.map((firma, i) => (
            <React.Fragment key={firma.firmaId}>
              <Table.Summary.Cell colSpan={5} align="right" style={{ backgroundColor: paketRenkleri[paketIndex]?.[firma.firmaId] }}>
                <Text strong>{Number(firma.araToplam).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</Text>
              </Table.Summary.Cell>
              
              {/* YATAY BOŞLUK HÜCRESİ (Son firma değilse ekle) */}
              {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
            </React.Fragment>
          ))}
        </Table.Summary.Row>

        {/* İNDİRİM SATIRI */}
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}><Text strong>İndirim</Text></Table.Summary.Cell>
          {firmalar.map((firma, i) => (
            <React.Fragment key={firma.firmaId}>
              <Table.Summary.Cell colSpan={5} align="right" style={{ backgroundColor: paketRenkleri[paketIndex]?.[firma.firmaId] }}>
                {renderEditableSummaryCell(paketIndex, firma.firmaId, "indirimOrani", firma.indirimTutar ?? 0, firma.indirimOrani ?? 0)}
              </Table.Summary.Cell>
               {/* YATAY BOŞLUK HÜCRESİ */}
               {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
            </React.Fragment>
          ))}
        </Table.Summary.Row>

        {/* KDV SATIRI (Aynı mantıkla güncelle) */}
        <Table.Summary.Row>
            <Table.Summary.Cell index={0}><Text strong>Kdv</Text></Table.Summary.Cell>
            {firmalar.map((firma, i) => (
                <React.Fragment key={firma.firmaId}>
                    <Table.Summary.Cell colSpan={5} align="right" style={{ backgroundColor: paketRenkleri[paketIndex]?.[firma.firmaId] }}>
                        {/* ...senin kdv içeriğin... */}
                        <Space>
                          {/* ...Radio, InputNumber, Text kodların aynen kalacak... */}
                          <Radio.Group 
                              size="small" 
                              options={[{ label: 'H', value: 'Hariç' }, { label: 'D', value: 'Dahil' }]}
                              value={firma.kdvDurum}
                              onChange={(e) => handleKdvDurumChange(paketIndex, firma.firmaId, e.target.value)}
                              disabled={isDisabled}
                          />
                          <InputNumber
                              min={0} max={100}
                              formatter={val => `% ${val}`}
                              parser={val => val.replace('% ', '')}
                              value={firma.kdvOrani}
                              onChange={(val) => handleKdvRateChange(paketIndex, firma.firmaId, val)}
                              disabled={isDisabled}
                              size="small"
                              style={{ width: 60 }}
                          />
                          <Text>{Number(firma.kdvTutar).toLocaleString('tr-TR', {minimumFractionDigits: 2})}</Text>
                        </Space>
                    </Table.Summary.Cell>
                    {/* YATAY BOŞLUK HÜCRESİ */}
                    {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
                </React.Fragment>
            ))}
        </Table.Summary.Row>

        {/* GENEL TOPLAM SATIRI */}
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}><Text strong>Genel Toplam</Text></Table.Summary.Cell>
          {firmalar.map((firma, i) => (
            <React.Fragment key={firma.firmaId}>
              <Table.Summary.Cell colSpan={5} align="right" style={{ backgroundColor: paketRenkleri[paketIndex]?.[firma.firmaId] }}>
                <Text strong style={{ fontSize: "1.1em" }}>
                  {Number(firma.genelToplam).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </Text>
              </Table.Summary.Cell>
              {/* YATAY BOŞLUK HÜCRESİ */}
              {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
            </React.Fragment>
          ))}
        </Table.Summary.Row>

        {/* AÇIKLAMA */}
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}><Text strong>Açıklama</Text></Table.Summary.Cell>
      {firmalar.map((f, i) => (
        <React.Fragment key={f.firmaId}>
          <Table.Summary.Cell colSpan={5} align="center" style={{ backgroundColor: paketRenkleri[paketIndex]?.[f.firmaId] }}>
            <div style={cellWrapperStyle}>
              <Input.TextArea
                value={f.aciklama}
                onChange={(e) => handleFirmaDetailChange(paketIndex, f.firmaId, 'aciklama', e.target.value)}
                autoSize={{ minRows: 1, maxRows: 3 }}
                style={componentStyle}
              />
            </div>
          </Table.Summary.Cell>
          {/* BOŞLUK HÜCRESİ */}
          {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
        </React.Fragment>
      ))}
    </Table.Summary.Row>

      {detayGosterilenPaket === paketIndex && (
  <>
    {/* Detay başlığı ile üstteki toplamlar arasına minik bir boşluk */}
    <Table.Summary.Row style={{ height: 10 }}>
        <Table.Summary.Cell colSpan={columns.length} style={{ border: 'none', background: 'transparent' }} />
    </Table.Summary.Row>

    {/* TEKLİF TARİHİ */}
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}><Text strong>Teklif Tarihi</Text></Table.Summary.Cell>
      {firmalar.map((f, i) => (
        <React.Fragment key={f.firmaId}>
          <Table.Summary.Cell colSpan={5} align="center" style={{ backgroundColor: paketRenkleri[paketIndex]?.[f.firmaId] }}>
            <div style={cellWrapperStyle}>
              <DatePicker
                format="DD.MM.YYYY"
                value={f.teklifTarihi ? dayjs(f.teklifTarihi) : null}
                onChange={(d) => handleFirmaDetailChange(paketIndex, f.firmaId, 'teklifTarihi', d ? d.toISOString() : null)}
                disabled={isDisabled}
                style={componentStyle}
              />
            </div>
          </Table.Summary.Cell>
          {/* BOŞLUK HÜCRESİ */}
          {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
        </React.Fragment>
      ))}
    </Table.Summary.Row>

    {/* GEÇERLİLİK TARİHİ */}
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}><Text strong>Geçerlilik Tarihi</Text></Table.Summary.Cell>
      {firmalar.map((f, i) => (
        <React.Fragment key={f.firmaId}>
          <Table.Summary.Cell colSpan={5} align="center" style={{ backgroundColor: paketRenkleri[paketIndex]?.[f.firmaId] }}>
            <div style={cellWrapperStyle}>
              <DatePicker
                format="DD.MM.YYYY"
                value={f.gecerlilikTarihi ? dayjs(f.gecerlilikTarihi) : null}
                onChange={(d) => handleFirmaDetailChange(paketIndex, f.firmaId, 'gecerlilikTarihi', d ? d.toISOString() : null)}
                disabled={isDisabled}
                style={componentStyle}
              />
            </div>
          </Table.Summary.Cell>
          {/* BOŞLUK HÜCRESİ */}
          {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
        </React.Fragment>
      ))}
    </Table.Summary.Row>

    {/* TESLİM TARİHİ */}
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}><Text strong>Teslim Tarihi</Text></Table.Summary.Cell>
      {firmalar.map((f, i) => (
        <React.Fragment key={f.firmaId}>
          <Table.Summary.Cell colSpan={5} align="center" style={{ backgroundColor: paketRenkleri[paketIndex]?.[f.firmaId] }}>
            <div style={cellWrapperStyle}>
              <DatePicker
                format="DD.MM.YYYY"
                value={f.teslimTarihi ? dayjs(f.teslimTarihi) : null}
                onChange={(d) => handleFirmaDetailChange(paketIndex, f.firmaId, 'teslimTarihi', d ? d.toISOString() : null)}
                disabled={isDisabled}
                style={componentStyle}
              />
            </div>
          </Table.Summary.Cell>
          {/* BOŞLUK HÜCRESİ */}
          {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
        </React.Fragment>
      ))}
    </Table.Summary.Row>

    {/* TESLİM YERİ */}
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}><Text strong>Teslim Yeri</Text></Table.Summary.Cell>
      {firmalar.map((f, i) => (
        <React.Fragment key={f.firmaId}>
          <Table.Summary.Cell colSpan={5} align="center" style={{ backgroundColor: paketRenkleri[paketIndex]?.[f.firmaId] }}>
            <div style={cellWrapperStyle}>
              <Input
                value={f.teslimYeri}
                onChange={(e) => handleFirmaDetailChange(paketIndex, f.firmaId, "teslimYeri", e.target.value)}
                disabled={isDisabled}
                style={componentStyle}
              />
            </div>
          </Table.Summary.Cell>
          {/* BOŞLUK HÜCRESİ */}
          {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
        </React.Fragment>
      ))}
    </Table.Summary.Row>

    {/* SEVK ŞEKLİ */}
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}><Text strong>Sevk Şekli</Text></Table.Summary.Cell>
      {firmalar.map((f, i) => (
        <React.Fragment key={f.firmaId}>
          <Table.Summary.Cell colSpan={5} align="center" style={{ backgroundColor: paketRenkleri[paketIndex]?.[f.firmaId] }}>
            <div style={cellWrapperStyle}>
              <div style={componentStyle}>
                <SimpleKodSelectbox
                  kodID={13071}
                  value={f.sevkSekli}
                  onChange={(val) => handleFirmaDetailChange(paketIndex, f.firmaId, "sevkSekli", val)}
                  disabled={isDisabled}
                  placeholder="Sevk Şekli Seç"
                />
              </div>
            </div>
          </Table.Summary.Cell>
          {/* BOŞLUK HÜCRESİ */}
          {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
        </React.Fragment>
      ))}
    </Table.Summary.Row>

    {/* ÖDEME BİLGİSİ */}
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}><Text strong>Ödeme Bilgisi</Text></Table.Summary.Cell>
      {firmalar.map((f, i) => (
        <React.Fragment key={f.firmaId}>
          <Table.Summary.Cell colSpan={5} align="center" style={{ backgroundColor: paketRenkleri[paketIndex]?.[f.firmaId] }}>
            <div style={cellWrapperStyle}>
              <div style={componentStyle}>
                <SimpleKodSelectbox
                  kodID={33021}
                  value={f.odemeBilgisi}
                  onChange={(val) => handleFirmaDetailChange(paketIndex, f.firmaId, "odemeBilgisi", val)}
                  disabled={isDisabled}
                  placeholder="Ödeme Bilgisi Seç"
                />
              </div>
            </div>
          </Table.Summary.Cell>
          {/* BOŞLUK HÜCRESİ */}
          {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
        </React.Fragment>
      ))}
    </Table.Summary.Row>

    {/* YETKİLİ */}
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}><Text strong>Yetkili</Text></Table.Summary.Cell>
      {firmalar.map((f, i) => (
        <React.Fragment key={f.firmaId}>
          <Table.Summary.Cell colSpan={5} align="center" style={{ backgroundColor: paketRenkleri[paketIndex]?.[f.firmaId] }}>
            <div style={cellWrapperStyle}>
              <Input
                value={f.yetkili}
                onChange={(e) => handleFirmaDetailChange(paketIndex, f.firmaId, "yetkili", e.target.value)}
                disabled={isDisabled}
                style={componentStyle}
              />
            </div>
          </Table.Summary.Cell>
          {/* BOŞLUK HÜCRESİ */}
          {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
        </React.Fragment>
      ))}
    </Table.Summary.Row>

    {/* TELEFON */}
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}><Text strong>Telefon</Text></Table.Summary.Cell>
      {firmalar.map((f, i) => (
        <React.Fragment key={f.firmaId}>
          <Table.Summary.Cell colSpan={5} align="center" style={{ backgroundColor: paketRenkleri[paketIndex]?.[f.firmaId] }}>
            <div style={cellWrapperStyle}>
              <Input
                value={f.telefon}
                onChange={(e) => handleFirmaDetailChange(paketIndex, f.firmaId, "telefon", e.target.value)}
                disabled={isDisabled}
                style={componentStyle}
              />
            </div>
          </Table.Summary.Cell>
          {/* BOŞLUK HÜCRESİ */}
          {i < firmalar.length - 1 && <Table.Summary.Cell index={0} style={{ background: "transparent", border: "none" }} />}
        </React.Fragment>
      ))}
    </Table.Summary.Row>
  </>
)}
                        </>
                    );
                 }}
               />
               <div style={{ marginTop: 10, textAlign: 'right' }}>
                   <a onClick={() => setDetayGosterilenPaket(detayGosterilenPaket === paketIndex ? null : paketIndex)}>
                       {detayGosterilenPaket === paketIndex ? "Detayı Gizle" : "Detay Gör"}
                   </a>
               </div>
            </TabPane>
          );
        })}
      </Tabs>
      
      {/* Modallar */}
      <TedarikciEkle
        visible={isTedarikciModalOpen}
        firmalar={paketler[activeTab - 1]?.firmaTotaller || []}
        teklifId={paketler[activeTab - 1]?.teklifId || paketler[activeTab - 1]?.id || paketler[activeTab - 1]?.teklifBaslik?.teklifId}
        onCancel={() => {
            setTedarikciModalOpen(false);
            const allIds = paketler.map(p => p.id || p.teklifBaslik?.teklifId);
            if(allIds.length) fetchAllTeklifler(allIds);
        }}
        onOk={(guncelFirmalar) => {
            setTedarikciModalOpen(false);
            const allIds = paketler.map(p => p.id || p.teklifBaslik?.teklifId);
            if(allIds.length) fetchAllTeklifler(allIds);
        }}
      />
      <MalzemeEkle
        visible={isMalzemeModalOpen}
        teklifId={paketler[activeTab - 1]?.teklifId || paketler[activeTab - 1]?.id || paketler[activeTab - 1]?.teklifBaslik?.teklifId}
        malzemeler={paketler[activeTab - 1]?.malzemeler?.map(m => ({ malzemeId: m.malzemeId, stokId: m.stokId, malzeme: m.malzeme })) || []}
        onCancel={() => {
            setMalzemeModalOpen(false);
            const allIds = paketler.map(p => p.id || p.teklifBaslik?.teklifId);
            if(allIds.length) fetchAllTeklifler(allIds);
        }}
      />
      <TeklifiSipariseAktar
        open={siparisModalOpen}
        onCloseModal={() => setSiparisModalOpen(false)}
        teklifId={selectedRow}
        fisId={fisId}
        onSiparisGuncelle={() => {
            if (typeof onDurumGuncelle === "function") {
               onDurumGuncelle({ teklifId: selectedRow, durumID: 5 });
            }
        }}
      />
      <Modal
  title="Siparişlerim"
  open={siparislerimOpen}
  onCancel={() => setSiparislerimOpen(false)}
  width={1100}
  footer={null}
  destroyOnClose
  centered
>
  <Siparislerim 
    selectedRows={[{ key: fisId }]}
    tableMode={true} 
    
    // TALEP NO TIKLANINCA
    onTalepClick={(record) => {
        // API'den gelen veride talep ID'si hangi alandaysa onu buraya yaz (Örn: TALEP_ID)
        // Eğer tabloda direkt TALEP_ID yoksa backend sorgusuna eklemen gerekebilir.
        if(record.TALEP_ID) {
            setTalepDetayId(record.TALEP_ID);
            setIsTalepModalOpen(true);
        } else {
            message.warning("Talep ID bulunamadı.");
        }
    }}

    // SİPARİŞ NO TIKLANINCA
    onSiparisClick={(record) => {
        // Tablodaki key zaten TB_SATINALMA_SIPARIS_ID olarak set edilmişti
        if(record.key || record.TB_SATINALMA_SIPARIS_ID) {
            setSiparisDetayId(record.key || record.TB_SATINALMA_SIPARIS_ID);
            setIsSiparisModalOpen(true);
        }
    }}
  />
</Modal>
      <MalzemeTalepModal
        drawerVisible={talepModalOpen}
        onDrawerClose={() => setTalepModalOpen(false)} 
        selectedRow={fisId ? { key: fisId } : null} 
        onRefresh={() => {
           // Gerekirse buraya yenileme fonksiyonu
        }}
      />
      <MalzemeTalepModal
  drawerVisible={isTalepModalOpen}
  onDrawerClose={() => setIsTalepModalOpen(false)}
  selectedRow={talepDetayId ? { key: talepDetayId } : null}
  onRefresh={() => {
     // Gerekirse refresh işlemleri
  }}
/>

{/* 2. Sipariş Düzenleme Modalı */}
{/* Bu component senin projendeki sipariş güncelleme ekranı olmalı */}
{isSiparisModalOpen && (
    <SatinalmaSiparisModal
        drawerVisible={isSiparisModalOpen}
        onDrawerClose={() => setIsSiparisModalOpen(false)}
        selectedRow={siparisDetayId ? { key: siparisDetayId } : null}
        onRefresh={() => {
            // Gerekirse refresh işlemleri
        }}
    />
)}
    </Card>
  );
};

export default TeklifKarsilastirma;