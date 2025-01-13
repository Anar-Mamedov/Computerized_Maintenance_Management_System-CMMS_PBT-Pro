import React, { useEffect, useState, useRef } from "react";
import { Table, Typography, Spin, Button, Popover, Modal, DatePicker, ConfigProvider, Tour, Input } from "antd";
import { DownloadOutlined, MoreOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http.jsx";
import { Controller, useFormContext } from "react-hook-form";
import "jspdf-autotable";
import dayjs from "dayjs";
import trTR from "antd/lib/locale/tr_TR";
import { CSVLink } from "react-csv";

const { Text } = Typography;

// Türkçe karakterleri İngilizce karşılıkları ile değiştiren fonksiyon
const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
};

function PersonellerMudahaleSuresi(props) {
  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const [loadings, setLoadings] = useState([]);
  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredData1, setFilteredData1] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false); // Popover için state
  const [tourVisible, setTourVisible] = useState(false); // Tour için state
  const ref1 = useRef(null);
  const [isExpandedModalVisible, setIsExpandedModalVisible] = useState(false); // Expanded modal visibility state

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  // sistemin locale'una göre tarih formatlamasını yapar
  const formatDateWithLocale = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(navigator.language).format(date);
  };

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
      hour: "numeric",
      minute: "numeric",
    });
    const sampleTime = new Date(2021, 10, 21, 13, 45); // Use a sample time, e.g., 13:45
    const formattedSampleTime = timeFormatter.format(sampleTime);

    // Check if the formatted time contains AM/PM, which implies a 12-hour format
    const is12HourFormat = /AM|PM/.test(formattedSampleTime);
    setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  const columns = [
    {
      title: "Personel",
      dataIndex: "PRS_ISIM",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.PRS_ISIM === null && b.PRS_ISIM === null) return 0;
        if (a.PRS_ISIM === null) return 1;
        if (b.PRS_ISIM === null) return -1;
        return a.PRS_ISIM.localeCompare(b.PRS_ISIM);
      },
    },
    {
      title: "Toplam Talebi Sayısı",
      dataIndex: "TalepSayisi",
      // width: 100,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.TalepSayisi === null && b.TalepSayisi === null) return 0;
        if (a.TalepSayisi === null) return 1;
        if (b.TalepSayisi === null) return -1;
        return a.TalepSayisi - b.TalepSayisi;
      },
    },
    {
      title: "Ortalama Müdahale Süresi (dk.)",
      dataIndex: "OrtalamaMudahaleSuresi",
      // width: 100,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.OrtalamaMudahaleSuresi === null && b.OrtalamaMudahaleSuresi === null) return 0;
        if (a.OrtalamaMudahaleSuresi === null) return 1;
        if (b.OrtalamaMudahaleSuresi === null) return -1;
        return a.OrtalamaMudahaleSuresi - b.OrtalamaMudahaleSuresi;
      },
    },
  ];

  const lokasyonId = watch("locationIds");
  const atolyeId = watch("atolyeIds");
  const makineId = watch("makineIds");
  const baslangicTarihi = watch("baslangicTarihi");
  const bitisTarihi = watch("bitisTarihi");

  const fetchData = async () => {
    setIsLoading(true);
    const body = {
      LokasyonId: lokasyonId || "",
      AtolyeId: atolyeId || "",
      MakineId: makineId || "",
      BaslangicTarih: baslangicTarihi ? dayjs(baslangicTarihi).format("YYYY-MM-DD") : "",
      BitisTarih: bitisTarihi ? dayjs(bitisTarihi).format("YYYY-MM-DD") : "",
      // Yil: currentYear,
    };
    try {
      const response = await AxiosInstance.post(`GetMudahaleAnalizPersonelGraph`, body);
      const formattedData = response.map((item) => ({
        ...item,
        key: item.TB_PERSONEL_ID,
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lokasyonId, atolyeId, makineId, baslangicTarihi, bitisTarihi]);

  const handleModalOpen = () => {
    setIsExpandedModalVisible(true);
    setPopoverVisible(false); // Modal açıldığında popover'ı kapatır
  };

  const handleTourOpen = () => {
    setTourVisible(true); // Tour'u açar
    setPopoverVisible(false); // Popover'ı kapatır
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ cursor: "pointer" }} onClick={handleModalOpen}>
        Büyüt
      </div>
      <div style={{ cursor: "pointer" }} onClick={handleTourOpen}>
        Bilgi
      </div>
    </div>
  );

  const steps = [
    {
      title: "Bilgi",
      description: (
        <div style={{ overflow: "auto", height: "100%", maxHeight: "200px" }}>
          <p>Belirli lokasyonlardaki ya da Atölyelerdeki iş yükünü veya taleplerin dağılımını daha iyi anlayabilmek ve buna göre kararlar alabilmek için kullanılır.</p>
        </div>
      ),

      target: () => ref1.current,
    },
  ];

  // Arama işlevselliği için handleSearch fonksiyonları
  const handleSearch1 = (e) => {
    const value = e.target.value;
    setSearchTerm1(value);
    const normalizedSearchTerm = normalizeText(value);
    if (value) {
      const filtered = data.filter((item) =>
        Object.keys(item).some((key) => item[key] && normalizeText(item[key].toString()).toLowerCase().includes(normalizedSearchTerm.toLowerCase()))
      );
      setFilteredData1(filtered);
    } else {
      setFilteredData1(data);
    }
  };

  // csv dosyası için tablo başlık oluştur

  const csvHeaders = columns.map((col) => ({
    label: col.title,
    key: col.dataIndex,
  }));

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  };

  return (
    <ConfigProvider locale={trTR}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "5px",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          border: "1px solid #f0f0f0",
          filter: "drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.1))",
        }}
      >
        <div style={{ padding: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "500", fontSize: "17px" }}>
            Personel Müdahele Süresi {`(${baslangicTarihi && bitisTarihi ? `${formatDateWithLocale(baslangicTarihi)} / ${formatDateWithLocale(bitisTarihi)}` : ""})`}
          </Text>
          <Popover placement="bottom" content={content} trigger="click" open={popoverVisible} onOpenChange={(visible) => setPopoverVisible(visible)}>
            <Button type="text" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0px 5px", height: "32px", zIndex: 3 }}>
              <MoreOutlined style={{ cursor: "pointer", fontWeight: "500", fontSize: "16px" }} />
            </Button>
          </Popover>
        </div>
        <div ref={ref1} style={{ display: "flex", flexDirection: "column", gap: "7px", overflow: "hidden", padding: "0px 10px 0 10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Input placeholder="Arama..." value={searchTerm1} onChange={handleSearch1} style={{ width: "300px" }} />

            {/*csv indirme butonu*/}
            <CSVLink data={data} headers={csvHeaders} filename={`Personeller_Mudahale_Suresi.csv`} className="ant-btn ant-btn-primary">
              <Button type="primary" icon={<DownloadOutlined />} loading={loadings[1]} onClick={() => enterLoading(1)}>
                İndir
              </Button>
            </CSVLink>
          </div>
          <div style={{ width: "100%", height: "calc(100% - 5px)", overflow: "auto" }}>
            <Spin spinning={isLoading}>
              <Table
                columns={columns}
                dataSource={filteredData1.length > 0 || searchTerm1 ? filteredData1 : data}
                size="small"
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  position: ["bottomRight"],
                  showTotal: (total, range) => `Toplam ${total}`,
                  showQuickJumper: true,
                }}
                scroll={{ y: "100vh" }}
              />
            </Spin>
          </div>
        </div>
        <Tour open={tourVisible} onClose={() => setTourVisible(false)} steps={steps} />

        {/* Expanded Modal */}
        <Modal
          title={
            <div>
              <Text style={{ fontWeight: "500", fontSize: "17px" }}>
                Personel Müdahele Süresi {`(${baslangicTarihi && bitisTarihi ? `${formatDateWithLocale(baslangicTarihi)} / ${formatDateWithLocale(bitisTarihi)}` : ""})`}
              </Text>
            </div>
          }
          centered
          open={isExpandedModalVisible}
          onOk={() => setIsExpandedModalVisible(false)}
          onCancel={() => setIsExpandedModalVisible(false)}
          width="90%"
          destroyOnClose
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px" }}>
              <Input placeholder="Arama..." value={searchTerm1} onChange={handleSearch1} style={{ width: "300px" }} />

              {/*csv indirme butonu*/}
              <CSVLink data={data} headers={csvHeaders} filename={`Personeller_Mudahale_Suresi.csv`} className="ant-btn ant-btn-primary">
                <Button type="primary" icon={<DownloadOutlined />} loading={loadings[1]} onClick={() => enterLoading(1)}>
                  İndir
                </Button>
              </CSVLink>
            </div>
            <Spin spinning={isLoading}>
              <Table
                columns={columns}
                dataSource={filteredData1.length > 0 || searchTerm1 ? filteredData1 : data}
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  position: ["bottomRight"],
                  showTotal: (total, range) => `Toplam ${total}`,
                  showQuickJumper: true,
                }}
                scroll={{ y: "calc(100vh - 380px)" }}
              />
            </Spin>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default PersonellerMudahaleSuresi;
