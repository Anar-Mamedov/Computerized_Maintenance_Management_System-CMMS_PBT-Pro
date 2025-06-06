import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message, Table } from "antd";
import AxiosInstance from "../../../../../../api/http.jsx";
import { Controller, useForm, FormProvider, useFormContext } from "react-hook-form";
import dayjs from "dayjs";
// import MainTabs from "./MainTabs/MainTabs";
import EditModal from "./EditModal.jsx";
import EditDrawer1 from "../../../../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer.jsx";
import { CSVLink } from "react-csv";
import { DownloadOutlined } from "@ant-design/icons";

import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";

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

export default function DorduncuTablo({ selectedRowUcuncuTablo, isModalVisibleUcuncuTablo, onModalClose, onRefresh, secilenIsEmriID }) {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]); // Seçilen satırların verilerini tutacak state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loadings, setLoadings] = useState([]);
  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredData1, setFilteredData1] = useState([]);

  const [editDrawer1Data, setEditDrawer1Data] = useState(null);

  const handleChangeModalVisible = () => {
    onModalClose(); // Modal'ı kapat
    onRefresh(); // Tabloyu yenile
  };

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

  const columns = [
    {
      title: "İş Emri No",
      dataIndex: "ISM_ISEMRI_NO",
      key: "ISM_ISEMRI_NO",
      width: 200,
      ellipsis: true,
      onCell: (record) => ({
        onClick: (event) => {
          event.stopPropagation();

          // Burada, record objesini doğrudan kullanmak yerine,
          // bir kopyasını oluşturup `key` değerini `ISM_DURUM_KOD_ID` ile güncelliyoruz.
          const updatedRecord = { ...record, key: record.TB_ISEMRI_ID };
          // const updatedRecord = { ...record, key: 378 };

          setEditDrawer1Data(updatedRecord); // Güncellenmiş record'u EditDrawer1 için data olarak ayarla
          setIsModalVisible(true); // EditDrawer1'i aç
        },
      }),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "İş Emri Konusu",
      dataIndex: "ISM_ACIKLAMA",
      key: "ISM_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },

    // {
    //   title: "Personel İsim",
    //   dataIndex: "PRS_ISIM",
    //   key: "PRS_ISIM",
    //   width: 200,
    //   ellipsis: true,
    // },
    // {
    //   title: "Ünvan",
    //   dataIndex: "PRS_UNVAN",
    //   key: "PRS_UNVAN",
    //   width: 200,
    //   ellipsis: true,
    // },

    {
      title: "Çalışma Süresi (dk.)",
      dataIndex: "TOPLAM_CALISMA_SURESI",
      key: "TOPLAM_CALISMA_SURESI",
      width: 200,
      ellipsis: true,
    },

    {
      title: "Maliyet",
      dataIndex: "TOPLAM_MALIYET",
      key: "TOPLAM_MALIYET",
      width: 200,
      ellipsis: true,
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(
        `RaporGetPersonelIsemri?PersonelID=${selectedRowUcuncuTablo.TB_PERSONEL_ID}&RaporIsTipID=${selectedRowUcuncuTablo.TB_ISEMRI_TIP_ID}&RaporIsTanimID=${selectedRowUcuncuTablo.TB_IS_TANIM_ID}`
      );
      const fetchedData = response.map((item) => ({
        ...item,
        key: item.TB_ISEMRI_ID,
        ORTALAMA_CALISMA_SURESI: item.TOPLAM_CALISMA_SURESI && item.ISEMRI_SAYISI ? (item.TOPLAM_CALISMA_SURESI / item.ISEMRI_SAYISI).toFixed(2) : "",
      }));
      setData(fetchedData);
    } catch (error) {
      console.error("API isteği sırasında hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Bağımlılık dizisi boş, bu yüzden useEffect yalnızca bileşen ilk render edildiğinde çalışır

  const onRowSelectChange = (selectedKeys, selectedRows) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedRowsData(selectedRows); // Seçilen satırların verilerini state'e ekler
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetchData(); // fetch fonksiyonu tabloyu yeniler
  }, [fetchData]);

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

  const [xlsxLoading, setXlsxLoading] = useState(false);

  // Excel indirme işlevi
  const handleDownloadXLSX = () => {
    try {
      setXlsxLoading(true);
      const tableData = filteredData1.length > 0 || searchTerm1 ? filteredData1 : data;

      // Sütun başlıklarını kolonlardan otomatik olarak al
      const exportHeaders = columns.reduce((acc, column) => {
        acc[column.dataIndex] = column.title;
        return acc;
      }, {});

      // Tablodan indireceğimiz verileri hazırlama
      const exportData = tableData.map((item) => {
        const row = {};
        columns.forEach((column) => {
          row[column.title] = item[column.dataIndex] !== undefined ? item[column.dataIndex] : "";
        });
        return row;
      });

      // Worksheet oluşturma
      const ws = XLSX.utils.json_to_sheet(exportData, { header: columns.map((col) => col.title) });

      // Sütun genişliklerini ayarla
      const wscols = columns.map((col) => ({ wch: Math.max(col.title.length, (col.width || 120) / 8) }));
      ws["!cols"] = wscols;

      // İş emri tipi başlığından dosya adı oluşturma
      const randomId = Math.random().toString(36).substring(2, 8);
      const fileName = `analiz_${randomId}_${dayjs().format("YYYY-MM-DD")}.xlsx`;

      // Workbook oluşturma ve worksheet ekleme
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "İş Analizi");

      // Dosyayı indirme
      XLSX.writeFile(wb, fileName);

      message.success("Excel dosyası başarıyla indirildi");
    } catch (error) {
      console.error("Excel indirme hatası:", error);
      message.error("Excel dosyası indirilirken bir hata oluştu");
    } finally {
      setXlsxLoading(false);
    }
  };

  return (
    <div>
      <Modal
        width="1200px"
        centered
        title={`İş Emirleri (${selectedRowUcuncuTablo?.IST_TANIM})`}
        open={isModalVisibleUcuncuTablo}
        onOk={handleChangeModalVisible}
        onCancel={onModalClose}
      >
        <div style={{ marginBottom: "25px" }}>
          {/*<CreateModal onRefresh={refreshTable} secilenIsEmriID={secilenIsEmriID} />*/}
          <div
            style={{
              display: "flex",
              marginBottom: "15px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Input placeholder="Arama..." value={searchTerm1} onChange={handleSearch1} style={{ width: "300px" }} />

            {/*csv indirme butonu*/}
            {/* <CSVLink data={data} headers={csvHeaders} filename={`personel_is_Emirleri.csv`} className="ant-btn ant-btn-primary">
              <Button type="primary" icon={<DownloadOutlined />} loading={loadings[1]} onClick={() => enterLoading(1)}>
                İndir
              </Button>
            </CSVLink> */}

            <Button style={{ display: "flex", alignItems: "center" }} onClick={handleDownloadXLSX} loading={xlsxLoading} icon={<SiMicrosoftexcel />}>
              İndir
            </Button>
          </div>
          <Table
            // rowSelection={{
            //   type: "checkbox",
            //   selectedRowKeys,
            //   onChange: onRowSelectChange,
            // }}
            // onRow={(record) => ({
            //   onClick: () => onRowClick(record),
            // })}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              position: ["bottomRight"],
              showTotal: (total, range) => `Toplam ${total}`,
              showQuickJumper: true,
            }}
            columns={columns}
            dataSource={filteredData1.length > 0 || searchTerm1 ? filteredData1 : data}
            loading={loading}
            scroll={{
              // x: "auto",
              y: "calc(100vh - 390px)",
            }}
          />
          {/*{isModalVisible && (*/}
          {/*  <EditModal*/}
          {/*    selectedRow={selectedRow}*/}
          {/*    isModalVisible={isModalVisible}*/}
          {/*    onModalClose={() => {*/}
          {/*      setIsModalVisible(false);*/}
          {/*      setSelectedRow(null);*/}
          {/*    }}*/}
          {/*    onRefresh={refreshTable}*/}
          {/*    secilenIsEmriID={secilenIsEmriID}*/}
          {/*  />*/}
          {/*)}*/}
          {isModalVisible && (
            <EditDrawer1
              selectedRow={editDrawer1Data}
              onDrawerClose={() => setIsModalVisible(false)}
              drawerVisible={isModalVisible}
              onRefresh={() => {
                /* Veri yenileme işlemi */
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
