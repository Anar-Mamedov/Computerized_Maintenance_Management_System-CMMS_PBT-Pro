import React, { useCallback, useEffect, useRef, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message, Dropdown } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../api/http";
/* import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer"; */
import Filters from "./filter/Filters";
import ContextMenu from "../components/ContextMenu/ContextMenu";
/* import EditDrawer1 from "../../../YardimMasasi/IsTalepleri/Update/EditDrawer"; */
import { useFormContext } from "react-hook-form";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import { t } from "i18next";

const { Text } = Typography;

const SUMMARY_OPTIONS = [
  { key: "SUM", label: "Toplam" },
  { key: "AVG", label: "Ortalama" },
  { key: "MAX", label: "Maksimum" },
  { key: "MIN", label: "Minimum" },
];

const OPERATION_LABELS = SUMMARY_OPTIONS.reduce((acc, option) => {
  acc[option.key] = option.label;
  return acc;
}, {});

const SUMMARY_CELL_STYLE = {
  border: "1px solid #f0f0f0",
  backgroundColor: "#ffffff",
  padding: "8px",
  cursor: "pointer",
};

const SUMMARY_DROPDOWN_ITEMS = SUMMARY_OPTIONS.map((option) => ({
  key: option.key,
  label: option.label,
}));

const buildSummaryErrorMap = (operations, errorEntries, fallbackMessage) => {
  const errorMap = {};
  if (!Array.isArray(operations) || operations.length === 0) {
    return errorMap;
  }

  const operationFieldLookup = operations.reduce((acc, operation) => {
    if (operation && operation.alan) {
      acc[operation.alan.toUpperCase()] = operation.alan;
    }
    return acc;
  }, {});

  if (Array.isArray(errorEntries)) {
    errorEntries.forEach((entry) => {
      if (typeof entry !== "string" || entry.trim() === "") {
        return;
      }
      const trimmedEntry = entry.trim();
      const match = trimmedEntry.match(/^([^(]+)\s*(?:\((.+)\))?$/);
      const rawField = (match && match[1] ? match[1] : trimmedEntry).trim();
      const detail = (match && match[2] ? match[2] : trimmedEntry).trim();
      const normalizedField = operationFieldLookup[rawField.toUpperCase()] || rawField;
      errorMap[normalizedField] = detail;
    });
  }

  if (Object.keys(errorMap).length === 0 && fallbackMessage) {
    operations.forEach((operation) => {
      if (operation && operation.alan) {
        errorMap[operation.alan] = fallbackMessage;
      }
    });
  }

  return errorMap;
};

const normalizeSummaryResponse = (apiResponse, operations) => {
  const normalized = {};

  if (!apiResponse) {
    return normalized;
  }

  const operationsList = Array.isArray(operations) ? operations : [];

  const operationsByField = operationsList.reduce((acc, operation) => {
    acc[operation.alan] = operation;
    return acc;
  }, {});

  const registerResult = (field, value, overrideOperation) => {
    if (field === undefined || field === null) {
      return;
    }

    if (value === undefined || value === null) {
      return;
    }

    const operationType = (overrideOperation || operationsByField[field]?.islemTipi || "").toUpperCase();
    normalized[field] = {
      value,
      operation: operationType,
    };
  };

  if (apiResponse.altToplamlar && typeof apiResponse.altToplamlar === "object" && apiResponse.altToplamlar !== null) {
    Object.entries(apiResponse.altToplamlar).forEach(([rawKey, value]) => {
      if (rawKey == null) {
        return;
      }

      const upperKey = String(rawKey).toUpperCase();
      const separatorIndex = upperKey.indexOf("_");

      if (separatorIndex === -1) {
        return;
      }

      const candidateOperation = upperKey.slice(0, separatorIndex);
      const candidateFieldRaw = rawKey.slice(separatorIndex + 1);
      const matchedOperation = operationsList.find(
        (operation) => (operation.islemTipi || "").toUpperCase() === candidateOperation && operation.alan.toUpperCase() === candidateFieldRaw.toUpperCase()
      );

      const fieldName = matchedOperation ? matchedOperation.alan : candidateFieldRaw;
      registerResult(fieldName, value, candidateOperation);
    });
  }

  const candidateArrays = [
    Array.isArray(apiResponse) ? apiResponse : null,
    Array.isArray(apiResponse?.results) ? apiResponse.results : null,
    Array.isArray(apiResponse?.data) ? apiResponse.data : null,
    Array.isArray(apiResponse?.sonuclar) ? apiResponse.sonuclar : null,
  ].filter(Boolean);

  if (candidateArrays.length) {
    candidateArrays.forEach((entries) => {
      entries.forEach((entry) => {
        if (!entry || typeof entry !== "object") {
          return;
        }

        const field = entry.alan || entry.ALAN || entry.field || entry.Field;
        const value = entry.sonuc ?? entry.SONUC ?? entry.value ?? entry.deger ?? entry.result;
        const operationType = entry.islemTipi || entry.ISLEM_TIPI || entry.operationType || entry.operation || operationsByField[field]?.islemTipi;

        registerResult(field, value, operationType);
      });
    });

    return normalized;
  }

  if (typeof apiResponse === "object" && apiResponse !== null) {
    operationsList.forEach((operation) => {
      const field = operation.alan;
      const operationType = (operation.islemTipi || "").toUpperCase();
      const upperKey = operationType ? `${field}_${operationType}` : null;
      const lowerKey = operationType ? `${field}_${operationType.toLowerCase()}` : null;
      const capitalizedKey = operationType ? `${field}_${operationType.charAt(0)}${operationType.slice(1).toLowerCase()}` : null;

      const value =
        apiResponse[field] ??
        (upperKey ? apiResponse[upperKey] : undefined) ??
        (lowerKey ? apiResponse[lowerKey] : undefined) ??
        (capitalizedKey ? apiResponse[capitalizedKey] : undefined);

      registerResult(field, value, operationType);
    });
  }

  return normalized;
};

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
      {/* <Checkbox
        checked={visible}
        onChange={(e) => onVisibilityChange(index, e.target.checked)}
        style={{ marginLeft: "auto" }}
      /> */}
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [label, setLabel] = useState("Yükleniyor...");
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [editDrawer1Visible, setEditDrawer1Visible] = useState(false);
  const [editDrawer1Data, setEditDrawer1Data] = useState(null);
  const [onayCheck, setOnayCheck] = useState({ ONY_AKTIF: 0, ONY_MANUEL: 0 });
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [xlsxLoading, setXlsxLoading] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [summaryData, setSummaryData] = useState({});
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summarySelections, setSummarySelections] = useState({});
  const [summaryErrors, setSummaryErrors] = useState({});
  const summaryRequestIdRef = useRef(0);
  const previousSummaryErrorsRef = useRef({});

  const requestSummaryData = useCallback(
    async ({ keyword = "", filters = {}, sortField: currentSortField, sortOrder: currentSortOrder, operations = [] }) => {
      const validOperations = Array.isArray(operations) ? operations.filter((operation) => operation && operation.islemTipi && operation.alan) : [];

      if (validOperations.length === 0) {
        setSummaryData({});
        setSummaryErrors({});
        setSummaryLoading(false);
        return;
      }

      const requestId = summaryRequestIdRef.current + 1;
      summaryRequestIdRef.current = requestId;
      setSummaryLoading(true);
      setSummaryErrors((prev) => {
        if (!prev || Object.keys(prev).length === 0) {
          return prev;
        }
        let updated = null;
        validOperations.forEach((operation) => {
          if (operation && operation.alan && Object.prototype.hasOwnProperty.call(prev, operation.alan)) {
            if (!updated) {
              updated = { ...prev };
            }
            delete updated[operation.alan];
          }
        });
        return updated || prev;
      });

      let sortParam = "";
      if (currentSortField && currentSortOrder) {
        const normalizedOrder = currentSortOrder === "ascend" ? "ASC" : "DESC";
        sortParam = `&sortField=${currentSortField}&sortOrder=${normalizedOrder}`;
      }

      try {
        const response = await AxiosInstance.post(`GetIsEmriAltToplamlar?parametre=${keyword}${sortParam}`, {
          hesaplamalar: validOperations,
          filtreler: filters,
        });

        const normalized = normalizeSummaryResponse(response, validOperations);
        const responseErrorFields = buildSummaryErrorMap(validOperations, response?.hataliAlanlar, response?.status || response?.message);

        if (summaryRequestIdRef.current === requestId) {
          setSummaryData(normalized);
          if (Object.keys(responseErrorFields).length > 0) {
            setSummaryErrors((prev) => {
              const next = { ...(prev || {}) };
              let changed = false;
              Object.entries(responseErrorFields).forEach(([field, detail]) => {
                if (next[field] !== detail) {
                  next[field] = detail;
                  changed = true;
                }
              });
              return changed ? next : prev;
            });
          }
        }
      } catch (error) {
        console.error("Toplam verileri çekilirken hata oluştu:", error);
        if (summaryRequestIdRef.current === requestId) {
          setSummaryData({});
          const errorData = error?.response?.data;
          const errorFields = buildSummaryErrorMap(validOperations, errorData?.hataliAlanlar, errorData?.status || error?.message || "Toplama işlemi gerçekleştirilemedi.");
          if (Object.keys(errorFields).length > 0) {
            setSummaryErrors((prev) => {
              const next = { ...(prev || {}) };
              let changed = false;
              Object.entries(errorFields).forEach(([field, detail]) => {
                if (next[field] !== detail) {
                  next[field] = detail;
                  changed = true;
                }
              });
              return changed ? next : prev;
            });
          }
        }
      } finally {
        if (summaryRequestIdRef.current === requestId) {
          setSummaryLoading(false);
        }
      }
    },
    []
  );

  const handleSummaryOperationSelect = useCallback((fieldKey, operationKey) => {
    if (!fieldKey || !operationKey) {
      return;
    }

    setSummarySelections((prev) => {
      if (prev[fieldKey] === operationKey) {
        return prev;
      }
      return {
        ...prev,
        [fieldKey]: operationKey,
      };
    });

    setSummaryData((prevData) => {
      if (!prevData || prevData[fieldKey] === undefined) {
        return prevData;
      }
      const updated = { ...prevData };
      delete updated[fieldKey];
      return updated;
    });

    setSummaryErrors((prevErrors) => {
      if (!prevErrors || prevErrors[fieldKey] === undefined) {
        return prevErrors;
      }
      const updated = { ...prevErrors };
      delete updated[fieldKey];
      return updated;
    });
  }, []);

  function hexToRGBA(color, opacity) {
    // 1) Geçersiz parametreleri engelle
    if (!color || color.trim() === "" || opacity == null) {
      // Boş ya da null renk için boş değer döndürelim
      return;
    }

    // 2) rgb(...) veya rgba(...) formatını yakala
    if (color.startsWith("rgb(") || color.startsWith("rgba(")) {
      // Örnek: "rgb(0,123,255)" -> ["0","123","255"]
      // Örnek: "rgba(255,0,0,0.96)" -> ["255","0","0","0.96"]
      const rawValues = color.replace(/^rgba?\(|\s+|\)$/g, "").split(",");
      const r = parseInt(rawValues[0], 10) || 0;
      const g = parseInt(rawValues[1], 10) || 0;
      const b = parseInt(rawValues[2], 10) || 0;
      // Her hâlükârda dışarıdan gelen `opacity` ile override edelim
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // 3) "#" ile başlayan (HEX) formatları işle
    if (color.startsWith("#")) {
      let r = 0,
        g = 0,
        b = 0;

      // => #rgb  (3 hane)
      if (color.length === 4) {
        // #abc -> r=aa, g=bb, b=cc
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // => #rgba (4 hane)
      else if (color.length === 5) {
        // #abcf -> r=aa, g=bb, b=cc, a=ff (ama biz alpha'yı yok sayıp dışarıdan gelen opacity'yi kullanacağız)
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
        // color[4] + color[4] => alpha. Ama override ediyoruz.
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // => #rrggbb (6 hane)
      else if (color.length === 7) {
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // => #rrggbbaa (8 hane)
      else if (color.length === 9) {
        // #ff0000c9 gibi
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
        // Son 2 karakter alpha'ya denk geliyor ama biz fonksiyon parametresini kullanıyoruz.
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    }

    // 4) Hiçbir formata uymuyorsa default dön
    return `rgba(0, 0, 0, ${opacity})`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.post(`GetOnayCheck?TB_ONAY_ID=1`); // API URL'niz
        if (response && response[0]) {
          setOnayCheck(response[0]);
        } else {
          console.warn("API response is empty or invalid for onayCheck");
          // Keep the default values set in useState
        }
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        // Keep the default values set in useState
      }
    };

    fetchData();
  }, []);

  // Özel Alanların nameleri backend çekmek için api isteği

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=ISEMRI"); // API URL'niz
        localStorage.setItem("ozelAlanlarIsEmriAnalizi", JSON.stringify(response));
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [drawer.visible]);

  const ozelAlanlar = JSON.parse(localStorage.getItem("ozelAlanlarIsEmriAnalizi"));

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

  const initialColumns = [
    {
      title: "İş Emri No",
      dataIndex: "ISM_ISEMRI_NO",
      key: "ISM_ISEMRI_NO",
      width: 120,
      ellipsis: true,
      visible: true,
      render: (text, record) => <a onClick={() => onRowClick(record)}>{text}</a>,
      sorter: true,
    },
    {
      title: "Tarih",
      dataIndex: "ISM_DUZENLEME_TARIH",
      key: "ISM_DUZENLEME_TARIH",
      width: 110,
      ellipsis: true,
      sorter: true,
      visible: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Saat",
      dataIndex: "ISM_DUZENLEME_SAAT",
      key: "ISM_DUZENLEME_SAAT",
      width: 90,
      ellipsis: true,
      sorter: true,
      visible: true,
      render: (text) => formatTime(text),
    },
    {
      title: "İş Emri Tipi",
      dataIndex: "ISM_TIP",
      key: "ISM_TIP",
      width: 180,
      ellipsis: true,
      visible: true,
      sorter: true,
      render: (text, record) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Tag
            style={{
              backgroundColor: hexToRGBA(record.ISM_TIP_RENK ? record.ISM_TIP_RENK : "#000000", 0.2),
              border: `1.2px solid ${hexToRGBA(record.ISM_TIP_RENK ? record.ISM_TIP_RENK : "#000000", 0.7)}`,
              color: record.ISM_TIP_RENK ? record.ISM_TIP_RENK : "#000000",
            }}
          >
            {text}
          </Tag>
        </div>
      ),
    },
    {
      title: "Konu",
      dataIndex: "ISM_KONU",
      key: "ISM_KONU",
      width: 300,
      ellipsis: true,
      sorter: true,
      visible: true,
      render: (text, record) => <a onClick={() => onRowClick(record)}>{text}</a>,
    },
    {
      title: "Durum",
      dataIndex: "ISM_DURUM",
      key: "ISM_DURUM",
      width: 120,
      ellipsis: true,
      visible: true,
      sorter: true,
      render: (text, record) => {
        const circleStyle = {
          backgroundColor: record.ISM_KAPATILDI ? "red" : "green",
          borderRadius: "50%",
          display: "inline-block",
          width: "10px",
          height: "10px",
        };
        return (
          <div>
            <span style={circleStyle}></span>
            <span style={{ marginLeft: "5px" }}>{text}</span>
          </div>
        );
      },
    },
    {
      title: "Onay Durumu",
      dataIndex: "ISM_ONAY_DURUM",
      key: "ISM_ONAY_DURUM",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: true,
      render: (_, record) => {
        const validStatuses = [1, 2, 3];
        if (validStatuses.includes(record.ISM_ONAY_DURUM)) {
          const { color, text } = statusTag(record.ISM_ONAY_DURUM);
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tag
                style={{
                  textAlign: "center",
                  backgroundColor: hexToRGBA(color, 0.2),
                  border: `1.2px solid ${hexToRGBA(color, 0.7)}`,
                  color: color,
                }}
              >
                {text}
              </Tag>
            </div>
          );
        }
        return null;
      },
    },
    {
      title: "Lokasyon",
      dataIndex: "ISM_LOKASYON",
      key: "ISM_LOKASYON",
      width: 200,
      ellipsis: true,
      sorter: true,
      visible: true,
    },
    {
      title: "Makine Kodu",
      dataIndex: "MKN_KOD",
      key: "MKN_KOD",
      width: 150,
      sorter: true,
      ellipsis: true,
      visible: true,
    },
    {
      title: "Makine Tanımı",
      dataIndex: "MKN_TANIM",
      key: "MKN_TANIM",
      width: 300,
      sorter: true,
      ellipsis: true,
      visible: true,
    },
    {
      title: "Planlanan Başlama Tarihi",
      dataIndex: "ISM_PLAN_BASLAMA_TARIH",
      key: "ISM_PLAN_BASLAMA_TARIH",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
      render: (text) => formatDate(text),
    },
    {
      title: "Planlanan Başlama Saati",
      dataIndex: "ISM_PLAN_BASLAMA_SAAT",
      key: "ISM_PLAN_BASLAMA_SAAT",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
      render: (text) => formatTime(text),
    },
    {
      title: "Planlanan Bitiş Tarihi",
      dataIndex: "ISM_PLAN_BITIS_TARIH",
      key: "ISM_PLAN_BITIS_TARIH",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
      render: (text) => formatDate(text),
    },
    {
      title: "Planlanan Bitiş Saati",
      dataIndex: "ISM_PLAN_BITIS_SAAT",
      key: "ISM_PLAN_BITIS_SAAT",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
      render: (text) => formatTime(text),
    },
    {
      title: "Başlama Tarihi",
      dataIndex: "ISM_BASLAMA_TARIH",
      key: "ISM_BASLAMA_TARIH",
      width: 110,
      ellipsis: true,
      sorter: true,
      visible: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Başlama Saati",
      dataIndex: "ISM_BASLAMA_SAAT",
      key: "ISM_BASLAMA_SAAT",
      width: 90,
      ellipsis: true,
      sorter: true,
      visible: true,
      render: (text) => formatTime(text),
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "ISM_BITIS_TARIH",
      key: "ISM_BITIS_TARIH",
      width: 110,
      ellipsis: true,
      sorter: true,
      visible: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Bitiş Saati",
      dataIndex: "ISM_BITIS_SAAT",
      key: "ISM_BITIS_SAAT",
      width: 90,
      ellipsis: true,
      sorter: true,
      visible: true,
      render: (text) => formatTime(text),
    },
    {
      title: "İş Süresi (dk.)",
      dataIndex: "ISM_SURE_CALISMA",
      key: "ISM_SURE_CALISMA",
      width: 110,
      ellipsis: true,
      sorter: true,
      visible: true,
      render: (text) => (text > 0 ? text : null),
    },
    {
      title: "Tamamlama (%)",
      dataIndex: "ISM_TAMAMLANMA_ORAN",
      key: "ISM_TAMAMLANMA_ORAN",
      width: 200,
      ellipsis: true,
      sorter: true,
      visible: true,
      render: (text) => <Progress percent={text} steps={8} />,
    },
    {
      title: "Makine Durumu",
      dataIndex: "ISM_MAKINE_DURUM",
      key: "ISM_MAKINE_DURUM",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Makine Tipi",
      dataIndex: "MKN_TIP",
      key: "MKN_TIP",
      width: 250,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Ekipman",
      dataIndex: "ISM_EKIPMAN",
      key: "ISM_EKIPMAN",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "İş Tipi Kod",
      dataIndex: "ISM_TIP_KOD",
      key: "ISM_TIP_KOD",
      width: 250,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "İş Nedeni",
      dataIndex: "ISM_NEDEN",
      key: "ISM_NEDEN",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Atölye",
      dataIndex: "ISM_ATOLYE",
      key: "ISM_ATOLYE",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Talimat",
      dataIndex: "ISM_TALIMAT",
      key: "ISM_TALIMAT",
      width: 250,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Öncelik",
      dataIndex: "ISM_ONCELIK",
      key: "ISM_ONCELIK",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Takvim",
      dataIndex: "ISM_TAKVIM",
      key: "ISM_TAKVIM",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Masraf Merkezi",
      dataIndex: "ISM_MASRAF_MERKEZ",
      key: "ISM_MASRAF_MERKEZ",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Firma",
      dataIndex: "ISM_CARI",
      key: "ISM_CARI",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "İş Talep Kodu",
      dataIndex: "ISM_IS_TALEP_KODU",
      key: "ISM_IS_TALEP_KODU",
      width: 150,
      ellipsis: true,
      sorter: true,
      onCell: (record) => ({
        onClick: (event) => {
          event.stopPropagation();
          const updatedRecord = { ...record, key: record.ISM_IS_TALEP_ID };
          setEditDrawer1Data(updatedRecord);
          setEditDrawer1Visible(true);
        },
      }),
      render: (text) => <a>{text}</a>,
      visible: false,
    },
    {
      title: "Personel",
      dataIndex: "ISM_PERSONEL_TANIM",
      key: "ISM_PERSONEL_TANIM",
      width: 180,
      ellipsis: true,
      sorter: true,
      visible: true,
    },
    {
      title: "Sayaç Değeri",
      dataIndex: "ISM_SAYAC_DEGER",
      key: "ISM_SAYAC_DEGER",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Notlar",
      dataIndex: "ISM_NOT",
      key: "ISM_NOT",
      width: 250,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Açıklama",
      dataIndex: "ISM_ACIKLAMA",
      key: "ISM_ACIKLAMA",
      width: 250,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Sonuç",
      dataIndex: "ISM_SONUC",
      key: "ISM_SONUC",
      width: 250,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Yapıldı",
      dataIndex: "ISM_YAPILDI",
      key: "ISM_YAPILDI",
      width: 250,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Bildiren",
      dataIndex: "ISM_BILDIREN",
      key: "ISM_BILDIREN",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Bildirim Tarihi",
      dataIndex: "ISM_BILDIRIM_TARIH",
      key: "ISM_BILDIRIM_TARIH",
      width: 110,
      ellipsis: true,
      sorter: true,
      visible: false,
      render: (text) => formatDate(text),
    },
    {
      title: "Bildirim Saati",
      dataIndex: "ISM_BILDIRIM_SAAT",
      key: "ISM_BILDIRIM_SAAT",
      width: 90,
      ellipsis: true,
      sorter: true,
      visible: false,
      render: (text) => formatTime(text),
    },
    {
      title: "Maliyet Malzeme",
      dataIndex: "ISM_MALIYET_MLZ",
      key: "ISM_MALIYET_MLZ",
      width: 120,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Maliyet Personel",
      dataIndex: "ISM_MALIYET_PERSONEL",
      key: "ISM_MALIYET_PERSONEL",
      width: 120,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Maliyet Duruş",
      dataIndex: "ISM_MALIYET_DURUS",
      key: "ISM_MALIYET_DURUS",
      width: 120,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Maliyet Dış Servis",
      dataIndex: "ISM_MALIYET_DISSERVIS",
      key: "ISM_MALIYET_DISSERVIS",
      width: 120,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Maliyet Diğer",
      dataIndex: "ISM_MALIYET_DIGER",
      key: "ISM_MALIYET_DIGER",
      width: 120,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: "Maliyet Toplam",
      dataIndex: "ISM_MALIYET_TOPLAM",
      key: "ISM_MALIYET_TOPLAM",
      width: 120,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_1 ? ozelAlanlar.OZL_OZEL_ALAN_1 : label && label.OZL_OZEL_ALAN_1}</div>,
      dataIndex: "ISM_OZEL_ALAN_1",
      key: "ISM_OZEL_ALAN_1",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_2 ? ozelAlanlar.OZL_OZEL_ALAN_2 : label && label.OZL_OZEL_ALAN_2}</div>,
      dataIndex: "ISM_OZEL_ALAN_2",
      key: "ISM_OZEL_ALAN_2",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_3 ? ozelAlanlar.OZL_OZEL_ALAN_3 : label && label.OZL_OZEL_ALAN_3}</div>,
      dataIndex: "ISM_OZEL_ALAN_3",
      key: "ISM_OZEL_ALAN_3",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_4 ? ozelAlanlar.OZL_OZEL_ALAN_4 : label && label.OZL_OZEL_ALAN_4}</div>,
      dataIndex: "ISM_OZEL_ALAN_4",
      key: "ISM_OZEL_ALAN_4",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_5 ? ozelAlanlar.OZL_OZEL_ALAN_5 : label && label.OZL_OZEL_ALAN_5}</div>,
      dataIndex: "ISM_OZEL_ALAN_5",
      key: "ISM_OZEL_ALAN_5",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_6 ? ozelAlanlar.OZL_OZEL_ALAN_6 : label && label.OZL_OZEL_ALAN_6}</div>,
      dataIndex: "ISM_OZEL_ALAN_6",
      key: "ISM_OZEL_ALAN_6",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_7 ? ozelAlanlar.OZL_OZEL_ALAN_7 : label && label.OZL_OZEL_ALAN_7}</div>,
      dataIndex: "ISM_OZEL_ALAN_7",
      key: "ISM_OZEL_ALAN_7",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_8 ? ozelAlanlar.OZL_OZEL_ALAN_8 : label && label.OZL_OZEL_ALAN_8}</div>,
      dataIndex: "ISM_OZEL_ALAN_8",
      key: "ISM_OZEL_ALAN_8",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_9 ? ozelAlanlar.OZL_OZEL_ALAN_9 : label && label.OZL_OZEL_ALAN_9}</div>,
      dataIndex: "ISM_OZEL_ALAN_9",
      key: "ISM_OZEL_ALAN_9",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_10 ? ozelAlanlar.OZL_OZEL_ALAN_10 : label && label.OZL_OZEL_ALAN_10}</div>,
      dataIndex: "ISM_OZEL_ALAN_10",
      key: "ISM_OZEL_ALAN_10",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_11 ? ozelAlanlar.OZL_OZEL_ALAN_11 : label && label.OZL_OZEL_ALAN_11}</div>,
      dataIndex: "ISM_OZEL_ALAN_11",
      key: "ISM_OZEL_ALAN_11",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_12 ? ozelAlanlar.OZL_OZEL_ALAN_12 : label && label.OZL_OZEL_ALAN_12}</div>,
      dataIndex: "ISM_OZEL_ALAN_12",
      key: "ISM_OZEL_ALAN_12",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_13 ? ozelAlanlar.OZL_OZEL_ALAN_13 : label && label.OZL_OZEL_ALAN_13}</div>,
      dataIndex: "ISM_OZEL_ALAN_13",
      key: "ISM_OZEL_ALAN_13",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_14 ? ozelAlanlar.OZL_OZEL_ALAN_14 : label && label.OZL_OZEL_ALAN_14}</div>,
      dataIndex: "ISM_OZEL_ALAN_14",
      key: "ISM_OZEL_ALAN_14",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_15 ? ozelAlanlar.OZL_OZEL_ALAN_15 : label && label.OZL_OZEL_ALAN_15}</div>,
      dataIndex: "ISM_OZEL_ALAN_15",
      key: "ISM_OZEL_ALAN_15",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_16 ? ozelAlanlar.OZL_OZEL_ALAN_16 : label && label.OZL_OZEL_ALAN_16}</div>,
      dataIndex: "ISM_OZEL_ALAN_16",
      key: "ISM_OZEL_ALAN_16",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_17 ? ozelAlanlar.OZL_OZEL_ALAN_17 : label && label.OZL_OZEL_ALAN_17}</div>,
      dataIndex: "ISM_OZEL_ALAN_17",
      key: "ISM_OZEL_ALAN_17",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_18 ? ozelAlanlar.OZL_OZEL_ALAN_18 : label && label.OZL_OZEL_ALAN_18}</div>,
      dataIndex: "ISM_OZEL_ALAN_18",
      key: "ISM_OZEL_ALAN_18",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_19 ? ozelAlanlar.OZL_OZEL_ALAN_19 : label && label.OZL_OZEL_ALAN_19}</div>,
      dataIndex: "ISM_OZEL_ALAN_19",
      key: "ISM_OZEL_ALAN_19",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_20 ? ozelAlanlar.OZL_OZEL_ALAN_20 : label && label.OZL_OZEL_ALAN_20}</div>,
      dataIndex: "ISM_OZEL_ALAN_20",
      key: "ISM_OZEL_ALAN_20",
      width: 150,
      ellipsis: true,
      sorter: true,
      visible: false,
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

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  useEffect(() => {
    const entries = Object.entries(summarySelections).filter(([field, operation]) => field && operation);

    if (entries.length === 0) {
      setSummaryData({});
      setSummaryErrors({});
      setSummaryLoading(false);
      return;
    }

    const validEntries = entries.filter(([field]) => !summaryErrors[field]);

    if (validEntries.length === 0) {
      setSummaryLoading(false);
      return;
    }

    const operationsPayload = validEntries.map(([field, operation]) => ({
      islemTipi: operation,
      alan: field,
    }));

    requestSummaryData({
      keyword: body.keyword || "",
      filters: body.filters || {},
      sortField,
      sortOrder,
      operations: operationsPayload,
    });
  }, [summarySelections, summaryErrors, body.keyword, body.filters, sortField, sortOrder, requestSummaryData]);

  // ana tablo api isteği için kullanılan useEffect

  useEffect(() => {
    fetchEquipmentData(body, currentPage, pageSize, sortField, sortOrder);
  }, [body, currentPage, pageSize, sortField, sortOrder]);

  // ana tablo api isteği için kullanılan useEffect son

  // arama işlemi için kullanılan useEffect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Arama terimi değiştiğinde ve boş olduğunda API isteğini tetikle
    const timeout = setTimeout(() => {
      if (searchTerm !== body.keyword) {
        handleBodyChange("keyword", searchTerm);
        setCurrentPage(1); // Arama yapıldığında veya arama sıfırlandığında sayfa numarasını 1'e ayarla
        // setDrawer({ ...drawer, visible: false }); // Arama yapıldığında veya arama sıfırlandığında Drawer'ı kapat
      }
    }, 2000);

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // arama işlemi için kullanılan useEffect son

  const fetchEquipmentData = async (body, page, size, sortField, sortOrder) => {
    // body'nin undefined olması durumunda varsayılan değerler atanıyor
    const { keyword = "", filters = {} } = body || {};
    // page'in undefined olması durumunda varsayılan değer olarak 1 atanıyor
    const currentPage = page || 1;

    // Sorting parametrelerini oluşturun
    let sortParam = "";
    if (sortField && sortOrder) {
      sortParam = `&sortField=${sortField}&sortOrder=${sortOrder === "ascend" ? "ASC" : "DESC"}`;
    }

    try {
      setLoading(true);
      // API isteğinde keyword ve currentPage kullanılıyor
      const response = await AxiosInstance.post(`GetIsEmriAnaliz?parametre=${keyword}&pagingDeger=${currentPage}&pageSize=${size}${sortParam}`, filters);
      if (response) {
        if (response.status_code === 401) {
          message.error(t("buSayfayaErisimYetkinizBulunmamaktadir"));
          return;
        }
        // Toplam sayfa sayısını ayarla
        setTotalPages(response.page);
        setTotalDataCount(response.kayit_sayisi);

        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.list.map((item) => ({
          ...item,
          key: item.TB_ISEMRI_ID,
          // Diğer alanlarınız...
        }));
        setData(formattedData);
        setLoading(false);
      } else {
        console.error("API response is not in expected format");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
      if (navigator.onLine) {
        // İnternet bağlantısı var
        message.error("Hata Mesajı: " + error.message);
      } else {
        // İnternet bağlantısı yok
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  // filtreleme işlemi için kullanılan useEffect
  const handleBodyChange = useCallback((type, newBody) => {
    setBody((state) => ({
      ...state,
      [type]: newBody,
    }));
    setCurrentPage(1); // Filtreleme yapıldığında sayfa numarasını 1'e ayarla
  }, []);
  // filtreleme işlemi için kullanılan useEffect son

  // sayfalama için kullanılan useEffect
  const handleTableChange = (pagination, filters, sorter, extra) => {
    if (pagination) {
      setCurrentPage(pagination.current);
      setPageSize(pagination.pageSize); // pageSize güncellemesi
    }

    // Sorting bilgisini yakalayın
    if (sorter && sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order); // 'ascend', 'descend' veya undefined
    } else {
      setSortField(null);
      setSortOrder(null);
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
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // const onRowClick = (record) => {
  //   return {
  //     onClick: () => {
  //       setDrawer({ visible: true, data: record });
  //     },
  //   };
  // };

  const onRowClick = (record) => {
    setDrawer({ visible: true, data: record });
  };

  const refreshTableData = useCallback(() => {
    // Sayfa numarasını 1 yap
    // setCurrentPage(1);

    // `body` içerisindeki filtreleri ve arama terimini sıfırla
    // setBody({
    //   keyword: "",
    //   filters: {},
    // });
    // setSearchTerm("");

    // Tablodan seçilen kayıtların checkbox işaretini kaldır
    setSelectedRowKeys([]);
    setSelectedRows([]);

    // Verileri yeniden çekmek için `fetchEquipmentData` fonksiyonunu çağır
    fetchEquipmentData(body, currentPage, pageSize, sortField, sortOrder);
    // Burada `body` ve `currentPage`'i güncellediğimiz için, bu değerlerin en güncel hallerini kullanarak veri çekme işlemi yapılır.
    // Ancak, `fetchEquipmentData` içinde `body` ve `currentPage`'e bağlı olarak veri çekiliyorsa, bu değerlerin güncellenmesi yeterli olacaktır.
    // Bu nedenle, doğrudan `fetchEquipmentData` fonksiyonunu çağırmak yerine, bu değerlerin güncellenmesini bekleyebiliriz.
  }, [body, currentPage, pageSize, sortField, sortOrder]);

  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrderIsEmriAnalizi");
    const savedVisibility = localStorage.getItem("columnVisibilityIsEmriAnalizi");
    const savedWidths = localStorage.getItem("columnWidthsIsEmriAnalizi");

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

    localStorage.setItem("columnOrderIsEmriAnalizi", JSON.stringify(order));
    localStorage.setItem("columnVisibilityIsEmriAnalizi", JSON.stringify(visibility));
    localStorage.setItem("columnWidthsIsEmriAnalizi", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  const getColumnLabel = useCallback(
    (fieldKey) => {
      if (!fieldKey) {
        return "";
      }
      const column = columns.find((col) => col.dataIndex === fieldKey || col.key === fieldKey);
      if (column && column.title) {
        const extracted = extractTextFromElement(column.title);
        if (extracted && extracted.trim() !== "") {
          return extracted;
        }
      }
      return fieldKey;
    },
    [columns]
  );

  useEffect(() => {
    const previous = previousSummaryErrorsRef.current || {};
    const current = summaryErrors || {};

    Object.entries(current).forEach(([field, detail]) => {
      if (previous[field] !== detail) {
        const label = getColumnLabel(field);
        const text = detail && typeof detail === "string" && detail.trim() !== "" ? detail : "Toplama işlemi gerçekleştirilemedi.";
        message.error(`${label}: ${text}`);
      }
    });

    Object.keys(previous).forEach((field) => {
      if (!current[field]) {
        delete previous[field];
      }
    });

    previousSummaryErrorsRef.current = { ...current };
  }, [summaryErrors, getColumnLabel]);

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnOrderIsEmriAnalizi", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnVisibilityIsEmriAnalizi",
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
      "columnWidthsIsEmriAnalizi",
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

  const renderTableSummary = (_pageData) => {
    const hasSelectionColumn = Boolean(rowSelection);

    return (
      <Table.Summary fixed="bottom">
        <Table.Summary.Row>
          {hasSelectionColumn ? <Table.Summary.Cell index={0} key="summary-selection" style={{ ...SUMMARY_CELL_STYLE, cursor: "default" }} /> : null}
          {filteredColumns.map((column, columnIndex) => {
            const summaryIndex = hasSelectionColumn ? columnIndex + 1 : columnIndex;
            const fieldKey = column.dataIndex || column.key;
            const selectedOperation = fieldKey ? summarySelections[fieldKey] : null;
            const summaryEntry = fieldKey ? summaryData[fieldKey] : undefined;
            const isLoading = summaryLoading && !!selectedOperation && !summaryEntry;
            const errorMessage = fieldKey ? summaryErrors[fieldKey] : null;

            let content;

            if (fieldKey && errorMessage) {
              content = (
                <Text type="danger" strong>
                  Hata
                </Text>
              );
            } else if (fieldKey && selectedOperation && summaryEntry) {
              const operationLabel = OPERATION_LABELS[selectedOperation] || selectedOperation;
              const formattedValue =
                typeof summaryEntry.value === "number" ? summaryEntry.value.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : summaryEntry.value;

              content = (
                <Text strong>
                  {operationLabel ? `${operationLabel}: ` : ""}
                  {formattedValue}
                </Text>
              );
            } else if (isLoading) {
              content = <Text type="secondary">Yükleniyor...</Text>;
            } else if (fieldKey && selectedOperation) {
              const operationLabel = OPERATION_LABELS[selectedOperation] || selectedOperation;
              content = <Text type="secondary">{`${operationLabel} seçildi`}</Text>;
            } else {
              content = <Text type="secondary">Seçiniz</Text>;
            }

            return (
              <Table.Summary.Cell key={`summary-${fieldKey || columnIndex}`} index={summaryIndex} style={SUMMARY_CELL_STYLE}>
                {fieldKey ? (
                  <Dropdown
                    menu={{
                      items: SUMMARY_DROPDOWN_ITEMS,
                      selectable: true,
                      selectedKeys: selectedOperation ? [selectedOperation] : [],
                      onClick: ({ key }) => handleSummaryOperationSelect(fieldKey, key),
                    }}
                    trigger={["click"]}
                  >
                    <div style={{ width: "100%", cursor: "pointer" }}>{content}</div>
                  </Dropdown>
                ) : (
                  content
                )}
              </Table.Summary.Cell>
            );
          })}
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

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
    localStorage.removeItem("columnOrderIsEmriAnalizi");
    localStorage.removeItem("columnVisibilityIsEmriAnalizi");
    localStorage.removeItem("columnWidthsIsEmriAnalizi");
    localStorage.removeItem("ozelAlanlarIsEmriAnalizi");
    window.location.reload();
  }

  // sütunları sıfırlamak için kullanılan fonksiyon sonu

  // Function to handle CSV download
  const handleDownloadXLSX = async () => {
    try {
      // İndirme işlemi başlıyor
      setXlsxLoading(true);

      // API'den verileri çekiyoruz
      const { keyword = "", filters = {} } = body || {};
      const response = await AxiosInstance.post(`GetIsEmriFullListExcel?parametre=${keyword}`, filters);
      if (response) {
        // Verileri işliyoruz
        const xlsxData = response.map((row) => {
          let xlsxRow = {};
          filteredColumns.forEach((col) => {
            const key = col.dataIndex;
            if (key) {
              let value = row[key];

              // Özel durumları ele alıyoruz
              if (col.render) {
                if (key.endsWith("_TARIH")) {
                  value = formatDate(value);
                } else if (key.endsWith("_SAAT")) {
                  value = formatTime(value);
                } else if (key === "ISM_TAMAMLANMA_ORAN") {
                  value = `${row.ISM_TAMAMLANMA_ORAN}%`;
                } else if (key === "ISM_DURUM") {
                  value = row.ISM_DURUM;
                } else if (key === "ISM_ONAY_DURUM") {
                  const { text } = statusTag(row.ISM_ONAY_DURUM);
                  value = text;
                } else if (key === "ISM_TIP") {
                  value = row.ISM_TIP;
                } else if (key.startsWith("ISM_OZEL_ALAN_")) {
                  value = row[key];
                } else {
                  // Diğer sütunlar için
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

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
          .filter((col) => col.key); // Geçerli dataIndex'e sahip sütunları dahil ediyoruz

        // Genişlikleri ölçeklendirme faktörü ile ayarlıyoruz
        const scalingFactor = 0.8; // Gerektiği gibi ayarlayın

        worksheet["!cols"] = headers.map((header) => ({
          wpx: header.width ? header.width * scalingFactor : 100, // Tablo sütun genişliğini kullanıyoruz
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
        link.setAttribute("download", "table_data.xlsx");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // İndirme işlemi bitti
        setXlsxLoading(false);
      } else {
        console.error("API yanıtı beklenen formatta değil");
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
      <Modal title="Sütunları Yönet" centered width={800} open={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}>
        <Text style={{ marginBottom: "15px" }}>Aşağıdaki Ekranlardan Sütunları Göster / Gizle ve Sıralamalarını Ayarlayabilirsiniz.</Text>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Button onClick={resetColumns} style={{ marginBottom: "15px" }}>
            Sütunları Sıfırla
          </Button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              width: "46%",
              border: "1px solid #8080806e",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #80808051",
                padding: "8px 8px 12px 8px",
              }}
            >
              <Text style={{ fontWeight: 600 }}>Sütunları Göster / Gizle</Text>
            </div>
            <div style={{ height: "400px", overflow: "auto" }}>
              {initialColumns.map((col) => (
                <div style={{ display: "flex", gap: "10px" }} key={col.key}>
                  <Checkbox checked={columns.find((column) => column.key === col.key)?.visible || false} onChange={(e) => toggleVisibility(col.key, e.target.checked)} />
                  {col.title}
                </div>
              ))}
            </div>
          </div>

          <DndContext
            onDragEnd={handleDragEnd}
            sensors={useSensors(
              useSensor(PointerSensor),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
              })
            )}
          >
            <div
              style={{
                width: "46%",
                border: "1px solid #8080806e",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #80808051",
                  padding: "8px 8px 12px 8px",
                }}
              >
                <Text style={{ fontWeight: 600 }}>Sütunların Sıralamasını Ayarla</Text>
              </div>
              <div style={{ height: "400px", overflow: "auto" }}>
                <SortableContext items={columns.filter((col) => col.visible).map((col) => col.key)} strategy={verticalListSortingStrategy}>
                  {columns
                    .filter((col) => col.visible)
                    .map((col, index) => (
                      <DraggableRow key={col.key} id={col.key} index={index} text={col.title} />
                    ))}
                </SortableContext>
              </div>
            </div>
          </DndContext>
        </div>
      </Modal>
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
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px 8px",
              // width: "32px",
              height: "32px",
            }}
            onClick={() => setIsModalVisible(true)}
          >
            <MenuOutlined />
          </Button>
          <Input
            style={{ width: "250px" }}
            type="text"
            placeholder="Arama yap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
          />
          <Filters onChange={handleBodyChange} />
          {/* <TeknisyenSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <AtolyeSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} /> */}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button style={{ display: "flex", alignItems: "center" }} onClick={handleDownloadXLSX} loading={xlsxLoading} icon={<SiMicrosoftexcel />}>
            İndir
          </Button>
          <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} onayCheck={onayCheck} />
          {/* <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} /> */}
        </div>
      </div>
      <Spin spinning={loading}>
        <Table
          components={components}
          rowSelection={rowSelection}
          columns={filteredColumns}
          dataSource={data}
          bordered
          summary={renderTableSummary}
          pagination={{
            current: currentPage,
            total: totalDataCount, // Toplam kayıt sayısı (sayfa başına kayıt sayısı ile çarpılır)
            pageSize: pageSize,
            defaultPageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
            onChange: handleTableChange,
            showTotal: (total, range) => `Toplam ${total}`, // Burada 'total' parametresi doğru kayıt sayısını yansıtacaktır
            showQuickJumper: true,
          }}
          // onRow={onRowClick}
          scroll={{ y: "calc(100vh - 430px)" }}
          onChange={handleTableChange}
          rowClassName={(record) => (record.IST_DURUM_ID === 0 ? "boldRow" : "")}
        />
      </Spin>
      {/* <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />

      {editDrawer1Visible && (
        <EditDrawer1
          selectedRow={editDrawer1Data}
          onDrawerClose={() => setEditDrawer1Visible(false)}
          drawerVisible={editDrawer1Visible}
          onRefresh={() => {
          }}
        />
      )} */}
    </>
  );
};

export default MainTable;
