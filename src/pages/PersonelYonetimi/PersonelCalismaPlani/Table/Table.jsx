import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Calendar, Button, Spin, Typography, Card, Row, Col, Space, Tag, Popover, Select, Badge, Modal, DatePicker, Radio, List } from "antd";
import { LeftOutlined, RightOutlined, CalendarOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import Filters from "./filter/Filters";
import IsEmri from "../../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/tr";

dayjs.locale("tr");
const { Text } = Typography;

const MainCalendar = () => {
  const { setValue } = useFormContext() || {};
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  
  const [currentDate, setCurrentDate] = useState(dayjs()); 
  const [calendarMode, setCalendarMode] = useState("Month");

  const [isGoToDateModalVisible, setIsGoToDateModalVisible] = useState(false);
  const [goToDateValue, setGoToDateValue] = useState(dayjs());
  const [goToDateMode, setGoToDateMode] = useState("Month");

  const [selectedPersonels, setSelectedPersonels] = useState([]);
  const [selectedAtolyes, setSelectedAtolyes] = useState([]);
  const [selectedLokasyons, setSelectedLokasyons] = useState([]);

  // --- Hangi Popover'ın Açık Olduğunu Tutacak Kritik State ---
  const [visiblePopoverId, setVisiblePopoverId] = useState(null);

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedIsEmriId, setSelectedIsEmriId] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const dateRange = useMemo(() => {
    let start = currentDate.startOf("month");
    let end = currentDate.endOf("month");

    if (calendarMode === "Day") {
      start = currentDate.startOf("day");
      end = currentDate.endOf("day");
    } else if (calendarMode === "Week") {
      start = currentDate.startOf("week");
      end = currentDate.endOf("week");
    } else if (calendarMode === "Work Week") {
      start = currentDate.startOf("week").add(1, "day");
      end = currentDate.startOf("week").add(5, "day");
    } else if (calendarMode === "Agenda") {
      start = currentDate.subtract(1, "month").startOf("month");
      end = currentDate.add(1, "month").endOf("month");
    }

    return {
      StartDate: start.format("YYYY-MM-DDTHH:mm:ss"),
      EndDate: end.format("YYYY-MM-DDTHH:mm:ss"),
    };
  }, [currentDate, calendarMode]);

  const handleFilterChange = useCallback((key, value) => {
    if (key === "filters") {
      if (value.PersonelIds) setSelectedPersonels(value.PersonelIds);
      if (value.AtolyeIds) setSelectedAtolyes(value.AtolyeIds);
      if (value.LokasyonIds) setSelectedLokasyons(value.LokasyonIds);
    }
  }, []);

  const fetchCalendarData = useCallback(async () => {
    try {
      setLoading(true);
      const payload = {
        StartDate: dateRange.StartDate,
        EndDate: dateRange.EndDate,
        PersonelIds: selectedPersonels,
        AtolyeIds: selectedAtolyes,
        LokasyonIds: selectedLokasyons,
      };

      const response = await AxiosInstance.post("GetPersonelTakvim", payload);

      if (response && !response.has_error && Array.isArray(response.data)) {
        setCalendarData(response.data);
      } else {
        console.error("API hatası veya beklenmeyen veri formatı:", response);
        setCalendarData([]);
      }
    } catch (error) {
      console.error("Takvim verisi çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, selectedPersonels, selectedAtolyes, selectedLokasyons]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  const refreshCalendarData = useCallback(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  const getEventStatusConfig = (statusId) => {
    switch (statusId) {
      case 2: return { color: "#1890ff", badgeStatus: "processing", text: "İş Emri / Meşgul" };
      case 3: return { color: "#ff4d4f", badgeStatus: "error", text: "İzinli / Yok" };
      default: return { color: "#d9d9d9", badgeStatus: "default", text: "Bilinmeyen" };
    }
  };

  const getDailyEvents = (dateObj) => {
    const stringDate = dateObj.format("YYYY-MM-DD");
    return calendarData.filter((event) => {
      const start = dayjs(event.BASLAMA_TARIH).format("YYYY-MM-DD");
      const end = dayjs(event.BITIS_TARIH).format("YYYY-MM-DD");
      return stringDate >= start && stringDate <= end;
    });
  };

  // --- İş Emri Açıldığında Popover'ı Kapatma Müdahalesi ---
  const handleOpenIsEmri = useCallback((isEmriId, record = null) => {
    if (isEmriId && isEmriId > 0) {
      setVisiblePopoverId(null); // CRITICAL FIX: Açık olan Popover'ı anında kapatır!
      setSelectedIsEmriId(isEmriId);
      setSelectedRowData(record ? record : { ISEMRI_ID: isEmriId });
      setIsEditDrawerOpen(true);
    }
  }, []);

  const renderPopoverContent = (item, config) => (
    <div style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>
      <p><strong>Personel:</strong> {item.IDK_PERSONEL}</p>
      <p><strong>Durum:</strong> <Tag color={config.color}>{config.text}</Tag></p>
      
      {item.ISEMRI_ID > 0 && item.ISEMRI_KOD && (
        <p>
          <strong>İş Emri Kodu:</strong>{" "}
          <span 
            onClick={() => handleOpenIsEmri(item.ISEMRI_ID, item)}
            style={{ 
              color: "#1890ff", 
              cursor: "pointer", 
              fontWeight: "bold",
              textDecoration: "underline" 
            }}
          >
            {item.ISEMRI_KOD}
          </span>
        </p>
      )}

      <p><strong>Başlangıç:</strong> {dayjs(item.BASLAMA_TARIH).format("DD.MM.YYYY HH:mm")}</p>
      <p><strong>Bitiş:</strong> {dayjs(item.BITIS_TARIH).format("DD.MM.YYYY HH:mm")}</p>
      <hr style={{ border: "0.5px solid #f0f0f0", margin: "8px 0" }} />
      <div style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
        {item.ISM_ICERIK}
      </div>
    </div>
  );

  const dateCellRender = (value) => {
    const dailyEvents = getDailyEvents(value);
    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "90px", overflowY: "auto" }}>
        {dailyEvents.map((item) => {
          const config = getEventStatusConfig(item.IDK_DURUM);
          return (
            <li key={item.TB_ISEMRI_KAYNAK_ID} style={{ marginBottom: 2 }}>
              {/* CRITICAL FIX: Popover'ın open durumunu state'e bağlıyoruz */}
              <Popover 
                content={renderPopoverContent(item, config)} 
                title="Detay Bilgisi" 
                trigger="click"
                open={visiblePopoverId === item.TB_ISEMRI_KAYNAK_ID}
                onOpenChange={(visible) => {
                  setVisiblePopoverId(visible ? item.TB_ISEMRI_KAYNAK_ID : null);
                }}
              >
                <div style={{
                  backgroundColor: config.color + "15",
                  borderLeft: `3px solid ${config.color}`,
                  padding: "1px 4px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "11px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "pre-wrap"
                }}>
                  <Badge status={config.badgeStatus} text={<Text strong style={{ fontSize: 11 }}>{item.IDK_PERSONEL}</Text>} />
                </div>
              </Popover>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderCustomViews = () => {
    let targetDates = [];

    if (calendarMode === "Day") {
      targetDates = [currentDate];
    } else if (calendarMode === "Week") {
      const startOfWeek = currentDate.startOf("week");
      for (let i = 0; i < 7; i++) {
        targetDates.push(startOfWeek.add(i, "day"));
      }
    } else if (calendarMode === "Work Week") {
      const startOfWeek = currentDate.startOf("week").add(1, "day");
      for (let i = 0; i < 5; i++) {
        targetDates.push(startOfWeek.add(i, "day"));
      }
    } else if (calendarMode === "Agenda") {
      const sortedEvents = [...calendarData].sort((a, b) => dayjs(a.BASLAMA_TARIH).diff(dayjs(b.BASLAMA_TARIH)));
      return (
        <List
          bordered
          dataSource={sortedEvents}
          locale={{ emptyText: "Bu dönemde planlanmış bir ajanda kaydı bulunamadı." }}
          renderItem={(item) => {
            const config = getEventStatusConfig(item.IDK_DURUM);
            return (
              <List.Item key={item.TB_ISEMRI_KAYNAK_ID}>
                <Row style={{ width: "100%" }} align="middle" gutter={16}>
                  <Col span={6}>
                    <Text strong>{dayjs(item.BASLAMA_TARIH).format("DD MMMM YYYY, dddd")}</Text>
                    <br />
                    <Text type="secondary">{dayjs(item.BASLAMA_TARIH).format("HH:mm")} - {dayjs(item.BITIS_TARIH).format("HH:mm")}</Text>
                  </Col>
                  <Col span={4}>
                    <Tag color={config.color}>{item.IDK_PERSONEL}</Tag>
                  </Col>
                  <Col span={14} style={{ whiteSpace: "pre-wrap", background: "#fcfcfc", padding: "8px", borderRadius: "4px", borderLeft: `3px solid ${config.color}` }}>
                    {item.ISM_ICERIK}
                  </Col>
                </Row>
              </List.Item>
            );
          }}
        />
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {targetDates.map((dateItem) => {
          const events = getDailyEvents(dateItem);
          const isToday = dateItem.isSame(dayjs(), "day");
          return (
            <Col span={calendarMode === "Day" ? 24 : 4} key={dateItem.format("DD-MM")} style={{ flexGrow: 1 }}>
              <Card
                title={
                  <div style={{ textAlign: "center" }}>
                    <Text strong style={{ color: isToday ? "#1890ff" : "inherit" }}>{dateItem.format("DD MMMM")}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>{dateItem.format("dddd")}</Text>
                  </div>
                }
                bodyStyle={{ padding: "10px", height: "300px", overflowY: "auto", backgroundColor: isToday ? "#e6f7ff33" : "#fff" }}
                size="small"
              >
                {events.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#ccc", paddingTop: "40px" }}>Kayıt Yok</div>
                ) : (
                  events.map((item) => {
                    const config = getEventStatusConfig(item.IDK_DURUM);
                    return (
                      /* CRITICAL FIX: Custom View'lardaki Popover'ların open durumunu da state'e bağlıyoruz */
                      <Popover 
                        key={item.TB_ISEMRI_KAYNAK_ID} 
                        content={renderPopoverContent(item, config)} 
                        title="Detay Bilgisi" 
                        trigger="click"
                        open={visiblePopoverId === item.TB_ISEMRI_KAYNAK_ID}
                        onOpenChange={(visible) => {
                          setVisiblePopoverId(visible ? item.TB_ISEMRI_KAYNAK_ID : null);
                        }}
                      >
                        <div style={{
                          backgroundColor: config.color + "15",
                          borderLeft: `3px solid ${config.color}`,
                          padding: "6px",
                          borderRadius: "4px",
                          marginBottom: "6px",
                          cursor: "pointer"
                        }}>
                          <Badge status={config.badgeStatus} text={<Text strong>{item.IDK_PERSONEL}</Text>} />
                          <div style={{ fontSize: "11px", color: "#666", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {item.ISM_ICERIK}
                          </div>
                        </div>
                      </Popover>
                    );
                  })
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  const handleNavigate = (direction) => {
    let amount = 1;
    let unit = "month"; 

    if (calendarMode === "Day") {
      unit = "day";
    } else if (calendarMode === "Week" || calendarMode === "Work Week") {
      unit = "week";
    } else if (calendarMode === "Agenda") {
      unit = "month"; 
    }

    if (direction === "prev") {
      setCurrentDate(currentDate.subtract(amount, unit));
    } else {
      setCurrentDate(currentDate.add(amount, unit));
    }
  };

  const handleGoToDateOk = () => {
    setCurrentDate(goToDateValue);
    setCalendarMode(goToDateMode);
    setIsGoToDateModalVisible(false);
  };

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", marginBottom: "20px", gap: "10px", padding: "0 5px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <Filters onChange={handleFilterChange} handleOpenIsEmri={handleOpenIsEmri} />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button icon={<CalendarOutlined />} onClick={() => setIsGoToDateModalVisible(true)}>
            Tarihe Git
          </Button>
        </div>
      </div>

      <Spin spinning={loading} tip="Veriler Güncelleniyor...">
        <Card bodyStyle={{ padding: "15px" }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
            <Col>
              <Space size="large">
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {currentDate.format(calendarMode === "Month" ? "MMMM YYYY" : "DD MMMM YYYY").toUpperCase()}
                </Typography.Title>
                
                <Radio.Group size="small" value={calendarMode} onChange={(e) => setCalendarMode(e.target.value)}>
                  <Radio.Button value="Day">Gün</Radio.Button>
                  <Radio.Button value="Week">Hafta</Radio.Button>
                  <Radio.Button value="Month">Ay</Radio.Button>
                  <Radio.Button value="Work Week">Çalışma Haftası</Radio.Button>
                  <Radio.Button value="Agenda">Ajanda</Radio.Button>
                </Radio.Group>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button size="small" icon={<LeftOutlined />} onClick={() => handleNavigate("prev")} />
                <Button size="small" onClick={() => setCurrentDate(dayjs())}>Bugün</Button>
                <Button size="small" icon={<RightOutlined />} onClick={() => handleNavigate("next")} />
              </Space>
            </Col>
          </Row>

          {calendarMode === "Month" ? (
            <Calendar
              value={currentDate}
              headerRender={() => null} 
              dateCellRender={dateCellRender}
              onChange={(date) => setCurrentDate(date)}
            />
          ) : (
            renderCustomViews()
          )}
        </Card>
      </Spin>

      <Modal
        title="Tarih Seçin"
        open={isGoToDateModalVisible}
        onOk={handleGoToDateOk}
        onCancel={() => setIsGoToDateModalVisible(false)}
        width={400}
        okText="Tamam"
        cancelText="İptal"
        centered
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", paddingTop: "10px" }}>
          <Row align="middle">
            <Col span={8}><Text>Tarih:</Text></Col>
            <Col span={16}>
              <DatePicker style={{ width: "100%" }} value={goToDateValue} onChange={(date) => date && setGoToDateValue(date)} format="DD.MM.YYYY" allowClear={false} />
            </Col>
          </Row>
          <Row align="middle">
            <Col span={8}><Text>Gösterim:</Text></Col>
            <Col span={16}>
              <Select
                style={{ width: "100%" }}
                value={goToDateMode}
                onChange={(value) => setGoToDateMode(value)}
                options={[
                  { value: "Day", label: "Gün" },
                  { value: "Week", label: "Hafta" },
                  { value: "Month", label: "Ay" },
                  { value: "Work Week", label: "Çalışma Haftası" },
                  { value: "Agenda", label: "Ajanda" },
                ]}
              />
            </Col>
          </Row>
        </div>
      </Modal>

      {isEditDrawerOpen && (
        <IsEmri
          drawerVisible={isEditDrawerOpen}
          onDrawerClose={() => {
            setIsEditDrawerOpen(false);
            setSelectedIsEmriId(null);
            setSelectedRowData(null);
            refreshCalendarData();
          }}
          onRefresh={refreshCalendarData}
          selectedRow={{ 
            ...selectedRowData, 
            key: selectedRowData?.ISEMRI_ID 
          }}
        />
      )}
    </>
  );
};

export default MainCalendar;