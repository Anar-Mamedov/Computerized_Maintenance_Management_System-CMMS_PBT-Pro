import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Button, Checkbox, DatePicker, Modal, Table, TimePicker, Typography, message, Tooltip } from "antd";
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
import ValidationNumberInput from "./components/ValidationNumberInput.jsx";
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
  const { control, setValue, watch, setError, clearErrors, getValues } = useFormContext();
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [validationStates, setValidationStates] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const rowValuesRef = useRef({});
  const validationStatesRef = useRef({});
  const selectedRowsRef = useRef({});
  const rowDataRef = useRef({});
  const validationTimeoutRef = useRef({});
  const previousValuesRef = useRef({});

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

  const updateRowValues = useCallback((rowKey, updates) => {
    rowValuesRef.current[rowKey] = {
      ...(rowValuesRef.current[rowKey] || {}),
      ...updates,
    };
  }, []);

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

        const mapped = list.map((item, index) => {
          const rowKey = item.SayacId ?? `${item.MakineId || "sayac"}-${index}`;
          const storedValues = rowValuesRef.current[rowKey] || {};
          const girisTarihi = storedValues.girisTarihi ?? now;
          const girisSaati = storedValues.girisSaati ?? now;
          const yeniDeger = storedValues.yeniDeger ?? null;
          const validationState = validationStatesRef.current[rowKey];

          rowValuesRef.current[rowKey] = {
            ...storedValues,
            girisTarihi,
            girisSaati,
            yeniDeger,
          };
          rowDataRef.current[rowKey] = {
            ...item,
            key: rowKey,
            girisTarihi,
            girisSaati,
            yeniDeger,
          };

          return {
            ...item,
            key: rowKey,
            girisTarihi,
            girisSaati,
            yeniDeger,
            validationState,
          };
        });

        mapped.forEach((item) => {
          const rowKey = item.key;
          setValue(getFieldName(rowKey, "girisTarihi"), item.girisTarihi, { shouldDirty: false, shouldTouch: false });
          setValue(getFieldName(rowKey, "girisSaati"), item.girisSaati, { shouldDirty: false, shouldTouch: false });
          setValue(getFieldName(rowKey, "yeniDeger"), item.yeniDeger, { shouldDirty: false, shouldTouch: false });
          previousValuesRef.current[rowKey] = item.yeniDeger;
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

  const getRowValues = useCallback((rowKey, record) => {
    const storedValues = rowValuesRef.current[rowKey] || {};
    return {
      girisTarihi: storedValues.girisTarihi ?? record.girisTarihi,
      girisSaati: storedValues.girisSaati ?? record.girisSaati,
      yeniDeger: storedValues.yeniDeger ?? record.yeniDeger,
    };
  }, []);

  const calculateDifference = useCallback(
    (record, nextValue) => {
      if (nextValue === "" || nextValue === null || nextValue === undefined) {
        return EMPTY_VALUE;
      }

      const valNum = Number(nextValue);
      if (Number.isNaN(valNum)) {
        return EMPTY_VALUE;
      }

      const current = Number(record.GuncelDeger);
      if (!Number.isFinite(current)) {
        return EMPTY_VALUE;
      }

      const diff = valNum - current;
      const sign = diff >= 0 ? "+" : "";
      return `${sign}${formatNumber(diff)}`;
    },
    [formatNumber]
  );

  const validateDifferentDateTimeValue = useCallback(
    async (record, dateValue, timeValue, yeniDeger) => {
      if (!record.SayacId || yeniDeger === "" || yeniDeger === null || yeniDeger === undefined) {
        return { isValid: true, color: undefined };
      }

      try {
        const formattedDate = dayjs(dateValue).format("YYYY-MM-DD");
        const formattedTime = dayjs(timeValue).format("HH:mm");

        const payload = {
          SayacId: record.SayacId,
          Tarih: formattedDate,
          Saat: formattedTime,
          YeniDeger: Number(yeniDeger),
        };

        const response = await AxiosInstance.post("CheckSayacGirisUygunlugu", payload);

        if (response?.IsValid === true) {
          return {
            isValid: true,
            color: "green",
            message: response.Message || t("sayacGuncelleme.validEntry", { defaultValue: "Geçerli kayıt" }),
          };
        }

        return {
          isValid: false,
          color: "red",
          message: response?.Message || t("sayacGuncelleme.invalidEntry", { defaultValue: "Geçersiz kayıt" }),
          minValidValue: response?.MinValidValue,
          maxValidValue: response?.MaxValidValue,
        };
      } catch (error) {
        console.error("Validation error:", error);
        return {
          isValid: false,
          color: "red",
          message: t("sayacGuncelleme.validationError", { defaultValue: "Doğrulama hatası" }),
        };
      }
    },
    [t]
  );

  const performValidation = useCallback(
    async (record) => {
      const rowKey = record.key;
      const dateFieldName = getFieldName(rowKey, "girisTarihi");
      const timeFieldName = getFieldName(rowKey, "girisSaati");
      const valueFieldName = getFieldName(rowKey, "yeniDeger");

      const storedValues = rowValuesRef.current[rowKey] || {};
      const watchedDate = getValues(dateFieldName);
      const watchedTime = getValues(timeFieldName);
      const watchedValue = getValues(valueFieldName);
      const dateValue = watchedDate !== undefined ? watchedDate : storedValues.girisTarihi ?? record.girisTarihi;
      const timeValue = watchedTime !== undefined ? watchedTime : storedValues.girisSaati ?? record.girisSaati;
      const yeniDeger = watchedValue !== undefined ? watchedValue : storedValues.yeniDeger ?? record.yeniDeger;

      rowValuesRef.current[rowKey] = {
        ...storedValues,
        girisTarihi: dateValue,
        girisSaati: timeValue,
        yeniDeger,
      };

      if (yeniDeger === "" || yeniDeger === null || yeniDeger === undefined) {
        clearErrors([dateFieldName, timeFieldName, valueFieldName]);

        const clearedState = { isValid: true, color: undefined };

        setData((prevData) => prevData.map((item) => (item.key === rowKey ? { ...item, validationState: clearedState } : item)));

        setValidationStates((prev) => ({
          ...prev,
          [rowKey]: clearedState,
        }));
        validationStatesRef.current[rowKey] = clearedState;
        return;
      }

      const result = await validateDifferentDateTimeValue(record, dateValue, timeValue, yeniDeger);

      const newState = {
        isValid: result.isValid,
        color: result.color,
        message: result.message,
      };

      if (result.isValid) {
        clearErrors([dateFieldName, timeFieldName, valueFieldName]);
      } else {
        setError(valueFieldName, { type: "validation", message: result.message });
        setError(dateFieldName, { type: "validation", message: result.message });
        setError(timeFieldName, { type: "validation", message: result.message });
      }

      setData((prevData) => prevData.map((item) => (item.key === rowKey ? { ...item, validationState: newState } : item)));

      setValidationStates((prev) => ({
        ...prev,
        [rowKey]: newState,
      }));
      validationStatesRef.current[rowKey] = newState;
      return newState;
    },
    [getFieldName, getValues, validateDifferentDateTimeValue, setValidationStates, setError, clearErrors, setData]
  );

  const initialColumns = useMemo(
    () => [
      {
        title: t("makine", { defaultValue: "Makine" }),
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
        title: t("sayac", { defaultValue: "Sayaç" }),
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
        title: t("sayacGuncelleme.currentDateTime", { defaultValue: "Güncel Tarih-Saat" }),
        dataIndex: "SonOkumaTarih",
        key: "SonOkumaTarih",
        ellipsis: true,
        width: 180,
        visible: true,
        render: (_, record) => <LocalizedDateText value={record.SonOkumaTarih} timeValue={record.SonOkumaSaat} mode="datetime" />,
      },
      {
        title: t("sayacGuncelleme.entryDate", { defaultValue: "Giriş Tarihi" }),
        dataIndex: "girisTarihi",
        key: "girisTarihi",
        ellipsis: true,
        width: 160,
        visible: true,
        render: (_, record) => {
          const dateFieldName = getFieldName(record.key, "girisTarihi");
          const timeFieldName = getFieldName(record.key, "girisSaati");
          const currentTimeValue = watch(timeFieldName);
          const validationState = record.validationState;

          const datePickerStyle = {
            flex: 1,
            width: "100%",
            ...(validationState?.color === "green" && {
              borderColor: "#52c41a",
              boxShadow: "0 0 0 2px rgba(82, 196, 26, 0.2)",
            }),
            ...(validationState?.color === "red" && {
              borderColor: "#ff4d4f",
              boxShadow: "0 0 0 2px rgba(255, 77, 79, 0.2)",
            }),
          };

          const datePickerStatus = validationState?.color === "red" ? "error" : undefined;

          return (
            <Controller
              name={dateFieldName}
              control={control}
              rules={{ required: false }}
              render={({ field, fieldState }) => (
                <DatePicker
                  {...field}
                  format={dateFormat}
                  style={datePickerStyle}
                  status={datePickerStatus || (fieldState.error ? "error" : "")}
                  disabledDate={disableFutureDates}
                  onChange={(value) => {
                    field.onChange(value);
                    updateRowValues(record.key, { girisTarihi: value });
                    if (!value) {
                      return;
                    }
                    const now = dayjs();
                    if (value.isSame(now, "day") && dayjs.isDayjs(currentTimeValue) && currentTimeValue.isAfter(now)) {
                      setValue(timeFieldName, now, { shouldDirty: true, shouldTouch: true });
                      updateRowValues(record.key, { girisSaati: now });
                    }

                    const yeniDegerValue = watch(getFieldName(record.key, "yeniDeger"));
                    if (yeniDegerValue !== null && yeniDegerValue !== undefined && yeniDegerValue !== "") {
                      if (validationTimeoutRef.current[record.key]) {
                        clearTimeout(validationTimeoutRef.current[record.key]);
                      }
                      validationTimeoutRef.current[record.key] = setTimeout(() => {
                        performValidation(record);
                      }, 300);
                    }
                  }}
                />
              )}
            />
          );
        },
      },
      {
        title: t("sayacGuncelleme.entryTime", { defaultValue: "Giriş Saati" }),
        dataIndex: "girisSaati",
        key: "girisSaati",
        ellipsis: true,
        width: 150,
        visible: true,
        render: (_, record) => {
          const dateFieldName = getFieldName(record.key, "girisTarihi");
          const timeFieldName = getFieldName(record.key, "girisSaati");
          const entryDate = watch(dateFieldName);
          const validationState = record.validationState;

          const timePickerStyle = {
            flex: 1,
            width: "100%",
            ...(validationState?.color === "green" && {
              borderColor: "#52c41a",
              boxShadow: "0 0 0 2px rgba(82, 196, 26, 0.2)",
            }),
            ...(validationState?.color === "red" && {
              borderColor: "#ff4d4f",
              boxShadow: "0 0 0 2px rgba(255, 77, 79, 0.2)",
            }),
          };

          const timePickerStatus = validationState?.color === "red" ? "error" : undefined;

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
              render={({ field, fieldState }) => (
                <TimePicker
                  {...field}
                  format={timeFormat}
                  needConfirm={false}
                  style={timePickerStyle}
                  status={timePickerStatus || (fieldState.error ? "error" : "")}
                  disabledTime={getDisabledTime}
                  onChange={(value) => {
                    field.onChange(value);
                    updateRowValues(record.key, { girisSaati: value });
                    if (!value) {
                      return;
                    }
                    const now = dayjs();
                    if (entryDate && dayjs(entryDate).isSame(now, "day") && value.isAfter(now)) {
                      setValue(timeFieldName, now, { shouldDirty: true, shouldTouch: true });
                      updateRowValues(record.key, { girisSaati: now });
                    }

                    const yeniDegerValue = watch(getFieldName(record.key, "yeniDeger"));
                    if (yeniDegerValue !== null && yeniDegerValue !== undefined && yeniDegerValue !== "") {
                      if (validationTimeoutRef.current[record.key]) {
                        clearTimeout(validationTimeoutRef.current[record.key]);
                      }
                      validationTimeoutRef.current[record.key] = setTimeout(() => {
                        performValidation(record);
                      }, 300);
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
        render: (_, record) => {
          const valueFieldName = getFieldName(record.key, "yeniDeger");
          const validationState = record.validationState;

          const handleValueChange = (nextValue) => {
            previousValuesRef.current[record.key] = nextValue;
            updateRowValues(record.key, { yeniDeger: nextValue });
          };

          const handleValueBlur = () => {
            const newValue = getValues(valueFieldName);
            updateRowValues(record.key, { yeniDeger: newValue });
            if (validationTimeoutRef.current[record.key]) {
              clearTimeout(validationTimeoutRef.current[record.key]);
            }
            performValidation(record);
            previousValuesRef.current[record.key] = newValue;
          };

          const content = (
            <span style={{ display: "inline-block", width: "100%" }}>
              <ValidationNumberInput
                name1={valueFieldName}
                minNumber={0}
                validationColor={validationState?.color}
                onValueChange={handleValueChange}
                onValueBlur={handleValueBlur}
              />
            </span>
          );

          if (validationState?.message) {
            return (
              <Tooltip title={validationState.message} color={validationState.color === "green" ? "#52c41a" : "#ff4d4f"}>
                {content}
              </Tooltip>
            );
          }

          return content;
        },
      },
      {
        title: t("sayacGuncelleme.calculated", { defaultValue: "Calculated" }),
        dataIndex: "hesaplanan",
        key: "hesaplanan",
        ellipsis: false,
        width: 200,
        visible: true,
        render: (_, record) => {
          const nextValue = watch(getFieldName(record.key, "yeniDeger"));
          return calculateDifference(record, nextValue);
        },
      },
    ],
    [
      calculateDifference,
      control,
      dateFormat,
      disableFutureDates,
      formatNumber,
      formatText,
      getFieldName,
      getValues,
      performValidation,
      setValue,
      t,
      timeFormat,
      updateRowValues,
      watch,
    ]
  );

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem(STORAGE_KEYS.order);
    const savedVisibility = localStorage.getItem(STORAGE_KEYS.visibility);
    const savedWidths = localStorage.getItem(STORAGE_KEYS.widths);

    const availableKeys = new Set(initialColumns.map((col) => col.key));
    let order = savedOrder ? JSON.parse(savedOrder) : [];
    let visibility = savedVisibility ? JSON.parse(savedVisibility) : {};
    let widths = savedWidths ? JSON.parse(savedWidths) : {};

    order = order.filter((key) => availableKeys.has(key));

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

  const updateSelectedRows = useCallback(
    (nextKeys) => {
      const nextMap = { ...selectedRowsRef.current };
      data.forEach((row) => {
        if (nextKeys.includes(row.key)) {
          nextMap[row.key] = row;
        } else {
          delete nextMap[row.key];
        }
      });
      selectedRowsRef.current = nextMap;
    },
    [data]
  );

  const handleRowSelectionChange = useCallback(
    (nextKeys) => {
      setSelectedRowKeys(nextKeys);
      updateSelectedRows(nextKeys);
    },
    [updateSelectedRows]
  );

  useEffect(() => {
    if (selectedRowKeys.length) {
      updateSelectedRows(selectedRowKeys);
    }
  }, [data, selectedRowKeys, updateSelectedRows]);

  const rowSelection = useMemo(
    () => ({
      type: "checkbox",
      selectedRowKeys,
      onChange: handleRowSelectionChange,
      preserveSelectedRowKeys: true,
    }),
    [handleRowSelectionChange, selectedRowKeys]
  );

  const handleUpdate = useCallback(async () => {
    const allRecords = Object.values(rowDataRef.current);
    const rowsWithValue = allRecords.filter((record) => {
      const rowValues = getRowValues(record.key, record);
      return rowValues.yeniDeger !== "" && rowValues.yeniDeger !== null && rowValues.yeniDeger !== undefined;
    });

    if (!rowsWithValue.length) {
      message.warning(t("sayacGuncelleme.noNewValue", { defaultValue: "Yeni değer girilmiş kayıt bulunamadı." }));
      return;
    }

    setIsSaving(true);
    try {
      const validRows = rowsWithValue.filter((record) => {
        return validationStatesRef.current[record.key]?.color === "green";
      });

      const payload = validRows
        .map((record) => {
          const rowValues = getRowValues(record.key, record);
          const yeniDeger = rowValues.yeniDeger;

          if (yeniDeger === "" || yeniDeger === null || yeniDeger === undefined) {
            return null;
          }

          const yeniDegerNum = Number(yeniDeger);
          if (!Number.isFinite(yeniDegerNum)) {
            return null;
          }

          const guncelDeger = Number(record.GuncelDeger);
          const artisDeger = Number.isFinite(guncelDeger) ? yeniDegerNum - guncelDeger : yeniDegerNum;
          const girisTarihi = rowValues.girisTarihi ? dayjs(rowValues.girisTarihi) : dayjs();
          const girisSaati = rowValues.girisSaati ? dayjs(rowValues.girisSaati) : dayjs();

          return {
            SayacId: record.SayacId,
            LokasyonId: record.LokasyonId ?? record.LokasyonID,
            MakineId: record.MakineId ?? record.MakineID,
            Tarih: girisTarihi.format("YYYY-MM-DD"),
            Saat: girisSaati.format("HH:mm"),
            OkunanDeger: yeniDegerNum,
            ArtisDeger: artisDeger,
            Aciklama: record.Aciklama || "",
          };
        })
        .filter(Boolean);

      if (!payload.length) {
        message.warning(t("sayacGuncelleme.noValidRows", { defaultValue: "Gönderilecek geçerli kayıt bulunamadı." }));
        return;
      }

      const response = await AxiosInstance.post("KaydetSeciliSayaclar", payload);
      message.success(response?.message || t("sayacGuncelleme.saveSuccess", { defaultValue: "Sayaçlar güncellendi." }));
      if (response?.status_code === 200) {
        Object.keys(rowValuesRef.current).forEach((rowKey) => {
          rowValuesRef.current[rowKey] = {
            ...rowValuesRef.current[rowKey],
            yeniDeger: null,
          };
          rowDataRef.current[rowKey] = {
            ...rowDataRef.current[rowKey],
            yeniDeger: null,
          };
          setValue(getFieldName(rowKey, "yeniDeger"), null, { shouldDirty: false, shouldTouch: false });
        });
        setData((prevData) =>
          prevData.map((item) => ({
            ...item,
            yeniDeger: null,
            validationState: undefined,
          }))
        );
        setValidationStates({});
        validationStatesRef.current = {};
        clearErrors();
        fetchData(currentPage, pageSize, appliedFilters);
      }
    } catch (error) {
      console.error("Failed to update selected counters:", error);
      message.error(t("sayacGuncelleme.saveError", { defaultValue: "Sayaç güncelleme kayıtları gönderilemedi." }));
    } finally {
      setIsSaving(false);
    }
  }, [appliedFilters, currentPage, fetchData, getFieldName, getRowValues, pageSize, setValue, t]);

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
          alignItems: "center",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            flex: 1,
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
        <Button type="primary" onClick={handleUpdate} loading={isSaving} style={{ marginLeft: "auto" }}>
          {t("guncelle", { defaultValue: "Güncelle" })}
        </Button>
      </div>
      <Table
        components={components}
        rowKey="key"
        columns={filteredColumns}
        dataSource={data}
        loading={loading}
        rowSelection={rowSelection}
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
