import React, { useState, useEffect, useMemo, useRef } from "react";
import { Modal, Table, Button, Checkbox, Typography, Input, Space, DatePicker, InputNumber, TimePicker, Form, message } from "antd";
import { MenuOutlined, SearchOutlined, SaveOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../api/http.jsx";
import { DndContext, PointerSensor, useSensor, useSensors, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DraggableRow from "./DraggableRow.jsx";
import Filters from "./components/Filters.jsx";
import { useForm } from "antd/lib/form/Form";
import RaporGrupSelectbox from "./RaporGrupSelectbox.jsx";
import { t } from "i18next";

dayjs.extend(customParseFormat);

const { Text } = Typography;

const arrayMove = (array, from, to) => {
  const newArray = [...array];
  const [movedItem] = newArray.splice(from, 1);
  newArray.splice(to, 0, movedItem);
  return newArray;
};

const pxToWch = (px) => Math.ceil(px / 7); // 1 wch ≈ 7px

function RecordModal({ selectedRow, onDrawerClose, drawerVisible }) {
  // ------------------ STATE ------------------
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [initialColumns, setInitialColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  const [manageColumnsVisible, setManageColumnsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});
  const [filters, setFilters] = useState({});
  const [kullaniciRaporu, setKullaniciRaporu] = useState({});
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [filtersLabel, setFiltersLabel] = useState({});
  const searchInput = useRef(null);
  const [form] = useForm();
  const lan = localStorage.getItem("i18nextLng") || "tr";

  // ------------------ EFFECTS ------------------
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchLists();
    }
  }, [filters]);

  const handleFilterSubmit = (values) => {
    setFilters([values]);
    setKullaniciRaporu(true);
  };

  const fetchFilters = async () => {
    try {
      const response = await AxiosInstance.get(`RaporFiltreListele?RaporID=${selectedRow.key}`);
      const filteredResponse = {
        LokasyonID: response[0].LokasyonID,
        AtolyeID: response[0].AtolyeID,
        BaslamaTarih: response[0].BaslamaTarih,
        BitisTarih: response[0].BitisTarih,
      };
      const filtersLabel = {
        LokasyonName: response[0].Lokasyonlar,
        AtolyeName: response[0].Atolyeler,
        LokasyonID: response[0].LokasyonID,
        AtolyeID: response[0].AtolyeID,
        BaslamaTarih: response[0].BaslamaTarih,
        BitisTarih: response[0].BitisTarih,
      };
      setFilters([filteredResponse]);
      setKullaniciRaporu(response[0].KullaniciRaporu);
      setFiltersLabel(filtersLabel);
    } catch (error) {
      console.error("Filtreler yüklenirken bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    if (drawerVisible && selectedRow) {
      setLoading(true);
      fetchFilters();
    } else {
      // Reset when modal is closed
      setTableData([]);
      setOriginalData([]);
      setKullaniciRaporu({});
      setInitialColumns([]);
      setColumns([]);
      setColumnFilters({});
      setFilters({});
    }
  }, [drawerVisible, selectedRow]);

  // ------------------ DATA FETCH ------------------
  const fetchLists = async () => {
    setLoading(true);
    AxiosInstance.post(`GetReportDetail?KullaniciRaporu=${kullaniciRaporu}`, {
      id: selectedRow.key,
      lan: lan,
      ...filters[0],
    })
      .then((response) => {
        const { headers, list } = response;
        if (headers && headers.length > 0) {
          // Map headers to columns
          const cols = headers.map((header) => {
            // Calculate width based on header length
            const headerLength = header.title.length;
            const width = Math.max(headerLength * 10, 150);

            return {
              title: header.title,
              dataIndex: header.dataIndex,
              key: header.dataIndex,
              visible: header.visible,
              width,
              isDate: header.isDate,
              isYear: header.isYear,
              isHour: header.isHour,
              isNumber: header.isNumber,
              // Potential existing default filters:
              isFilter: header.isFilter, // e.g. "drenaj"
              isFilter1: header.isFilter1, // e.g. "foo"
            };
          });

          setInitialColumns(cols);
          setColumns(cols);
          setTableData(list);
          setOriginalData(list);

          // Initialize columnFilters from any non-empty isFilter/isFilter1 strings
          const defaultFilters = {};
          cols.forEach((col) => {
            const val1 = col.isFilter?.trim() || "";
            const val2 = col.isFilter1?.trim() || "";
            if (val1 !== "" || val2 !== "") {
              defaultFilters[col.dataIndex] = [val1, val2];
            }
          });
          setColumnFilters(defaultFilters);

          // Apply these default filters immediately
          const filtered = applyAllFilters(defaultFilters, cols, list);
          setTableData(filtered);
        }
      })
      .catch((error) => {
        console.error("Error fetching detail:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ------------------ FILTERS: MAIN LOGIC ------------------
  const applyAllFilters = (filtersObj = {}, cols = columns, data = originalData) => {
    let filteredData = [...data];

    Object.keys(filtersObj).forEach((colKey) => {
      const [val1, val2] = filtersObj[colKey] || ["", ""];
      const column = cols.find((c) => c.dataIndex === colKey);
      if (!column) return;

      // Handle numeric/date/year/hour columns or skip if you only want to do text
      if (column.isYear || column.isDate || column.isNumber || column.isHour) {
        // (Handle numeric or date logic if needed)
        return;
      }

      // ELSE: String-based filtering
      if (val1 !== "" || val2 !== "") {
        filteredData = filteredData.filter((row) => {
          const cellValue = row[colKey] ? row[colKey].toString().toLowerCase() : "";
          // AND logic
          if (val1 && !cellValue.includes(val1.toLowerCase())) return false;
          if (val2 && !cellValue.includes(val2.toLowerCase())) return false;
          return true;
        });
      }
    });

    return filteredData;
  };

  // ------------------ SEARCH & RESET ------------------
  const handleSearch = (selectedKeys, dataIndex, closeDropdown, setSelectedKeys) => {
    // 1) Update columnFilters
    setColumnFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        [dataIndex]: [selectedKeys[0] || "", selectedKeys[1] || ""],
      };
      const filtered = applyAllFilters(newFilters, columns, originalData);
      setTableData(filtered);
      return newFilters;
    });

    // 2) **Also update the columns array** so isFilter/isFilter1 reflect the user's input
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        if (col.dataIndex === dataIndex) {
          const updated = { ...col };
          if (typeof updated.isFilter !== "undefined") {
            updated.isFilter = selectedKeys[0] || "";
          }
          if (typeof updated.isFilter1 !== "undefined") {
            updated.isFilter1 = selectedKeys[1] || "";
          }
          return updated;
        }
        return col;
      })
    );

    closeDropdown && closeDropdown();
  };

  const handleReset = (dataIndex, closeDropdown, setSelectedKeys) => {
    setSelectedKeys([]);
    // 1) Remove from columnFilters
    setColumnFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[dataIndex];
      const filtered = applyAllFilters(newFilters, columns, originalData);
      setTableData(filtered);
      return newFilters;
    });

    // 2) Reset isFilter/isFilter1 in columns
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        if (col.dataIndex === dataIndex) {
          const updated = { ...col };
          if (typeof updated.isFilter !== "undefined") {
            updated.isFilter = "";
          }
          if (typeof updated.isFilter1 !== "undefined") {
            updated.isFilter1 = "";
          }
          return updated;
        }
        return col;
      })
    );

    closeDropdown && closeDropdown();
  };

  // ------------------ GET FILTER DROPDOWN PROPS ------------------
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, closeDropdown, close }) => {
      const column = columns.find((col) => col.dataIndex === dataIndex);
      if (!column) return null;

      // YEAR FILTER
      if (column.isYear) {
        return (
          <div style={{ padding: 8 }}>
            <Space direction="vertical">
              <DatePicker
                picker="year"
                placeholder="Min Yıl"
                value={selectedKeys[0] ? dayjs(selectedKeys[0], "YYYY") : null}
                onChange={(date) => {
                  const val = date ? date.year().toString() : "";
                  setSelectedKeys([val, selectedKeys[1] || ""]);
                }}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <DatePicker
                picker="year"
                placeholder="Max Yıl"
                value={selectedKeys[1] ? dayjs(selectedKeys[1], "YYYY") : null}
                onChange={(date) => {
                  const val = date ? date.year().toString() : "";
                  setSelectedKeys([selectedKeys[0] || "", val]);
                }}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                  onClick={() => handleSearch(selectedKeys, dataIndex, closeDropdown, setSelectedKeys)}
                >
                  Ara
                </Button>
                <Button size="small" style={{ width: 90 }} onClick={() => handleReset(dataIndex, closeDropdown, setSelectedKeys)}>
                  Sıfırla
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    close();
                  }}
                >
                  Kapat
                </Button>
              </Space>
            </Space>
          </div>
        );
      }

      // DATE FILTER
      if (column.isDate) {
        return (
          <div style={{ padding: 8 }}>
            <Space direction="vertical">
              <DatePicker
                format="DD.MM.YYYY"
                placeholder="Başlangıç Tarihi"
                value={selectedKeys[0] ? dayjs(selectedKeys[0], "DD.MM.YYYY", true) : null}
                onChange={(date) => {
                  const val = date ? date.format("DD.MM.YYYY") : "";
                  setSelectedKeys([val, selectedKeys[1] || ""]);
                }}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <DatePicker
                format="DD.MM.YYYY"
                placeholder="Bitiş Tarihi"
                value={selectedKeys[1] ? dayjs(selectedKeys[1], "DD.MM.YYYY", true) : null}
                onChange={(date) => {
                  const val = date ? date.format("DD.MM.YYYY") : "";
                  setSelectedKeys([selectedKeys[0] || "", val]);
                }}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                  onClick={() => handleSearch(selectedKeys, dataIndex, closeDropdown, setSelectedKeys)}
                >
                  Ara
                </Button>
                <Button size="small" style={{ width: 90 }} onClick={() => handleReset(dataIndex, closeDropdown, setSelectedKeys)}>
                  Sıfırla
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    close();
                  }}
                >
                  Kapat
                </Button>
              </Space>
            </Space>
          </div>
        );
      }

      // HOUR FILTER
      if (column.isHour) {
        return (
          <div style={{ padding: 8 }}>
            <Space direction="vertical">
              <TimePicker
                format="HH:mm"
                placeholder="Min Saat"
                value={selectedKeys[0] ? dayjs(selectedKeys[0], "HH:mm") : null}
                onChange={(time) => {
                  const val = time ? time.format("HH:mm") : "";
                  setSelectedKeys([val, selectedKeys[1] || ""]);
                }}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <TimePicker
                format="HH:mm"
                placeholder="Max Saat"
                value={selectedKeys[1] ? dayjs(selectedKeys[1], "HH:mm") : null}
                onChange={(time) => {
                  const val = time ? time.format("HH:mm") : "";
                  setSelectedKeys([selectedKeys[0] || "", val]);
                }}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                  onClick={() => handleSearch(selectedKeys, dataIndex, closeDropdown, setSelectedKeys)}
                >
                  Ara
                </Button>
                <Button size="small" style={{ width: 90 }} onClick={() => handleReset(dataIndex, closeDropdown, setSelectedKeys)}>
                  Sıfırla
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    close();
                  }}
                >
                  Kapat
                </Button>
              </Space>
            </Space>
          </div>
        );
      }

      // NUMBER FILTER
      if (column.isNumber) {
        return (
          <div style={{ padding: 8 }}>
            <Space direction="vertical">
              <InputNumber
                placeholder="Min Değer"
                value={selectedKeys[0]}
                onChange={(value) => setSelectedKeys([value !== null ? value : "", selectedKeys[1] || ""])}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <InputNumber
                placeholder="Max Değer"
                value={selectedKeys[1]}
                onChange={(value) => setSelectedKeys([selectedKeys[0] || "", value !== null ? value : ""])}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                  onClick={() => handleSearch(selectedKeys, dataIndex, closeDropdown, setSelectedKeys)}
                >
                  Ara
                </Button>
                <Button size="small" style={{ width: 90 }} onClick={() => handleReset(dataIndex, closeDropdown, setSelectedKeys)}>
                  Sıfırla
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    close();
                  }}
                >
                  Kapat
                </Button>
              </Space>
            </Space>
          </div>
        );
      }

      // STRING-BASED FILTER
      const currentValues = columnFilters[dataIndex] || ["", ""];

      return (
        <div style={{ padding: 8, width: 300 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            {/* Filter #1 */}
            <Input
              placeholder="Filter #1"
              value={selectedKeys[0] ?? currentValues[0]}
              onChange={(e) => {
                const newVal1 = e.target.value;
                const newVal2 = selectedKeys[1] ?? currentValues[1];
                setSelectedKeys([newVal1, newVal2]);
              }}
              onPressEnter={() => handleSearch(selectedKeys, dataIndex, closeDropdown, setSelectedKeys)}
              style={{ width: "100%" }}
            />

            {/* If you also want a second input, uncomment below */}
            {/* 
            <Input
              placeholder="Filter #2"
              value={selectedKeys[1] ?? currentValues[1]}
              onChange={(e) => {
                const newVal2 = e.target.value;
                const newVal1 = selectedKeys[0] ?? currentValues[0];
                setSelectedKeys([newVal1, newVal2]);
              }}
              onPressEnter={() =>
                handleSearch(
                  selectedKeys,
                  dataIndex,
                  closeDropdown,
                  setSelectedKeys
                )
              }
              style={{ width: "100%" }}
            />
            */}

            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
                onClick={() => handleSearch(selectedKeys, dataIndex, closeDropdown, setSelectedKeys)}
              >
                Ara
              </Button>
              <Button size="small" style={{ width: 90 }} onClick={() => handleReset(dataIndex, closeDropdown, setSelectedKeys)}>
                Sıfırla
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                Kapat
              </Button>
            </Space>
          </Space>
        </div>
      );
    },
    filterIcon: () => {
      const vals = columnFilters[dataIndex] || [];
      const isFiltered = vals.some((v) => v && v.toString().trim() !== "");
      return <SearchOutlined style={{ color: isFiltered ? "#1890ff" : undefined }} />;
    },
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  // ------------------ VISIBILITY & DRAGGING ------------------
  const visibleColumns = useMemo(() => columns.filter((col) => col.visible), [columns]);

  const toggleVisibility = (key, checked) => {
    setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, visible: checked } : col)));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumns((prevColumns) => {
        const visibleCols = prevColumns.filter((col) => col.visible);
        const oldIndex = visibleCols.findIndex((col) => col.key === active.id);
        const newIndex = visibleCols.findIndex((col) => col.key === over.id);

        if (oldIndex === -1 || newIndex === -1) {
          return prevColumns;
        }
        const newVisibleCols = arrayMove(visibleCols, oldIndex, newIndex);

        const newColumns = [];
        let vi = 0;
        for (let i = 0; i < prevColumns.length; i++) {
          if (prevColumns[i].visible) {
            newColumns.push(newVisibleCols[vi]);
            vi++;
          } else {
            newColumns.push(prevColumns[i]);
          }
        }
        return newColumns;
      });
    }
  };

  // ------------------ XLSX EXPORT ------------------
  const handleExportXLSX = () => {
    const headers = visibleColumns.map((col) => col.title);
    const dataRows = tableData.map((row) => visibleColumns.map((col) => (row[col.dataIndex] !== null && row[col.dataIndex] !== undefined ? row[col.dataIndex] : "")));

    const sheetData = [headers, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    const columnWidths = visibleColumns.map((col) => {
      const headerLength = col.title.length;
      const maxDataLength = tableData.reduce((max, row) => {
        const cell = row[col.dataIndex];
        if (!cell) return max;
        const cellStr = cell.toString();
        return Math.max(max, cellStr.length);
      }, 0);
      const maxLength = Math.max(headerLength, maxDataLength);
      return { wch: pxToWch(maxLength * 10) };
    });
    ws["!cols"] = columnWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "tablo_export.xlsx");
  };

  // ------------------ RENDER ------------------
  const styledColumns = useMemo(() => {
    return visibleColumns.map((col) => {
      const searchProps = getColumnSearchProps(col.dataIndex);
      return {
        ...col,
        ...searchProps,
        onHeaderCell: () => ({
          style: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }),
        onCell: () => ({
          style: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }),
        render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text !== null && text !== undefined ? text : "\u00A0"}</span>,
      };
    });
  }, [visibleColumns, columnFilters]);

  const handleRecordModalClose = () => {
    onDrawerClose();
  };

  const handleSaveColumns = () => {
    console.log("columns", columns);
    setSaveModalVisible(true);
  };

  const onFinish = (values) => {
    // console.log("Success:", values);
    saveReport(values);
  };
  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
  };

  const saveReport = async (values) => {
    const body = {
      EskiRaporID: selectedRow.key,
      YeniRaporGrupID: values.reportID,
      YeniRaporAdi: values.nameOfReport,
      LokasyonID: filters[0].LokasyonID,
      AtolyeID: filters[0].AtolyeID,
      BaslamaTarih: filters[0].BaslamaTarih,
      BitisTarih: filters[0].BitisTarih,
      YeniRaporAciklama: values.raporAciklama,
      Basliklar: columns,
    };
    try {
      const response = await AxiosInstance.post(`SaveNewReport`, body);
      if (response.status_code == 200) {
        message.success("Ekleme Başarılı");
        setSaveModalVisible(false);
      }
      console.log("response", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Modal destroyOnClose title={selectedRow?.RPR_TANIM} open={drawerVisible} onCancel={handleRecordModalClose} footer={null} width="90%">
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Button style={{ padding: "0px", width: "32px", height: "32px" }} onClick={() => setManageColumnsVisible(true)}>
              <MenuOutlined />
            </Button>
            <Filters filtersLabel={filtersLabel} onSubmit={handleFilterSubmit} />
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Button onClick={handleSaveColumns} type="primary" style={{ display: "flex", alignItems: "center" }}>
              <SaveOutlined />
              Kaydet
            </Button>

            <Button style={{ display: "flex", alignItems: "center" }} onClick={handleExportXLSX} icon={<SiMicrosoftexcel />}>
              İndir
            </Button>
          </div>
        </div>

        <Table
          columns={styledColumns}
          dataSource={tableData}
          loading={loading}
          rowKey={(record) => (record.ID ? record.ID : JSON.stringify(record))}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            defaultPageSize: 10,
          }}
          scroll={{ y: "calc(100vh - 340px)", x: "max-content" }}
          locale={{
            emptyText: loading ? "Yükleniyor..." : "Eşleşen veri bulunamadı.",
          }}
          style={{ tableLayout: "auto" }}
        />
      </Modal>

      <Modal title="Raporu Kaydet" centered width={500} open={saveModalVisible} onOk={() => form.submit()} onCancel={() => setSaveModalVisible(false)}>
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ display: "flex", flexWrap: "wrap", columnGap: "10px" }}
        >
          <Form.Item
            label="Rapor Adı"
            name="nameOfReport"
            style={{ width: "430px", marginBottom: "10px" }}
            rules={[
              {
                required: true,
                message: t("alanBosBirakilamaz"),
              },
            ]}
          >
            <Input placeholder={t("raporAdi")} />
          </Form.Item>

          <RaporGrupSelectbox form={form} />

          <Form.Item
            label="Açıklama"
            name="raporAciklama"
            style={{ width: "430px", marginBottom: "10px" }}
            rules={[
              {
                required: true,
                message: t("alanBosBirakilamaz"),
              },
            ]}
          >
            <Input.TextArea placeholder={t("aciklamaGir")} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Manage Columns Modal */}
      <Modal title="Sütunları Yönet" centered width={800} open={manageColumnsVisible} onOk={() => setManageColumnsVisible(false)} onCancel={() => setManageColumnsVisible(false)}>
        <Text style={{ marginBottom: "15px", display: "block" }}>Aşağıdaki Ekranlardan Sütunları Göster / Gizle, Sıralamalarını ve Genişliklerini Ayarlayabilirsiniz.</Text>

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Button
            onClick={() => {
              setColumns(initialColumns);
              setColumnFilters({});
              setTableData(originalData);
            }}
            style={{ marginBottom: "15px" }}
          >
            Sütunları Sıfırla
          </Button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Show/Hide Columns Section */}
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
                <div
                  key={col.key}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Checkbox checked={columns.find((column) => column.key === col.key)?.visible || false} onChange={(e) => toggleVisibility(col.key, e.target.checked)} />
                  {col.title}
                </div>
              ))}
            </div>
          </div>

          {/* Sort Columns Section */}
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
                <SortableContext items={visibleColumns.map((col) => col.key)} strategy={verticalListSortingStrategy}>
                  {visibleColumns.map((col) => (
                    <DraggableRow key={col.key} id={col.key} text={col.title} />
                  ))}
                </SortableContext>
              </div>
            </div>
          </DndContext>
        </div>
      </Modal>
    </>
  );
}

export default RecordModal;
