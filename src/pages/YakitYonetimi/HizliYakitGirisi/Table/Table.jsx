import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Progress, message, Card, Row, Col, Space, Popconfirm, Tag, Popover, Select, DatePicker, TimePicker, InputNumber } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined, SaveOutlined, RedoOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../api/http";
import { useFormContext } from "react-hook-form";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import { t } from "i18next";
import dayjs from "dayjs";
import MakineTablo from "../components/MakineTablo";
import LokasyonTablo from "../../../../utils/components/LokasyonTablo";
import ProjeTablo from "../../../../utils/components/ProjeTablo";
import PersonelTablo from "../../../../utils/components/PersonelTablo";

const { Text } = Typography;

// Function to extract text from React elements
import { isValidElement } from "react";

function extractTextFromElement(element) {
  let text = "";
  if (typeof element === "string") {
    text = element;
  } else if (Array.isArray(element)) {
    text = element.map((child) => extractTextFromElement(child)).join("");
  } else if (isValidElement(element)) {
    text = extractTextFromElement(element.props.children);
  } else if (element !== null && element !== undefined) {
    text = element.toString();
  }
  return text;
}

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  // tabloyu genişletmek için kullanılan alanın stil özellikleri
  const handleStyle = {
    position: "absolute",
    bottom: 0,
    right: "-5px",
    width: "20%",
    height: "100%", // this is the area that is draggable, you can adjust it
    zIndex: 2, // ensure it's above other elements
    cursor: "col-resize",
    padding: "0px",
    backgroundSize: "0px",
  };

  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={handleStyle}
        />
      }
      onResize={onResize}
      draggableOpts={{
        enableUserSelectHack: false,
      }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const DraggableRow = ({ id, text, index, moveRow, className, style, visible, onVisibilityChange, ...restProps }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const styleWithTransform = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <div ref={setNodeRef} style={styleWithTransform} {...restProps} {...attributes}>
      <div
        {...listeners}
        style={{
          cursor: "grab",
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <HolderOutlined style={{ marginRight: 8 }} />
        {text}
      </div>
    </div>
  );
};

const MainTable = () => {
  // State definitions...
  const { control, setValue, watch, formState: { errors } } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClock, setSelectedClock] = useState(null);
  const [defaultPrice, setDefaultPrice] = useState("");
  const [fuelTank, setFuelTank] = useState("");
  const [checkedOne, setCheckedOne] = useState(false);
  const [checkedTwo, setCheckedTwo] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [label, setLabel] = useState("Yükleniyor...");
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [xlsxLoading, setXlsxLoading] = useState(false);
  const [status, setStatus] = useState(true);

  const [selectedMachines, setSelectedMachines] = useState([]);

  const ekipmanOptions = [
    { value: "MKN00005", label: "MKN00005 - CB-224E Asfalt Silindiri", tipi: "Asfalt Silindiri", yakit: "Motorin", lokasyon: "Gölet İnşaatı" }
  ];

  const aktifEkipmanDetay = useMemo(() => {
    return ekipmanOptions.find(e => e.value === selectedMachines) || { tipi: "-", yakit: "-", lokasyon: "-" };
  }, [selectedMachines]);

  const tutar = useMemo(() => {
    return ((defaultPrice || 0) * (searchTerm ? parseFloat(searchTerm) : 0)).toFixed(2); // miktar için mevcut bir state ya da searchTerm kullanabilirsin
  }, [searchTerm, defaultPrice]);

  const [body, setBody] = useState({
    filters: {
      Kelime: "",
    },
    LokasyonIds: [],
    YakitTipIds: []
  });

  const [selectedProject, setSelectedProject] = useState(undefined);
  const [selectedDriver, setSelectedDriver] = useState(undefined);
  const [description, setDescription] = useState("");

  const [yakitTanklari, setYakitTanklari] = useState([]);
  const [tankLoading, setTankLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const ozelAlanlar = JSON.parse(localStorage.getItem("ozelAlanlar"));

  // Özel Alanların nameleri backend çekmek için api isteği sonu

  const statusTag = (statusId) => {
    switch (statusId) {
      case 1:
        return { color: "#ff5e00", text: "Onay Bekliyor" };
      case 2:
        return { color: "#00d300", text: "Onaylandı" };
      case 3:
        return { color: "#d10000", text: "Onaylanmadı" };
      default:
        return { color: "", text: "" }; // Diğer durumlar için boş değer
    }
  };

  const fetchYakitTankData = async () => {
    try {
      setTankLoading(true);
    
      // Güvenli payload kontrolü
      const payload = {
        LokasyonIds: body?.LokasyonIds || [],
        YakitTipIds: body?.YakitTipIds || [],
        Durum: 1
      };

      const response = await AxiosInstance.post(`GetYakitTankList`, payload);

      // Backend yapına göre response veya response.data üzerinden array kontrolü
      if (response && response.has_error === false && Array.isArray(response.data)) {
        // 🌟 Select bileşeninin okuyabilmesi için value ve label mapping'i yapıyoruz
        const formattedOptions = response.data.map((item) => ({
          value: item.TB_DEPO_ID, // Select seçtiğinde state'e ID'si düşecek
          // Ekranda kod ve tanım beraber profesyonel dursun diye (Örn: TAN0162 - 102 OKTAN)
          label: `${item.DEP_KOD || ""} - ${item.DEP_TANIM || ""}`.trim() || `Depo ID: ${item.TB_DEPO_ID}`,
        }));
      
        setYakitTanklari(formattedOptions);
      } else {
        console.error("API yanıtı beklenen formatta değil veya hata var.", response);
        setYakitTanklari([]);
      }
    } catch (error) {
      console.error("Yakit tankı çekme hatası:", error);
      message.error("Yakıt tankları listesi çekilemedi.");
    } finally {
      setTankLoading(false);
    }
  };

  useEffect(() => {
    fetchYakitTankData();
  }, [body?.LokasyonIds, body?.YakitTipIds, status]);

  const handleSaveTopluYakitGiris = async () => {
    if (selectedMachines.length === 0) {
      message.warning("Kaydedilecek ekipman kaydı bulunamadı.");
      return;
    }

    try {
      setSaveLoading(true);

      // Yeni bir istek başlatıldığı için önce mevcut tüm açıklamalardaki hata yazılarını temizliyoruz kanka
      const clearedMachines = selectedMachines.map(item => ({
        ...item,
        ACIKLAMA: item.ACIKLAMA.startsWith("HATA:") ? "" : item.ACIKLAMA
      }));

      // Backend'e gidecek payload array'ini hazırlıyoruz
      const payload = clearedMachines.map((item, index) => ({
        RowIndex: index + 1,
        MakineKodu: item.EKIPMAN_KOD,
        MakineId: item.EKIPMAN_ID,
        Tarih: item.TARiH ? dayjs(item.TARiH).format("YYYY-MM-DD") : null,
        Saat: item.SAAT || null,
        SonAlinanKm: item.SON_ALINAN != null ? parseFloat(item.SON_ALINAN) : 0,
        AlinanKm: item.YENI_ALINAN_KM != null ? parseFloat(item.YENI_ALINAN_KM) : 0, // Kullanıcının girdiği yeni KM
        Miktar: item.MiKTAR != null ? parseFloat(item.MiKTAR) : 0,
        Fiyat: item.FiYAT != null ? parseFloat(item.FiYAT) : 0,
        Tutar: item.TUTAR != null ? parseFloat(item.TUTAR) : 0,
        StokKullanim: !!item.STOK_KULLANIM,
        DepoId: item.YAKIT_TANKI || null, // Seçilen yakıt tankı ID'si
        YakitTipId: item.YAKIT_TIPI_ID || null, // Makine seçiminden gelen yakıt tip ID'si
        IstasyonKodId: null, // Proje kapsamına göre statik ya da dinamik bağlanabilir
        PersonelId: item.SURUCU_ID || null,
        FullDepo: !!item.FULL_DEPO,
        FirmaId: 1, // Örnek JSON'daki default firma ID
        LokasyonId: item.LOKASYON_ID || null,
        ProjeId: item.PROJE_ID || null,
        Aciklama: item.ACIKLAMA || "",
        FaturaNo: null,
        FaturaTarihi: null
      }));

      const response = await AxiosInstance.post("AddTopluYakitGiris", payload);

      if (response && response.has_error === false) {
        message.success(response.status || "Kayıtlar başarıyla oluşturuldu.");
        setSelectedMachines([]); // Başarılıysa tabloyu sıfırla kanka
      } else if (response && response.has_error === true) {
        message.error(response.status || "Bazı kayıtlarda hatalar tespit edildi.");
        
        // 🌟 Hata listesini satırlara dağıtma sihirli dokunuşu
        if (Array.isArray(response.error_list)) {
          setSelectedMachines(clearedMachines.map(item => {
            // error_list içinden bu makine koduna ait bir hata var mı bakıyoruz
            const bulunanHata = response.error_list.find(err => err.MakineKodu === item.EKIPMAN_KOD);
            if (bulunanHata) {
              return {
                ...item,
                // Açıklama alanının başına kırmızı uyarı maksatlı HATA ibaresi ekliyoruz
                ACIKLAMA: `HATA: ${bulunanHata.HataMesaji}`
              };
            }
            return item;
          }));
        }
      }
    } catch (error) {
      console.error("Toplu kayıt esnasında hata oluştu:", error);
      message.error(error.message || "Sistemsel bir hata oluştu.");
    } finally {
      setSaveLoading(false);
    }
  };

  const initialColumns = [
  {
  title: "Ekipman Kodu / Tanımı",
  dataIndex: "EKIPMAN_KOD",
  key: "EKIPMAN_KOD",
  width: 280,
  visible: true,
  fixed: "left",
  render: (text, record) => {
    if (record.isNewRow) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <MakineTablo
                control={control}
                errors={errors}
                setValue={setValue}
                makineFieldName="MKN_KOD_temp"
                makineIdFieldName="TB_MAKINE_ID_temp"
                secilenMakineIdleri={selectedMachines.map(m => m.TB_MAKINE_ID || m.key?.split('_')[3])}
                onMakinelerSecildi={(secilenMakinelerDizisi) => {
                  const yeniSatirlar = secilenMakinelerDizisi.map((makine, index) => {
                    const rowKey = `row_${Date.now()}_${index}_${makine.TB_MAKINE_ID}`;
                    
                    // Eğer makineden lokasyon geliyorsa form context'e de yazalım kanka
                    if (makine.MKN_LOKASYON) {
                      setValue(`LOK_TANIM_${rowKey}`, makine.MKN_LOKASYON);
                      setValue(`LOK_ID_${rowKey}`, makine.MKN_LOKASYON_ID || "");
                    }

                    return {
                      key: rowKey,
                      isNewRow: false,
                      EKIPMAN_ID: makine.TB_MAKINE_ID,
                      EKIPMAN_KOD: makine.MKN_KOD,
                      EKIPMAN_TANIM: makine.MKN_TANIM,
                      EKIPMAN_TIPI: makine.MKN_TIP || "-", 
                      YAKIT_TIPI: makine.MKN_YAKIT_TIPI || "-",
                      LOKASYON: makine.MKN_LOKASYON || "", 
                      LOKASYON_ID: makine.MKN_LOKASYON_ID || "",
                      SON_ALINAN: makine.SON_ALINAN_KM,
                      BIRIM: makine.SAYAC_BIRIM || "-",
                      TARiH: dayjs().format("YYYY-MM-DD"),
                      SAAT: dayjs().format("HH:mm"),
                      MiKTAR: 0,
                      FiYAT: defaultPrice || 0,
                      TUTAR: 0,
                      FULL_DEPO: checkedTwo,
                      STOK_KULLANIM: checkedOne,
                      YAKIT_TANKI: fuelTank || undefined,
                      PROJE: undefined,
                      PROJE_ID: undefined,
                      SURUCU: undefined,
                      ACIKLAMA: ""
                    };
                  });

                  setSelectedMachines(prev => {
                    const temizListe = prev.filter(item => !item.isNewRow);
                    return [...temizListe, ...yeniSatirlar];
                  });

                  setValue("MKN_KOD_temp", "");
                  setValue("TB_MAKINE_ID_temp", "");
                }}
              />
        </div>
      );
    }

    return (
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Input value={record.EKIPMAN_KOD} style={{ width: "100%" }} disabled />
        <Button disabled>+</Button>
        <Button onClick={() => {
          setSelectedMachines(prev => prev.filter(item => item.key !== record.key));
        }}>-</Button>
      </div>
    );
  }
},
  {
    title: "Ekipman Tipi",
    dataIndex: "EKIPMAN_TIPI",
    key: "EKIPMAN_TIPI",
    width: 120,
    visible: true,
    fixed: "left", // 🌟 Sola sabitlendi
    render: (text, record) => record.isNewRow ? "-" : <Input value={record.EKIPMAN_TIPI} disabled />
  },
  {
    title: "Yakıt Tipi",
    dataIndex: "YAKIT_TIPI",
    key: "YAKIT_TIPI",
    width: 120,
    visible: true,
    fixed: "left", // 🌟 Sola sabitlendi
    render: (text, record) => record.isNewRow ? "-" : <Input value={record.YAKIT_TIPI} disabled />
  },
  {
    title: "Tarih",
    dataIndex: "TARiH",
    key: "TARiH",
    width: 160,
    visible: true,
    render: (text, record) => {
      if (record.isNewRow) return <DatePicker style={{ width: "100%" }} placeholder="Tarih seç" />;
      return (
        <DatePicker
          style={{ width: "100%" }}
          format="DD.MM.YYYY"
          value={record.TARiH ? dayjs(record.TARiH) : null}
          onChange={(date, dateString) => {
            setSelectedMachines(prev => prev.map(item => 
              item.key === record.key ? { ...item, TARiH: dateString } : item
            ));
          }}
        />
      );
    }
  },
  {
    title: "Saat",
    dataIndex: "SAAT",
    key: "SAAT",
    width: 130,
    visible: true,
    render: (text, record) => {
      if (record.isNewRow) return <TimePicker style={{ width: "100%" }} placeholder="Zaman" />;
      return (
        <TimePicker
          style={{ width: "100%" }}
          format="HH:mm"
          value={record.SAAT ? dayjs(record.SAAT, "HH:mm") : null}
          onChange={(time, timeString) => {
            setSelectedMachines(prev => prev.map(item => 
              item.key === record.key ? { ...item, SAAT: timeString } : item
            ));
          }}
        />
      );
    }
  },
  {
  title: "Son Alınan",
  dataIndex: "SON_ALINAN",
  key: "SON_ALINAN",
  width: 110, // Formatlı hali sığsın diye genişliği azıcık artırdım kanka
  visible: true,
  render: (text, record) => {
    if (record.isNewRow) return "";
    return (
      <InputNumber
        value={record.SON_ALINAN ?? 3000}
        style={{ width: "100%" }}
        disabled
        // 🌟 Sayıyı yerel ayarlara göre noktayla ayırır (Örn: 3.000)
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
      />
    );
  }
},
{
      title: "Yeni Alınan", // 🌟 JSON validasyonuna giden AlinanKm alanı için eklediğimiz yeni giriş kolonu
      dataIndex: "YENI_ALINAN_KM",
      key: "YENI_ALINAN_KM",
      width: 130,
      visible: true,
      render: (text, record) => {
        if (record.isNewRow) return <InputNumber style={{ width: "100%" }} disabled />;
        return (
          <InputNumber
            style={{ width: "100%", borderColor: "#0091ff" }}
            min={0}
            placeholder="Güncel Değer"
            value={record.YENI_ALINAN_KM}
            onChange={(val) => {
              setSelectedMachines(prev => prev.map(item => 
                item.key === record.key ? { ...item, YENI_ALINAN_KM: val } : item
              ));
            }}
          />
        );
      }
    },
  {
    title: "Birim",
    dataIndex: "BIRIM",
    key: "BIRIM",
    width: 90,
    visible: true,
    render: (text, record) => record.isNewRow ? "" : <Input value={record.BIRIM} disabled />
  },
  {
    title: "Miktar",
    dataIndex: "MiKTAR",
    key: "MiKTAR",
    width: 140,
    visible: true,
    render: (text, record) => {
      if (record.isNewRow) return <InputNumber style={{ width: "100%" }} placeholder="0,00" />;
      return (
        <InputNumber
          style={{ width: "100%", borderColor: "#ffcc00" }}
          min={0}
          value={record.MiKTAR}
          onChange={(val) => {
            setSelectedMachines(prev => prev.map(item => {
              if (item.key === record.key) {
                const yeniTutar = ((val || 0) * (item.FiYAT || 0)).toFixed(2);
                return { ...item, MiKTAR: val, TUTAR: yeniTutar };
              }
              return item;
            }));
          }}
        />
      );
    }
  },
  {
  title: "Fiyat",
  dataIndex: "FiYAT",
  key: "FiYAT",
  width: 140,
  visible: true,
  render: (text, record) => {
    if (record.isNewRow) return <InputNumber style={{ width: "100%" }} />;
    return (
      <InputNumber
        style={{ width: "100%" }}
        min={0}
        value={record.FiYAT}
        suffix={<DollarOutlined style={{ color: "#0091ff" }} />}
        
        // 🌟 KURUŞ VE VİRGÜL AYARLARI BURASI
        decimalSeparator="," // Ondalık işareti virgül olsun (Örn: 64,43)
        step={0.01}          // Yukarı/aşağı butonları kuruş kuruş artsın
        precision={2}        // Virgülden sonra kesinlikle 2 hane (kuruş) zorunlu olsun
        
        onChange={(val) => {
          setSelectedMachines(prev => prev.map(item => {
            if (item.key === record.key) {
              // val float veya null gelebilir, 0 kontrolü yapıyoruz kanka
              const gecerliFiyat = val || 0;
              const gecerliMiktar = item.MiKTAR || 0;
              
              // Tutarı kuruşu kuruşuna çarparak hesaplayıp iki hane ondalık string yapıyoruz
              const yeniTutar = (gecerliMiktar * gecerliFiyat).toFixed(2);
              
              return { ...item, FiYAT: gecerliFiyat, TUTAR: yeniTutar };
            }
            return item;
          }));
        }}
      />
    );
  }
},
  {
    title: "Tutar",
    dataIndex: "TUTAR",
    key: "TUTAR",
    width: 140,
    visible: true,
    render: (text, record) => {
      if (record.isNewRow) return <InputNumber style={{ width: "100%" }} />;
      return <InputNumber style={{ width: "100%" }} disabled value={record.TUTAR} />;
    }
  },
  {
    title: "Full Depo",
    dataIndex: "FULL_DEPO",
    key: "FULL_DEPO",
    width: 90,
    align: "center",
    visible: true,
    render: (checked, record) => {
      if (record.isNewRow) return <Checkbox />;
      return (
        <Checkbox
          checked={record.FULL_DEPO}
          onChange={(e) => {
            setSelectedMachines(prev => prev.map(item => 
              item.key === record.key ? { ...item, FULL_DEPO: e.target.checked } : item
            ));
          }}
        />
      );
    }
  },
  {
    title: "Stok Kullanım",
    dataIndex: "STOK_KULLANIM",
    key: "STOK_KULLANIM",
    width: 110,
    align: "center",
    visible: true,
    render: (checked, record) => {
      if (record.isNewRow) return <Checkbox />;
      return (
        <Checkbox
          checked={record.STOK_KULLANIM}
          onChange={(e) => {
            setSelectedMachines(prev => prev.map(item => 
              item.key === record.key ? { ...item, STOK_KULLANIM: e.target.checked } : item
            ));
          }}
        />
      );
    }
  },
  {
  title: "Yakıt Tankı",
  dataIndex: "YAKIT_TANKI",
  key: "YAKIT_TANKI",
  width: 180,
  visible: true,
  render: (text, record) => {
    if (record.isNewRow) return <Select style={{ width: "100%" }} placeholder="Seçiniz" />;;
    return (
      <Select
        style={{ width: "100%" }}
        // 🌟 record'dan gelen güncel değeri okuyor (Hem yukardan toplu gelen hem de el ile seçilen)
        value={record.YAKIT_TANKI || undefined} 
        placeholder="Seçiniz"
        showSearch
        optionFilterProp="label"
        options={yakitTanklari} 
        onChange={(val) => {
          // 🌟 SATIR BAZLI ÖZEL SEÇİM: Sadece tıklanan satırın tankını değiştirir
          setSelectedMachines(prev => prev.map(item => 
            item.key === record.key ? { ...item, YAKIT_TANKI: val } : item
          ));
        }}
      />
    );
  }
},
  {
      title: "Lokasyon",
      dataIndex: "LOKASYON",
      key: "LOKASYON",
      width: 220,
      visible: true,
      render: (text, record) => {
        if (record.isNewRow) return "-";

        // Eğer makineden lokasyon gelmediyse, kullanıcı kendi seçebilsin diye LokasyonTablo componentini çağırıyoruz
        return (
          <LokasyonTablo
            workshopSelectedId={record.LOKASYON_ID}
            lokasyonFieldName={`LOK_TANIM_${record.key}`}
            lokasyonIdFieldName={`LOK_ID_${record.key}`}
            placeholder="Lokasyon Seçiniz"
            onSubmit={(selectedData) => {
              setSelectedMachines(prev => prev.map(item => 
                item.key === record.key 
                  ? { ...item, LOKASYON: selectedData.LOK_TANIM, LOKASYON_ID: selectedData.key } 
                  : item
              ));
            }}
            onClear={() => {
              setSelectedMachines(prev => prev.map(item => 
                item.key === record.key ? { ...item, LOKASYON: "", LOKASYON_ID: "" } : item
              ));
            }}
          />
        );
      }
    },
    {
      title: "Proje",
      dataIndex: "PROJE",
      key: "PROJE",
      width: 220,
      visible: true,
      render: (text, record) => {
        if (record.isNewRow) return "-";
        return (
          <ProjeTablo
            workshopSelectedId={record.PROJE_ID}
            name1={`PROJE_${record.key}`} // Satırlar çakışmasın diye dinamik name verdik kanka
            onSubmit={(selectedData) => {
              setSelectedMachines(prev => prev.map(item => 
                item.key === record.key 
                  ? { ...item, PROJE: selectedData.PRJ_TANIM, PROJE_ID: selectedData.TB_PROJE_ID } 
                  : item
              ));
            }}
          />
        );
      }
    },
  {
      title: "Sürücü / Operatör",
      dataIndex: "SURUCU",
      key: "SURUCU",
      width: 220, // 🌟 Component butonları sığsın diye genişliği azıcık artırdım kanka
      visible: true,
      render: (text, record) => {
        if (record.isNewRow) return "-";
        return (
          <PersonelTablo
            workshopSelectedId={record.SURUCU_ID}
            name1={`SURUCU_${record.key}`} // 🌟 Her satıra özel benzersiz name alanı
            onSubmit={(selectedData) => {
              setSelectedMachines(prev => prev.map(item => 
                item.key === record.key 
                  ? { ...item, SURUCU: selectedData.PRS_ISIM, SURUCU_ID: selectedData.TB_PERSONEL_ID } 
                  : item
              ));
            }}
          />
        );
      }
    },
  {
      title: "Açıklama",
      dataIndex: "ACIKLAMA",
      key: "ACIKLAMA",
      width: 280, // 🌟 Hata mesajı sığsın diye genişliği biraz daha açtım kanka
      visible: true,
      render: (text, record) => {
        if (record.isNewRow) return "-";
        
        // Eğer açıklama API hatası içeriyorsa input rengini kırmızı yapıyoruz dikkat çekmesi için
        const isError = record.ACIKLAMA?.startsWith("HATA:");
        
        return (
          <Input
            placeholder="Açıklama giriniz..."
            value={record.ACIKLAMA}
            style={isError ? { borderColor: "#ff4d4f", color: "#ff4d4f", backgroundColor: "#fff2f0" } : {}}
            onChange={(e) => {
              setSelectedMachines(prev => prev.map(item => 
                item.key === record.key ? { ...item, ACIKLAMA: e.target.value } : item
              ));
            }}
          />
        );
      }
    },
  ];

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long"; // Tam ad ("January")
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short"; // Üç harfli kısaltma ("Jan")
    } else {
      monthFormat = "2-digit"; // Sayısal gösterim ("01")
    }

    // Kullanıcı için tarihi formatla
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const formatTime = (time) => {
    if (!time || time.trim() === "") return ""; // `trim` metodu ile baştaki ve sondaki boşlukları temizle

    try {
      // Saati ve dakikayı parçalara ayır, boşlukları temizle
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());

      // Saat ve dakika değerlerinin geçerliliğini kontrol et
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
        // throw new Error("Invalid time format"); // hata fırlatır ve uygulamanın çalışmasını durdurur
        console.error("Invalid time format:", time);
        // return time; // Hatalı formatı olduğu gibi döndür
        return ""; // Hata durumunda boş bir string döndür
      }

      // Geçerli tarih ile birlikte bir Date nesnesi oluştur ve sadece saat ve dakika bilgilerini ayarla
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);

      // Kullanıcının lokal ayarlarına uygun olarak saat ve dakikayı formatla
      // `hour12` seçeneğini belirtmeyerek Intl.DateTimeFormat'ın kullanıcının yerel ayarlarına göre otomatik seçim yapmasına izin ver
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
        // hour12 seçeneği burada belirtilmiyor; böylece otomatik olarak kullanıcının sistem ayarlarına göre belirleniyor
      });

      // Formatlanmış saati döndür
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return ""; // Hata durumunda boş bir string döndür
      // return time; // Hatalı formatı olduğu gibi döndür
    }
  };

  // ana tablo api isteği için kullanılan useEffect

  const lastRequestRef = useRef(null);

  // Data veya searchTerm değiştiğinde tablo verisini günceller
  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return data;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(
      (item) =>
        (item.YAKIT_KOD && item.YAKIT_KOD.toLowerCase().includes(lowerSearch)) ||
        (item.YAKIT_TANIM && item.YAKIT_TANIM.toLowerCase().includes(lowerSearch))
    );
  }, [data, searchTerm]);

  // sayfalama için kullanılan useEffect
  const handleTableChange = (pagination) => {
    if (pagination) {
      setCurrentPage(pagination.current);
      setPageSize(pagination.pageSize);
    }
  };
  // sayfalama için kullanılan useEffect son

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length > 0) {
      setValue("selectedLokasyonId", newSelectedRowKeys[0]);
    } else {
      setValue("selectedLokasyonId", null);
    }
    // Seçilen satırların verisini bul
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows); // Seçilen satırların verilerini state'e ata
    console.log("Seçilen Satırlar:", newSelectedRows);
  };

  const refreshTableData = useCallback(() => {
  // 1. Üst taraftaki filtre ve varsayılan değerleri sıfırla
  setSelectedDate("");
  setSelectedClock("");
  setDefaultPrice(null);
  setFuelTank("");
  setCheckedOne(false);
  setCheckedTwo(false);

  // 2. Tablo verilerini ve seçilen makineleri temizle
  setSelectedMachines([]);
  setSelectedRowKeys([]);
  setSelectedRows([]);

  // 3. Form Context (react-hook-form) alanlarını temizle
  setValue("MKN_KOD_temp", "");
  setValue("TB_MAKINE_ID_temp", "");

  // 4. Eğer backend'den veri çekiyorsan arama terimini ve sayfayı sıfırla
  setSearchTerm("");
  setCurrentPage(1);
  setBody({
    filters: {
      Kelime: "",
    },
  });
}, [setValue]);

  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnHizliYakitGirisiOrder");
    const savedVisibility = localStorage.getItem("columnYakitGirisiVisibility");
    const savedWidths = localStorage.getItem("columnYakitGirisiWidths");

    let order = savedOrder ? JSON.parse(savedOrder) : [];
    let visibility = savedVisibility ? JSON.parse(savedVisibility) : {};
    let widths = savedWidths ? JSON.parse(savedWidths) : {};

    initialColumns.forEach((col) => {
      if (!order.includes(col.key)) {
        order.push(col.key);
      }
      if (visibility[col.key] === undefined) {
        visibility[col.key] = col.visible;
      }
      if (widths[col.key] === undefined) {
        widths[col.key] = col.width;
      }
    });

    localStorage.setItem("columnYakitGirisiOrder", JSON.stringify(order));
    localStorage.setItem("columnYakitGirisiVisibility", JSON.stringify(visibility));
    localStorage.setItem("columnYakitGirisiWidths", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      // Eğer column undefined ise (eski localStorage verisi yüzünden), null döndürüyoruz.
      return column ? { ...column, visible: visibility[key], width: widths[key] } : null;
    }).filter(Boolean); // Null değerleri diziden temizliyoruz.
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnYakitGirisiOrder", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnYakitGirisiVisibility",
      JSON.stringify(
        columns.reduce(
          (acc, col) => ({
            ...acc,
            [col.key]: col.visible,
          }),
          {}
        )
      )
    );
    localStorage.setItem(
      "columnYakitGirisiWidths",
      JSON.stringify(
        columns.reduce(
          (acc, col) => ({
            ...acc,
            [col.key]: col.width,
          }),
          {}
        )
      )
    );
  }, [columns]);
  // sütunları local storage'a kaydediyoruz sonu

  // sütunların boyutlarını ayarlamak için kullanılan fonksiyon
  const handleResize =
    (key) =>
    (_, { size }) => {
      setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, width: size.width } : col)));
    };

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  const mergedColumns = columns.map((col) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(column.key),
    }),
  }));

  // fitrelenmiş sütunları birleştiriyoruz ve sadece görünür olanları alıyoruz ve tabloya gönderiyoruz

  const filteredColumns = mergedColumns.filter((col) => col.visible);

  // fitrelenmiş sütunları birleştiriyoruz ve sadece görünür olanları alıyoruz ve tabloya gönderiyoruz sonu

  // sütunların sıralamasını değiştirmek için kullanılan fonksiyon

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((column) => column.key === active.id);
      const newIndex = columns.findIndex((column) => column.key === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setColumns((columns) => arrayMove(columns, oldIndex, newIndex));
      } else {
        console.error(`Column with key ${active.id} or ${over.id} does not exist.`);
      }
    }
  };

  // sütunların sıralamasını değiştirmek için kullanılan fonksiyon sonu

  // sütunların görünürlüğünü değiştirmek için kullanılan fonksiyon

  const toggleVisibility = (key, checked) => {
    const index = columns.findIndex((col) => col.key === key);
    if (index !== -1) {
      const newColumns = [...columns];
      newColumns[index].visible = checked;
      setColumns(newColumns);
    } else {
      console.error(`Column with key ${key} does not exist.`);
    }
  };

  // sütunların görünürlüğünü değiştirmek için kullanılan fonksiyon sonu

  // sütunları sıfırlamak için kullanılan fonksiyon

  function resetColumns() {
    localStorage.removeItem("columnOrder");
    localStorage.removeItem("columnVisibility");
    localStorage.removeItem("columnWidths");
    localStorage.removeItem("ozelAlanlar");
    window.location.reload();
  }

  // sütunları sıfırlamak için kullanılan fonksiyon sonu

  // Function to handle CSV download
  const handleDownloadXLSX = async () => {
    try {
      // İndirme işlemi başlıyor
      setXlsxLoading(true);

      // Body state'inden filtreleri alıyoruz
      const { filters = {} } = body || {};

      // ✅ API İsteği: GetMalzemeTalepleriExcel
      // Filtreleri body olarak gönderiyoruz
      const response = await AxiosInstance.post("GetMalzemeTalepleriExcel", filters);

      // Gelen yanıtı kontrol et (Direkt array mi yoksa obje içinde mi?)
      // Eğer ana tablo yapısına benziyorsa response.talep_listesi olabilir, 
      // direkt liste dönüyorsa response kendisidir.
      const dataToProcess = Array.isArray(response) 
        ? response 
        : (response?.talep_listesi || response?.items || []);

      if (dataToProcess.length > 0) {
        // Verileri işliyoruz
        const xlsxData = dataToProcess.map((row) => {
          let xlsxRow = {};
          filteredColumns.forEach((col) => {
            const key = col.dataIndex;
            if (key) {
              let value = row[key];

              // Özel durumları ele alıyoruz (Formatlama işlemleri)
              if (col.render) {
                if (key === "DUZENLEME_TARIH" || key.endsWith("_TARIH") || key === "SFS_TARIH") {
                  value = formatDate(value);
                } else if (key === "DUZENLEME_SAAT" || key.endsWith("_SAAT") || key === "SFS_SAAT") {
                  value = formatTime(value);
                } else if (key === "GARANTI") {
                  value = row.GARANTI ? "Evet" : "Hayır";
                } else if (key === "TAMAMLANMA") {
                  value = `${row.TAMAMLANMA}%`;
                } else if (key === "SFS_DURUM") { // Durum metnini al
                  value = row.SFS_DURUM; 
                } else if (key === "ISM_ONAY_DURUM") {
                  const { text } = statusTag(row.ISM_ONAY_DURUM);
                  value = text;
                } else if (key.startsWith("OZEL_ALAN_")) {
                  value = row[key];
                } else {
                  // Diğer sütunlar için render fonksiyonundan metni çıkar
                  // extractTextFromElement fonksiyonun zaten yukarıda tanımlıydı
                  value = extractTextFromElement(col.render(row[key], row));
                }
              }

              xlsxRow[extractTextFromElement(col.title)] = value;
            }
          });
          return xlsxRow;
        });

        // XLSX dosyasını oluşturuyoruz
        const worksheet = XLSX.utils.json_to_sheet(xlsxData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Yakıt Tanımları Listesi");

        // Sütun genişliklerini ayarlıyoruz
        const headers = filteredColumns
          .map((col) => {
            let label = extractTextFromElement(col.title);
            return {
              label: label,
              key: col.dataIndex,
              width: col.width, // Tablo sütun genişliği
            };
          })
          .filter((col) => col.key);

        const scalingFactor = 0.8; 

        worksheet["!cols"] = headers.map((header) => ({
          wpx: header.width ? header.width * scalingFactor : 100, 
        }));

        // İndirme işlemini başlatıyoruz
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Malzeme_Talepleri_${dayjs().format("DD_MM_YYYY")}.xlsx`); // Dosya ismine tarih ekledim
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setXlsxLoading(false);
      } else {
        message.warning("İndirilecek veri bulunamadı.");
        setXlsxLoading(false);
      }
    } catch (error) {
      setXlsxLoading(false);
      console.error("XLSX indirme hatası:", error);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <DatePicker
            style={{ width: "200px" }}
            placeholder="Tarih seçiniz..."
            value={selectedDate ? dayjs(selectedDate) : null} 
            onChange={(date, dateString) => {
              setSelectedDate(dateString || ""); 
            }}
            suffixIcon={<CalendarOutlined style={{ color: "#0091ff" }} />}
          />
          <TimePicker
            style={{ width: "200px" }}
            placeholder="Saat seçiniz..."
            format="HH:mm" // Kullanıcının göreceği ve state'e kaydolacak format (Örn: 14:30)
            value={selectedClock ? dayjs(selectedClock, "HH:mm") : null}
            onChange={(time, timeString) => {
              setSelectedClock(timeString || "");
            }}
            suffixIcon={<ClockCircleOutlined style={{ color: "#0091ff" }} />}
          />
          <InputNumber
            style={{ width: "200px" }}
            placeholder="Varsayılan fiyat..."
            value={defaultPrice}
            min={0}
            decimalSeparator="," // Ondalık işareti virgül (Örn: 64,43)
            step={0.01}          // Kuruş kuruş artsın
            precision={2}        // Virgülden sonra 2 hane zorunlu
            suffix={<DollarOutlined style={{ color: "#0091ff" }} />}
            onChange={(value) => {
              const yeniVarsayilanFiyat = value || 0;
              setDefaultPrice(yeniVarsayilanFiyat);
              setSelectedMachines(prev => prev.map(item => {
                const gecerliMiktar = item.MiKTAR || 0;
                const yeniTutar = (gecerliMiktar * yeniVarsayilanFiyat).toFixed(2);
                return { 
                  ...item, 
                  FiYAT: yeniVarsayilanFiyat, 
                  TUTAR: yeniTutar 
                };
              }));
            }}
          />
          <Select
            style={{ width: "200px" }}
            placeholder="Yakıt Tankı Seçiniz..."
            value={fuelTank || undefined}
            onChange={(value) => {
              setFuelTank(value);
              setSelectedMachines(prev => prev.map(item => {
                return { 
                  ...item, 
                  YAKIT_TANKI: value
                };
              }));
            }}
            showSearch
            loading={tankLoading}
            optionFilterProp="label"
            options={yakitTanklari}
          />
          <Checkbox 
            checked={checkedOne} 
            onChange={(e) => setCheckedOne(e.target.checked)}
          >
            Stoktan
          </Checkbox>

          <Checkbox 
            checked={checkedTwo} 
            onChange={(e) => setCheckedTwo(e.target.checked)}
          >
            Full Depo
          </Checkbox>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button 
            type="default" 
            icon={<RedoOutlined />} 
            onClick={refreshTableData}
          >
            Yenile
          </Button>
    
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            style={{ backgroundColor: saveLoading ? undefined : "#39B83D" }} 
            onClick={handleSaveTopluYakitGiris}
            loading={saveLoading} // 🌟 İstek sürerken butonu kilitliyoruz
          >
            Kaydet
          </Button>
        </div>
      </div>
        <Table
          components={components}
          columns={initialColumns}
          dataSource={[...selectedMachines, { key: "dynamic-add-row", isNewRow: true }]}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
            onChange: handleTableChange,
            showTotal: (total, range) => `Toplam ${total}`,
            showQuickJumper: true,
          }}
          scroll={{ y: "calc(100vh - 450px)" }}
          onChange={handleTableChange}
        />
    </>
  );
};

export default MainTable;
