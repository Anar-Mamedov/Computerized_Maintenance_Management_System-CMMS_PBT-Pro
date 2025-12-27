import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Checkbox, DatePicker, Modal, Table, TimePicker, Typography, message } from "antd";
import { HolderOutlined, MenuOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http";
import LocalizedDateText from "../../../../utils/components/LocalizedDateText.jsx";
import NumberInput from "../../../../utils/components/NumberInput.jsx";
import Filters from "./filter/Filters.jsx";
import "./ResizeStyle.css";

const DEFAULT_FILTERS = {
  Kelime: "",
  LokasyonIds: [],
  MakineTipIds: [],
  SayacTipIds: [],
};

const EMPTY_VALUE = "-";
const STORAGE_KEYS = {
  order: "columnOrderSayacGuncelleme",
  visibility: "columnVisibilitySayacGuncelleme",
  widths: "columnWidthsSayacGuncelleme",
};

const { Text } = Typography;

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  const handleStyle = {
    position: "absolute",
    bottom: 0,
    right: "-5px",
    width: "20%",
    height: "100%",
    zIndex: 2,
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
          onClick={(event) => {
            event.stopPropagation();
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

const DraggableRow = ({ id, text, style, ...restProps }) => {
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

const normalizeIdList = (values = []) => values.map((value) => Number(value)).filter((value) => Number.isFinite(value));

function MainTable() {
  const { t, i18n } = useTranslation();
  const { control, setValue, watch } = useFormContext();
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language || "tr", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [i18n.language]
  );

  const currentLang = useMemo(() => {
    const lang = (i18n.language || localStorage.getItem("i18nextLng") || "tr").split("-")[0];
    return lang;
  }, [i18n.language]);

  const dateFormat = useMemo(() => {
    const dateFormatMap = {
      tr: "DD.MM.YYYY",
      az: "DD.MM.YYYY",
      ru: "DD.MM.YYYY",
      en: "MM/DD/YYYY",
    };
    return dateFormatMap[currentLang] || "YYYY-MM-DD";
  }, [currentLang]);

  const timeFormat = useMemo(() => {
    const timeFormatMap = {
      tr: "HH:mm",
      az: "HH:mm",
      ru: "HH:mm",
      en: "hh:mm A",
    };
    return timeFormatMap[currentLang] || "HH:mm";
  }, [currentLang]);

  const disableFutureDates = useCallback((current) => current && current.isAfter(dayjs(), "day"), []);

  const formatText = useCallback((value) => {
    if (value === null || value === undefined) {
      return EMPTY_VALUE;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length ? trimmed : EMPTY_VALUE;
    }
    return String(value);
  }, []);

  const formatNumber = useCallback(
    (value) => {
      if (value === null || value === undefined || value === "") {
        return EMPTY_VALUE;
      }
      const numericValue = typeof value === "number" ? value : Number(value);
      if (Number.isNaN(numericValue)) {
        return EMPTY_VALUE;
      }
      return numberFormatter.format(numericValue);
    },
    [numberFormatter]
  );

  const getFieldName = useCallback((rowKey, field) => `sayacGuncellemeRows.${rowKey}.${field}`, []);

  const buildPayload = useCallback(
    (state) => ({
      Kelime: state.Kelime?.trim() || "",
      LokasyonIds: normalizeIdList(state.LokasyonIds),
      MakineTipIds: normalizeIdList(state.MakineTipIds),
      SayacTipIds: normalizeIdList(state.SayacTipIds),
    }),
    []
  );

  const fetchData = useCallback(
    async (page, size, state) => {
      setLoading(true);
      try {
        const payload = buildPayload(state);
        const response = await AxiosInstance.post(`GetSayacGuncelleListesi?pagingDeger=${page}&pageSize=${size}`, payload);
        const list = Array.isArray(response?.data) ? response.data : [];
        const totalRecordsValue = Number.isFinite(Number(response?.total_records))
          ? Number(response.total_records)
          : Number.isFinite(Number(response?.count))
          ? Number(response.count)
          : list.length;
        const now = dayjs();

        const mapped = list.map((item, index) => ({
          ...item,
          key: item.SayacId ?? `${item.MakineId || "sayac"}-${index}`,
          girisTarihi: now,
          girisSaati: now,
          yeniDeger: Number.isFinite(Number(item.GuncelDeger)) ? Number(item.GuncelDeger) : null,
        }));

        mapped.forEach((item) => {
          const rowKey = item.key;
          setValue(getFieldName(rowKey, "girisTarihi"), item.girisTarihi, { shouldDirty: false, shouldTouch: false });
          setValue(getFieldName(rowKey, "girisSaati"), item.girisSaati, { shouldDirty: false, shouldTouch: false });
          setValue(getFieldName(rowKey, "yeniDeger"), item.yeniDeger, { shouldDirty: false, shouldTouch: false });
        });

        setData(mapped);
        setTotalCount(totalRecordsValue);

        if (!mapped.length) {
          message.warning(t("kayitBulunamadi", { defaultValue: "No records found." }));
        }
      } catch (error) {
        console.error("Failed to load sayac guncelleme listesi:", error);
        message.error(t("sayacGuncelleme.fetchError", { defaultValue: "Failed to load counter update list." }));
      } finally {
        setLoading(false);
      }
    },
    [buildPayload, getFieldName, setValue, t]
  );

  useEffect(() => {
    fetchData(currentPage, pageSize, appliedFilters);
  }, [fetchData, currentPage, pageSize, appliedFilters]);

  const handleApplyFilters = useCallback((nextFilters) => {
    setCurrentPage(1);
    setAppliedFilters({
      ...DEFAULT_FILTERS,
      ...nextFilters,
    });
  }, []);

  const calculateDifference = useCallback(
    (record, nextValue) => {
      if (nextValue === "" || nextValue === null || nextValue === undefined) {
        return EMPTY_VALUE;
      }
      const current = Number(record.GuncelDeger);
      const next = Number(nextValue ?? record.yeniDeger);
      if (!Number.isFinite(current) || !Number.isFinite(next)) {
        return EMPTY_VALUE;
      }
      return formatNumber(next - current);
    },
    [formatNumber]
  );

  const initialColumns = useMemo(
    () => [
      {
        title: t("makineKodu", { defaultValue: "Machine Code" }),
        dataIndex: "MakineKodu",
        key: "MakineKodu",
        ellipsis: true,
        width: 150,
        visible: true,
        render: (value, record) => {
          const codeText = formatText(value);
          const descriptionText = formatText(record.MakineTanim);
          return (
            <div>
              <div>{codeText}</div>
              {descriptionText !== EMPTY_VALUE && <div style={{ color: "#8c8c8c", fontSize: 12, lineHeight: 1.2 }}>{descriptionText}</div>}
            </div>
          );
        },
      },
      {
        title: t("makineTipi", { defaultValue: "Machine Type" }),
        dataIndex: "MakineTip",
        key: "MakineTip",
        ellipsis: true,
        width: 160,
        visible: true,
        render: formatText,
      },
      {
        title: t("lokasyon", { defaultValue: "Location" }),
        dataIndex: "LokasyonTanim",
        key: "LokasyonTanim",
        ellipsis: true,
        width: 200,
        visible: true,
        render: formatText,
      },
      {
        title: t("sayacTanimi", { defaultValue: "Counter Description" }),
        dataIndex: "SayacTanim",
        key: "SayacTanim",
        ellipsis: true,
        width: 200,
        visible: true,
        render: (value, record) => {
          const counterText = formatText(value);
          const periodText = formatText(record.Periyot);
          return (
            <div>
              <div>{counterText}</div>
              {periodText !== EMPTY_VALUE && <div style={{ color: "#8c8c8c", fontSize: 12, lineHeight: 1.2 }}>{periodText}</div>}
            </div>
          );
        },
      },
      {
        title: t("sayac.currentValue", { defaultValue: "Current Value" }),
        dataIndex: "GuncelDeger",
        key: "GuncelDeger",
        ellipsis: true,
        width: 140,
        visible: true,
        render: (value, record) => {
          const currentValueText = formatNumber(value);
          const unitText = formatText(record.Birim);
          if (unitText !== EMPTY_VALUE) {
            return `${currentValueText} - ${unitText}`;
          }
          return currentValueText;
        },
      },
      {
        title: t("sayacGuncelleme.lastReadingDate", { defaultValue: "Last Reading Date" }),
        dataIndex: "SonOkumaTarih",
        key: "SonOkumaTarih",
        ellipsis: true,
        width: 150,
        visible: true,
        render: (value) => <LocalizedDateText value={value} />,
      },
      {
        title: t("sayacGuncelleme.lastReadingTime", { defaultValue: "Last Reading Time" }),
        dataIndex: "SonOkumaSaat",
        key: "SonOkumaSaat",
        ellipsis: true,
        width: 140,
        visible: true,
        render: (value) => <LocalizedDateText value={value} mode="time" />,
      },
      {
        title: t("sayac.startDate", { defaultValue: "Entry Date" }),
        dataIndex: "girisTarihi",
        key: "girisTarihi",
        ellipsis: true,
        width: 160,
        visible: true,
        render: (_, record) => {
          const dateFieldName = getFieldName(record.key, "girisTarihi");
          const timeFieldName = getFieldName(record.key, "girisSaati");
          const currentTimeValue = watch(timeFieldName);

          return (
            <Controller
              name={dateFieldName}
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  format={dateFormat}
                  style={{ flex: 1, width: "100%" }}
                  disabledDate={disableFutureDates}
                  onChange={(value) => {
                    field.onChange(value);
                    if (!value) {
                      return;
                    }
                    const now = dayjs();
                    if (value.isSame(now, "day") && dayjs.isDayjs(currentTimeValue) && currentTimeValue.isAfter(now)) {
                      setValue(timeFieldName, now, { shouldDirty: true, shouldTouch: true });
                    }
                  }}
                />
              )}
            />
          );
        },
      },
      {
        title: t("sayac.startTime", { defaultValue: "Entry Time" }),
        dataIndex: "girisSaati",
        key: "girisSaati",
        ellipsis: true,
        width: 150,
        visible: true,
        render: (_, record) => {
          const dateFieldName = getFieldName(record.key, "girisTarihi");
          const timeFieldName = getFieldName(record.key, "girisSaati");
          const entryDate = watch(dateFieldName);

          const getDisabledTime = () => {
            if (!entryDate || !dayjs(entryDate).isSame(dayjs(), "day")) {
              return {};
            }
            const now = dayjs();
            const currentHour = now.hour();
            const currentMinute = now.minute();

            return {
              disabledHours: () => {
                const hours = [];
                for (let hour = currentHour + 1; hour < 24; hour += 1) {
                  hours.push(hour);
                }
                return hours;
              },
              disabledMinutes: (selectedHour) => {
                if (selectedHour !== currentHour) {
                  return [];
                }
                const minutes = [];
                for (let minute = currentMinute + 1; minute < 60; minute += 1) {
                  minutes.push(minute);
                }
                return minutes;
              },
            };
          };

          return (
            <Controller
              name={timeFieldName}
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  format={timeFormat}
                  needConfirm={false}
                  style={{ flex: 1, width: "100%" }}
                  disabledTime={getDisabledTime}
                  onChange={(value) => {
                    field.onChange(value);
                    if (!value) {
                      return;
                    }
                    const now = dayjs();
                    if (entryDate && dayjs(entryDate).isSame(now, "day") && value.isAfter(now)) {
                      setValue(timeFieldName, now, { shouldDirty: true, shouldTouch: true });
                    }
                  }}
                />
              )}
            />
          );
        },
      },
      {
        title: t("sayacGuncelleme.newValue", { defaultValue: "New Value" }),
        dataIndex: "yeniDeger",
        key: "yeniDeger",
        ellipsis: true,
        width: 150,
        visible: true,
        render: (_, record) => <NumberInput name1={getFieldName(record.key, "yeniDeger")} minNumber={0} />,
      },
      {
        title: t("sayacGuncelleme.calculated", { defaultValue: "Calculated" }),
        dataIndex: "hesaplanan",
        key: "hesaplanan",
        ellipsis: true,
        width: 140,
        visible: true,
        render: (_, record) => {
          const nextValue = watch(getFieldName(record.key, "yeniDeger"));
          return calculateDifference(record, nextValue);
        },
      },
    ],
    [calculateDifference, control, dateFormat, disableFutureDates, formatNumber, formatText, getFieldName, setValue, t, timeFormat, watch]
  );

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem(STORAGE_KEYS.order);
    const savedVisibility = localStorage.getItem(STORAGE_KEYS.visibility);
    const savedWidths = localStorage.getItem(STORAGE_KEYS.widths);

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

    localStorage.setItem(STORAGE_KEYS.order, JSON.stringify(order));
    localStorage.setItem(STORAGE_KEYS.visibility, JSON.stringify(visibility));
    localStorage.setItem(STORAGE_KEYS.widths, JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.order, JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(STORAGE_KEYS.visibility, JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})));
    localStorage.setItem(STORAGE_KEYS.widths, JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})));
  }, [columns]);

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

  const filteredColumns = mergedColumns.filter((col) => col.visible);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((column) => column.key === active.id);
      const newIndex = columns.findIndex((column) => column.key === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setColumns((prevColumns) => arrayMove(prevColumns, oldIndex, newIndex));
      } else {
        console.error(`Column with key ${active.id} or ${over.id} does not exist.`);
      }
    }
  };

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

  function resetColumns() {
    localStorage.removeItem(STORAGE_KEYS.order);
    localStorage.removeItem(STORAGE_KEYS.visibility);
    localStorage.removeItem(STORAGE_KEYS.widths);
    window.location.reload();
  }

  return (
    <>
      <Modal
        title={t("sutunlariYonet", { defaultValue: "Sütunları Yönet" })}
        centered
        width={800}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Text style={{ marginBottom: "15px" }}>
          {t("sutunlariYonetAciklama", { defaultValue: "Aşağıdaki Ekranlardan Sütunları Göster / Gizle ve Sıralamalarını Ayarlayabilirsiniz." })}
        </Text>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Button onClick={resetColumns} style={{ marginBottom: "15px" }}>
            {t("sutunlariSifirla", { defaultValue: "Sütunları Sıfırla" })}
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
              <Text style={{ fontWeight: 600 }}>{t("sutunlariGosterGizle", { defaultValue: "Sütunları Göster / Gizle" })}</Text>
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
                <Text style={{ fontWeight: 600 }}>{t("sutunSiralamasi", { defaultValue: "Sütunların Sıralamasını Ayarla" })}</Text>
              </div>
              <div style={{ height: "400px", overflow: "auto" }}>
                <SortableContext items={columns.filter((col) => col.visible).map((col) => col.key)} strategy={verticalListSortingStrategy}>
                  {columns
                    .filter((col) => col.visible)
                    .map((col) => (
                      <DraggableRow key={col.key} id={col.key} text={col.title} />
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
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px 8px",
              height: "32px",
            }}
            onClick={() => setIsModalVisible(true)}
          >
            <MenuOutlined />
          </Button>
          <Filters onApply={handleApplyFilters} initialValues={appliedFilters} />
        </div>
      </div>
      <Table
        components={components}
        columns={filteredColumns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalCount,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total) => `${total}`,
        }}
        onChange={(pagination) => {
          setCurrentPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
        scroll={{ x: "max-content", y: "calc(100vh - 360px)" }}
      />
    </>
  );
}

export default MainTable;
